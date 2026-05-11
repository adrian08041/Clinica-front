"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PatientsFiltersProps = {
  insuranceFilter: string;
  insurances: string[];
  onInsuranceFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  search: string;
  sortBy: string;
  statusFilter: string;
};

export function PatientsFilters({
  insuranceFilter,
  insurances,
  onInsuranceFilterChange,
  onSearchChange,
  onSortChange,
  onStatusFilterChange,
  search,
  sortBy,
  statusFilter,
}: PatientsFiltersProps) {
  return (
    <div className="flex shrink-0 flex-col items-center justify-between gap-4 px-4 py-4 lg:flex-row">
      <div className="relative w-full max-w-md lg:flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <Input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Pesquisar por nome, CPF ou telefone..."
          className="h-10 w-full rounded-xl border border-border-light bg-background-card/50 pl-9 text-[14px] placeholder:text-text-muted focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0"
          aria-label="Buscar pacientes"
        />
      </div>

      <div className="flex w-full shrink-0 items-center gap-2 lg:w-auto">
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="h-10 w-[130px] cursor-pointer rounded-[8px] border-border-light bg-white text-[13px] font-medium shadow-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Ativo">Ativo</SelectItem>
            <SelectItem value="Pendente">Pendente</SelectItem>
          </SelectContent>
        </Select>

        <Select value={insuranceFilter} onValueChange={onInsuranceFilterChange}>
          <SelectTrigger className="h-10 w-[160px] cursor-pointer rounded-[8px] border-border-light bg-white text-[13px] font-medium shadow-sm">
            <SelectValue placeholder="Seguro" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {insurances.map((insurance) => (
              <SelectItem key={insurance} value={insurance}>
                {insurance}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="h-10 w-[160px] cursor-pointer rounded-[8px] border-border-light bg-white text-[13px] font-medium text-text-secondary shadow-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name,asc">Nome (A-Z)</SelectItem>
            <SelectItem value="name,desc">Nome (Z-A)</SelectItem>
            <SelectItem value="createdAt,desc">Mais recentes</SelectItem>
            <SelectItem value="createdAt,asc">Mais antigos</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
