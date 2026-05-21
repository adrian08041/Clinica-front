"use client";

import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  clearable?: boolean;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Selecione",
  className,
  clearable = true,
}: DatePickerProps) {
  const showClear = clearable && Boolean(value);

  return (
    <div className={cn("relative w-full", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-12 w-full justify-start rounded-lg border-border-light bg-background-card/50 px-4 text-sm font-medium text-text-primary hover:bg-background-card/80 hover:text-text-primary transition-all focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-0",
              !value && "text-text-muted",
              // Reserva espaço pra o botão de limpar (que é sibling absoluto).
              showClear && "pr-12",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-text-muted" />
            <span className="truncate">
              {value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            locale={ptBR}
            autoFocus
          />
        </PopoverContent>
      </Popover>

      {showClear ? (
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="absolute right-3 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-background-hover hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1"
          aria-label="Limpar data"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : null}
    </div>
  );
}
