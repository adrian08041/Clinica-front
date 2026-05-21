import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, handleUnauthorized } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface PatientDocumentResponse {
  id: string;
  fileName: string;
  fileUrl: string;
  contentType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

interface ApiError {
  message: string;
  status: number;
}

export const documentKeys = {
  all: ["documents"] as const,
  byPatient: (patientId: string) =>
    [...documentKeys.all, "patient", patientId] as const,
};

async function uploadMultipart(
  patientId: string,
  file: File,
): Promise<PatientDocumentResponse> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/patients/${patientId}/documents`, {
    method: "POST",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized(`/patients/${patientId}/documents`);
    }

    const error: ApiError = {
      message: "Erro ao conectar com o servidor",
      status: response.status,
    };

    try {
      const body = (await response.json()) as { message?: string; error?: string };
      error.message = body.message || body.error || error.message;
    } catch {
      // ignore non-JSON error bodies
    }

    throw error;
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as unknown as PatientDocumentResponse;
  }

  const text = await response.text();
  if (!text.trim()) {
    return undefined as unknown as PatientDocumentResponse;
  }

  try {
    return JSON.parse(text) as PatientDocumentResponse;
  } catch {
    throw {
      message: "Resposta inválida do servidor",
      status: response.status,
    } satisfies ApiError;
  }
}

export const documentsApi = {
  listByPatient: (patientId: string) =>
    api<PatientDocumentResponse[]>(`/patients/${patientId}/documents`),
  upload: (patientId: string, file: File) => uploadMultipart(patientId, file),
  remove: (patientId: string, docId: string) =>
    api<void>(`/patients/${patientId}/documents/${docId}`, { method: "DELETE" }),
  downloadUrl: (patientId: string, docId: string) =>
    `${API_URL}/patients/${patientId}/documents/${docId}`,
};

export function usePatientDocuments(patientId: string | undefined) {
  return useQuery({
    queryKey: patientId
      ? documentKeys.byPatient(patientId)
      : documentKeys.all,
    queryFn: () => documentsApi.listByPatient(patientId as string),
    enabled: Boolean(patientId),
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, file }: { patientId: string; file: File }) =>
      documentsApi.upload(patientId, file),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: documentKeys.byPatient(variables.patientId),
      });
    },
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ patientId, docId }: { patientId: string; docId: string }) =>
      documentsApi.remove(patientId, docId),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: documentKeys.byPatient(variables.patientId),
      });
    },
  });
}
