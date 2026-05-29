"use client"

import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { PencilLine } from "lucide-react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  patientDetailsSchema,
  type PatientDetailsFormData,
} from "@/lib/schemas/patient-schema"
import { useUpdatePatient } from "@/lib/queries/patients"
import { useInsurances as useInsuranceCatalog } from "@/lib/queries/settings"
import {
  formatCpfInput,
  formatPhoneInput,
  toLocalPhoneDigits,
} from "@/components/dashboard/patients/patients-shared"
import { dateToIso, formatDatePtBr, isoToDate } from "@/lib/utils/date"
import type { Patient } from "@/lib/types"

interface PatientPersonalDataTabProps {
  patient: Patient
}

const NO_INSURANCE = "__none__"
const GENDER_OPTIONS = ["Masculino", "Feminino", "Outro"]

function toFormValues(patient: Patient): PatientDetailsFormData {
  return {
    name: patient.name ?? "",
    cpf: formatCpfInput(patient.cpf ?? ""),
    phone: formatPhoneInput(toLocalPhoneDigits(patient.phone)),
    email: patient.email ?? "",
    birthDate: patient.birthDate ?? "",
    gender: patient.gender ?? "",
    address: patient.address ?? "",
    insurance: patient.insurance ?? "",
  }
}

export function PatientPersonalDataTab({ patient }: PatientPersonalDataTabProps) {
  const [editing, setEditing] = useState(false)
  const updatePatient = useUpdatePatient()
  const insuranceCatalogQuery = useInsuranceCatalog()
  const insuranceOptions = (insuranceCatalogQuery.data ?? []).map((item) => item.name)

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientDetailsFormData>({
    resolver: zodResolver(patientDetailsSchema),
    defaultValues: toFormValues(patient),
  })

  // Mantém o form sincronizado quando o paciente é recarregado (ex: após salvar).
  useEffect(() => {
    if (!editing) reset(toFormValues(patient))
  }, [patient, editing, reset])

  const startEditing = () => {
    reset(toFormValues(patient))
    setEditing(true)
  }

  const cancelEditing = () => {
    reset(toFormValues(patient))
    setEditing(false)
  }

  const onSubmit = async (data: PatientDetailsFormData) => {
    try {
      await updatePatient.mutateAsync({
        id: patient.id,
        payload: {
          name: data.name,
          cpf: data.cpf,
          phone: data.phone,
          email: data.email || null,
          birthDate: data.birthDate || null,
          gender: data.gender || null,
          address: data.address || null,
          insurance: data.insurance || null,
        },
      })
      toast.success("Dados atualizados com sucesso!")
      setEditing(false)
    } catch (error: unknown) {
      const apiError = error as { message?: string }
      toast.error(apiError.message || "Erro ao atualizar dados")
    }
  }

  return (
    <Card className="p-8 pt-6">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold text-text-primary">Informações Gerais</h3>
          {editing ? (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={cancelEditing}
                disabled={updatePatient.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="brand" disabled={updatePatient.isPending}>
                {updatePatient.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          ) : (
            <Button type="button" variant="brand" onClick={startEditing}>
              <PencilLine className="size-4" />
              Editar
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
          <div className="flex flex-col space-y-2">
            <Label>Nome Completo</Label>
            <Input readOnly={!editing} {...register("name")} />
            {errors.name ? (
              <span className="text-xs text-danger-text">{errors.name.message}</span>
            ) : null}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Email</Label>
            <Input
              readOnly={!editing}
              type="email"
              placeholder={editing ? "email@exemplo.com" : "-"}
              {...register("email")}
            />
            {errors.email ? (
              <span className="text-xs text-danger-text">{errors.email.message}</span>
            ) : null}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Data de Nascimento</Label>
            {editing ? (
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={isoToDate(field.value)}
                    onChange={(date) => field.onChange(dateToIso(date))}
                    placeholder="Selecione a data"
                  />
                )}
              />
            ) : (
              <Input readOnly value={formatDatePtBr(patient.birthDate) || "-"} />
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Gênero</Label>
            {editing ? (
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input readOnly value={patient.gender || "-"} />
            )}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>CPF</Label>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <Input
                  readOnly={!editing}
                  value={field.value}
                  onChange={(event) => field.onChange(formatCpfInput(event.target.value))}
                  inputMode="numeric"
                />
              )}
            />
            {errors.cpf ? (
              <span className="text-xs text-danger-text">{errors.cpf.message}</span>
            ) : null}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Telefone Principal</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  readOnly={!editing}
                  value={field.value}
                  onChange={(event) => field.onChange(formatPhoneInput(event.target.value))}
                  inputMode="numeric"
                />
              )}
            />
            {errors.phone ? (
              <span className="text-xs text-danger-text">{errors.phone.message}</span>
            ) : null}
          </div>

          <div className="flex flex-col space-y-2">
            <Label>Convênio</Label>
            {editing ? (
              <Controller
                name="insurance"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ? field.value : NO_INSURANCE}
                    onValueChange={(value) =>
                      field.onChange(value === NO_INSURANCE ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o convênio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_INSURANCE}>Sem convênio (Particular)</SelectItem>
                      {insuranceOptions.map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <Input readOnly value={patient.insurance || "Particular"} />
            )}
          </div>

          <div className="flex flex-col space-y-2 md:col-span-2">
            <Label>Endereço Residencial</Label>
            <Input
              readOnly={!editing}
              placeholder={editing ? "Rua, número, complemento, cidade - UF" : "-"}
              {...register("address")}
            />
          </div>
        </div>
      </form>
    </Card>
  )
}
