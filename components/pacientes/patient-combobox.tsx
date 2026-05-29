"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { usePatients } from "@/lib/queries/patients";
import { cn } from "@/lib/utils";

export interface PatientOption {
  id: string;
  name: string;
}

interface PatientComboboxProps {
  value: PatientOption | null;
  onChange: (patient: PatientOption | null) => void;
  placeholder?: string;
  className?: string;
}

export function PatientCombobox({
  value,
  onChange,
  placeholder = "Selecione o paciente...",
  className,
}: PatientComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const patientsQuery = usePatients({ page: 0, size: 20, search });
  const patients = patientsQuery.data?.content ?? [];

  const handleSelect = (patient: PatientOption) => {
    onChange(patient);
    setSearch("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-expanded={open}
          className={cn(
            "relative flex h-9 w-full cursor-pointer items-center rounded-md border border-input bg-transparent pl-11 pr-9 text-left text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0",
            className,
          )}
        >
          <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-icon-muted)]" />
          <span
            className={cn(
              "truncate",
              !value && "text-[var(--color-text-placeholder)]",
            )}
          >
            {value ? value.name : placeholder}
          </span>
          <ChevronsUpDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <div className="relative border-b border-[var(--color-border-panel-alt)] p-2">
          <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-faint-soft)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar paciente..."
            className="border-0 pl-9 shadow-none focus-visible:ring-0"
            autoFocus
          />
        </div>

        <div className="max-h-[240px] overflow-y-auto p-1">
          {patientsQuery.isLoading ? (
            <p className="px-3 py-6 text-center text-sm font-medium text-[var(--color-text-caption)]">
              Carregando pacientes...
            </p>
          ) : patients.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm font-medium text-[var(--color-text-caption)]">
              Nenhum paciente encontrado.
            </p>
          ) : (
            patients.map((patient) => {
              const selected = value?.id === patient.id;
              return (
                <button
                  key={patient.id}
                  type="button"
                  onClick={() => handleSelect({ id: patient.id, name: patient.name })}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-2 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0 text-[var(--color-brand-teal)]",
                      selected ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-[var(--color-ink-panel)]">
                    {patient.name}
                  </span>
                  {patient.cpf ? (
                    <span className="shrink-0 text-xs font-medium text-[var(--color-text-caption)]">
                      {patient.cpf}
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
