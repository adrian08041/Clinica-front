"use client";

import { useRef } from "react";
import { Upload, File, FileText, Loader2, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  usePatientDocuments,
  useUploadDocument,
  useDeleteDocument,
  type PatientDocumentResponse,
} from "@/lib/queries/documents";

interface PatientDocumentsTabProps {
  patientId: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
] as const;
const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"] as const;
const ACCEPT_ATTR = ALLOWED_EXTENSIONS.join(",");

function isAllowedFile(file: File): boolean {
  const lowerName = file.name.toLowerCase();
  const hasAllowedExt = ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
  const hasAllowedMime = (ALLOWED_MIME_TYPES as readonly string[]).includes(file.type);
  // Some browsers send empty content-type for some extensions; allow if extension matches.
  return hasAllowedMime || hasAllowedExt;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isPdf(doc: PatientDocumentResponse): boolean {
  return (
    doc.contentType === "application/pdf" ||
    doc.fileName.toLowerCase().endsWith(".pdf")
  );
}

function DocumentPreview({ doc }: { doc: PatientDocumentResponse }) {
  if (isPdf(doc)) {
    return (
      <div className="h-[180px] bg-background-hover flex items-center justify-center">
        <FileText className="size-12 text-border-light stroke-[1.5]" />
      </div>
    );
  }

  return (
    <div className="h-[180px] bg-background-card p-4 flex items-center justify-center">
      <div className="w-full h-full rounded-lg bg-background-card overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/40 to-brand-dark/60 opacity-90" />
        <div className="absolute inset-0 flex items-center justify-center text-white/40">
          <File className="size-16" />
        </div>
      </div>
    </div>
  );
}

export function PatientDocumentsTab({ patientId }: PatientDocumentsTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: documents, isLoading, isError } = usePatientDocuments(patientId);
  const uploadMutation = useUploadDocument();
  const deleteMutation = useDeleteDocument();

  const handlePickFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Always reset to allow re-selecting the same file later.
    event.target.value = "";

    if (!file) return;

    if (!isAllowedFile(file)) {
      toast.error("Tipo de arquivo não permitido. Use PDF, PNG, JPG, JPEG ou WEBP.");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Arquivo muito grande. Tamanho máximo: 5 MB.");
      return;
    }

    uploadMutation.mutate(
      { patientId, file },
      {
        onSuccess: () => {
          toast.success("Documento enviado com sucesso!");
        },
        onError: (error: unknown) => {
          const apiError = error as { message?: string; status?: number };
          const rawMessage = apiError?.message ?? "";
          const isStorageMissing =
            apiError?.status === 400 &&
            /storage n[ãa]o configurado/i.test(rawMessage);

          if (isStorageMissing) {
            toast.error("Upload indisponível: storage não configurado");
            return;
          }

          toast.error(rawMessage || "Erro ao enviar documento.");
        },
      },
    );
  };

  const handleDelete = (docId: string) => {
    deleteMutation.mutate(
      { patientId, docId },
      {
        onSuccess: () => {
          toast.success("Documento removido com sucesso!");
        },
        onError: (error: unknown) => {
          const apiError = error as { message?: string };
          toast.error(apiError?.message || "Erro ao remover documento.");
        },
      },
    );
  };

  const handleOpen = (doc: PatientDocumentResponse) => {
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="pt-2">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-text-primary">
          Arquivos e Exames
        </h3>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_ATTR}
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          type="button"
          onClick={handlePickFile}
          disabled={uploadMutation.isPending}
          variant="brand"
        >
          {uploadMutation.isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Upload className="size-4" />
          )}
          {uploadMutation.isPending ? "Enviando..." : "Enviar Novo"}
        </Button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-brand-primary" />
        </div>
      )}

      {isError && !isLoading && (
        <div className="py-12 text-center text-sm text-text-muted">
          Erro ao carregar documentos. Tente novamente.
        </div>
      )}

      {!isLoading && !isError && documents && documents.length === 0 && (
        <div className="py-12 text-center text-sm text-text-muted">
          Nenhum documento enviado ainda.
        </div>
      )}

      {!isLoading && !isError && documents && documents.length > 0 && (
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {documents.map((doc) => {
            const isDeletingThis =
              deleteMutation.isPending &&
              deleteMutation.variables?.docId === doc.id;

            return (
              <div
                key={doc.id}
                className="w-[200px] shrink-0 bg-white rounded-xl border border-border-light overflow-hidden flex flex-col shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
              >
                <DocumentPreview doc={doc} />
                <div className="px-4 py-3 bg-white flex flex-col gap-2 border-t border-border-light">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-[13px] font-bold text-text-secondary truncate"
                      title={doc.fileName}
                    >
                      {doc.fileName}
                    </span>
                    <span className="text-[11px] font-bold text-text-muted">
                      {formatDate(doc.uploadedAt)} &bull;{" "}
                      {formatBytes(doc.fileSizeBytes)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpen(doc)}
                      className="flex-1 h-8 px-2 text-[12px] font-bold text-brand-primary hover:text-brand-dark hover:bg-background-hover"
                    >
                      <ExternalLink className="size-3.5 mr-1" />
                      Abrir
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(doc.id)}
                      disabled={isDeletingThis}
                      className="h-8 px-2 text-[12px] font-bold text-danger-text hover:text-danger-text hover:bg-danger-soft"
                      aria-label={`Remover ${doc.fileName}`}
                    >
                      {isDeletingThis ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
