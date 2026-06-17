"use client";

import * as React from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// useLayoutEffect avisa no SSR; no servidor cai para useEffect.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Coluna declarativa: é a ÚNICA fonte de verdade para os dois layouts.
 * Na tabela vira `<th>`/`<td>`; quando a tabela não cabe, o mesmo `cell`
 * é reaproveitado dentro de um card.
 */
export type DataTableColumn<T> = {
  id: string;
  header: React.ReactNode;
  cell: (row: T) => React.ReactNode;
  /** Coluna de destaque: vira o cabeçalho do card (sem label). Ex.: avatar + nome. */
  primary?: boolean;
  /** No card, mostra só o valor (sem o rótulo da coluna). */
  hideLabelOnCard?: boolean;
  headerClassName?: string;
  cellClassName?: string;
};

/** Largura mínima da tabela antes de ela ter que virar card. */
export type DataTableSize = "sm" | "md" | "lg" | "xl";

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowKey: (row: T) => string;
  /** Botões de ação por linha: última coluna na tabela, rodapé no card. */
  actions?: (row: T) => React.ReactNode;
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  onRowClick?: (row: T) => void;
  /** Largura mínima da tabela. Default `lg`. */
  size?: DataTableSize;
  /** Avisa quando alterna entre tabela e cards (para o container soltar a casca). */
  onModeChange?: (mode: "table" | "cards") => void;
  className?: string;
};

const HEADER_CLASS =
  "h-[52px] px-6 align-middle text-[11px] font-semibold uppercase tracking-wider text-text-tertiary";

const MIN_WIDTH: Record<DataTableSize, string> = {
  sm: "min-w-[640px]",
  md: "min-w-[800px]",
  lg: "min-w-[960px]",
  xl: "min-w-[1200px]",
};

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  actions,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado.",
  onRowClick,
  size = "lg",
  onModeChange,
  className,
}: DataTableProps<T>) {
  const hasActions = Boolean(actions);
  const totalCols = columns.length + (hasActions ? 1 : 0);

  const primaryColumns = columns.filter((column) => column.primary);
  const infoColumns = columns.filter((column) => !column.primary);

  // Vira card medindo o overflow REAL da tabela (não um breakpoint adivinhado):
  // assim que o conteúdo não cabe no container, `scrollWidth > clientWidth`.
  const scrollRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const measure = () => setOverflowing(el.scrollWidth > el.clientWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [columns, data, isLoading]);

  useEffect(() => {
    onModeChange?.(overflowing ? "cards" : "table");
  }, [overflowing, onModeChange]);

  return (
    <div className={cn("relative w-full flex-1", className)}>
      {/* TABELA — sempre montada (para medir). Quando não cabe, fica oculta mas
          ainda mensurável (invisible/absolute, nunca display:none). */}
      <div
        ref={scrollRef}
        aria-hidden={overflowing}
        className={cn(
          "overflow-x-auto border-t border-border-light",
          overflowing &&
            "pointer-events-none invisible absolute inset-x-0 top-0",
        )}
      >
        <table className={cn("w-full caption-bottom text-sm", MIN_WIDTH[size])}>
          <TableHeader className="bg-white">
            <TableRow className="border-b border-border-light hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(HEADER_CLASS, column.headerClassName)}
                >
                  {column.header}
                </TableHead>
              ))}
              {hasActions ? (
                <TableHead className={cn(HEADER_CLASS, "text-right")}>
                  Ações
                </TableHead>
              ) : null}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={totalCols}
                  className="h-32 text-center text-text-tertiary"
                >
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-brand-primary" />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={totalCols}
                  className="h-32 text-center text-text-tertiary"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow
                  key={getRowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "group border-b border-border-light transition-colors hover:bg-background-card/50",
                    onRowClick && "cursor-pointer",
                  )}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      className={cn("px-6 py-5 align-middle", column.cellClassName)}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                  {hasActions ? (
                    <TableCell className="px-6 py-5 align-middle">
                      <div className="flex justify-end gap-1">{actions!(row)}</div>
                    </TableCell>
                  ) : null}
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>

      {/* CARDS — só quando a tabela não caberia (apareceria a barra de scroll). */}
      {overflowing ? (
        <div className="flex flex-col gap-3">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-text-tertiary">
              <Loader2 className="h-6 w-6 animate-spin text-brand-primary" />
            </div>
          ) : data.length === 0 ? (
            <div className="flex h-32 items-center justify-center px-4 text-center text-text-tertiary">
              {emptyMessage}
            </div>
          ) : (
            data.map((row) => (
              <Card
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn("gap-3 px-4 py-4", onRowClick && "cursor-pointer")}
              >
                {primaryColumns.map((column) => (
                  <div key={column.id}>{column.cell(row)}</div>
                ))}

                <dl className="flex flex-col gap-2">
                  {infoColumns.map((column) => (
                    <div
                      key={column.id}
                      className="flex items-start justify-between gap-3"
                    >
                      {column.hideLabelOnCard ? null : (
                        <dt className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                          {column.header}
                        </dt>
                      )}
                      <dd
                        className={cn(
                          "min-w-0 text-right text-[13px] font-medium text-text-secondary",
                          column.hideLabelOnCard && "w-full text-left",
                        )}
                      >
                        {column.cell(row)}
                      </dd>
                    </div>
                  ))}
                </dl>

                {hasActions ? (
                  <div className="flex justify-end gap-1 border-t border-border-light pt-3">
                    {actions!(row)}
                  </div>
                ) : null}
              </Card>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
