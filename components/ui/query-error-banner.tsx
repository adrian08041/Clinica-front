"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueryErrorBannerProps {
  title?: string;
  message?: string;
  error?: unknown;
  onRetry?: () => void;
  isRetrying?: boolean;
  className?: string;
}

function extractMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "message" in error) {
    const candidate = (error as { message?: unknown }).message;
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }
  return fallback;
}

export function QueryErrorBanner({
  title = "Não foi possível carregar os dados",
  message,
  error,
  onRetry,
  isRetrying = false,
  className = "",
}: QueryErrorBannerProps) {
  const resolvedMessage = message ?? extractMessage(
    error,
    "Verifique sua conexão ou tente novamente em instantes.",
  );

  return (
    <div
      role="alert"
      className={`flex flex-col gap-4 rounded-2xl border border-[var(--color-danger-soft)] bg-[var(--color-danger-soft)]/40 p-5 md:flex-row md:items-center md:justify-between ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-danger-action)]">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[15px] font-bold text-[var(--color-danger-action)]">
            {title}
          </p>
          <p className="mt-1 text-[14px] font-medium text-[var(--color-danger-action)]/80">
            {resolvedMessage}
          </p>
        </div>
      </div>

      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          disabled={isRetrying}
          className="h-10 shrink-0 rounded-[12px] border-[var(--color-danger-action)] bg-white px-4 text-[14px] font-bold text-[var(--color-danger-action)] hover:bg-[var(--color-danger-soft)]"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
          />
          {isRetrying ? "Tentando..." : "Tentar novamente"}
        </Button>
      ) : null}
    </div>
  );
}
