"use client";

import { Button } from "@/components/ui/button";

type PatientsPaginationProps = {
  currentPage: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  totalElements: number;
  totalPages: number;
};

export function PatientsPagination({
  currentPage,
  endIndex,
  onPageChange,
  totalElements,
  totalPages,
}: PatientsPaginationProps) {
  const startIndex = currentPage * 20 + 1;

  return (
    <div className="flex shrink-0 flex-col items-center justify-between gap-4 rounded-b-[14px] border-t border-border-light bg-white px-4 py-[16px] sm:flex-row sm:px-6">
      <p className="text-[14px] font-medium text-text-tertiary">
        {totalElements > 0
          ? `Mostrando ${startIndex}-${endIndex} de ${totalElements} pacientes`
          : "Nenhum paciente"}
      </p>

      {totalPages > 1 ? (
        <div className="flex flex-wrap items-center justify-center gap-[6px]">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 0}
            onClick={() => onPageChange(currentPage - 1)}
            className="h-[36px] rounded-[6px] border border-border-light bg-white px-4 font-medium text-text-tertiary shadow-sm hover:text-text-secondary"
          >
            Anterior
          </Button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => (
            <Button
              key={index}
              variant={currentPage === index ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(index)}
              className={
                currentPage === index
                  ? "flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border-none bg-brand-primary p-0 font-medium text-white shadow-md hover:bg-brand-dark"
                  : "flex h-[36px] w-[36px] items-center justify-center rounded-[6px] border border-border-light bg-white p-0 font-medium text-text-secondary shadow-sm hover:bg-background-card"
              }
            >
              {index + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages - 1}
            onClick={() => onPageChange(currentPage + 1)}
            className="h-[36px] rounded-[6px] border border-border-light bg-white px-4 font-medium text-text-secondary shadow-sm hover:bg-background-card"
          >
            Próximo
          </Button>
        </div>
      ) : null}
    </div>
  );
}
