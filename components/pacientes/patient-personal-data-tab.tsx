import { ChevronDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Patient } from "@/lib/types"

interface PatientPersonalDataTabProps {
  patient: Patient
}

export function PatientPersonalDataTab({ patient }: PatientPersonalDataTabProps) {
  return (
    <Card className="p-8 pt-6">
      <h3 className="text-lg font-bold text-text-primary mb-6">
        Informações Gerais
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
        <div className="space-y-2 flex flex-col">
          <Label>
            Nome Completo
          </Label>
          <Input
            readOnly
            defaultValue={patient.name}
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label>
            Email
          </Label>
          <Input
            readOnly
            defaultValue={`${patient.name.split(" ")[0].toLowerCase()}.silva@email.com`}
          />
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>
            Data de Nascimento
          </Label>
          <Input
            readOnly
            defaultValue="15/05/1998"
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label>
            Gênero
          </Label>
          <div className="relative">
            <Input
              readOnly
              defaultValue="Feminino"
              className="cursor-default"
            />
            <ChevronDown className="size-5 absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        <div className="space-y-2 flex flex-col">
          <Label>
            CPF
          </Label>
          <Input
            readOnly
            defaultValue={patient.cpf}
          />
        </div>
        <div className="space-y-2 flex flex-col">
          <Label>
            Telefone Principal
          </Label>
          <Input
            readOnly
            defaultValue={patient.phone}
          />
        </div>

        <div className="space-y-2 flex flex-col md:col-span-2">
          <Label>
            Endereço Residencial
          </Label>
          <Input
            readOnly
            defaultValue="Rua das Flores, 123 - Apto 45, São Paulo - SP"
          />
        </div>
      </div>
    </Card>
  )
}
