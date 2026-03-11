import { App } from "antd";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import api from "../../../lib/axios";

export type ImportRowCellError = {
  field: string;
  message: string;
};

export type ImportPreviewRow = {
  rowNumber: number;
  data: Record<string, unknown>;
};

export type ImportPreviewResult = {
  filename: string;
  totalRows: number;
  rows: ImportPreviewRow[];
};

export type ImportValidationIssue = {
  row: number;
  field: string;
  message: string;
};

export type ImportValidationRow = {
  rowNumber: number;
  status: "valid" | "error";
  rawData: Record<string, unknown>;
  normalizedData?: Record<string, unknown>;
  errors: ImportRowCellError[];
};

export type ImportValidationResult = {
  sessionId: string;
  filename: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  expiresAt: string;
  issues: ImportValidationIssue[];
  rows: ImportValidationRow[];
};

export type ImportExecuteRowDetail = {
  rowNumber: number;
  status: "success" | "failed";
  rawData: Record<string, unknown>;
  normalizedData?: Record<string, unknown>;
  nomor_induk_karyawan?: string;
  employeeId?: string;
  message?: string;
  errors: ImportRowCellError[];
};

export type ImportExecuteResult = {
  sessionId: string;
  processed: number;
  success: number;
  failed: number;
  details: ImportExecuteRowDetail[];
};

type ApiErrorResponse = {
  message?: string | string[];
};

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const apiMessage = error.response?.data as ApiErrorResponse | undefined;

    if (Array.isArray(apiMessage?.message)) {
      return apiMessage.message.join(", ");
    }

    if (typeof apiMessage?.message === "string" && apiMessage.message.trim()) {
      return apiMessage.message;
    }
  }

  return fallback;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);
}

async function postImportFile<T>(url: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post<T>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export function useImport() {
  const { message } = App.useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isUploadingPreview, setIsUploadingPreview] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [previewResult, setPreviewResult] = useState<ImportPreviewResult | null>(null);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportExecuteResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsUploadingPreview(false);
    setIsValidating(false);
    setIsExecuting(false);
    setPreviewResult(null);
    setValidationResult(null);
    setImportResult(null);
    setFile(null);
  }, []);

  const selectFile = useCallback((selectedFile: File) => {
    setFile(selectedFile);
    setCurrentStep(0);
    setPreviewResult(null);
    setValidationResult(null);
    setImportResult(null);
  }, []);

  const uploadPreview = useCallback(async () => {
    if (!file) {
      const error = new Error("File import belum dipilih");
      message.error("Pilih file import terlebih dahulu");
      throw error;
    }

    setIsUploadingPreview(true);
    setPreviewResult(null);
    setValidationResult(null);
    setImportResult(null);
    setCurrentStep(0);

    try {
      const data = await postImportFile<ImportPreviewResult>("/hr/import/upload", file);
      setPreviewResult(data);
      message.success("Preview file berhasil dimuat");
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Gagal memuat preview file import");
      message.error(errorMessage);
      throw error;
    } finally {
      setIsUploadingPreview(false);
    }
  }, [file, message]);

  const validateImport = useCallback(async () => {
    if (!file) {
      const error = new Error("File import belum dipilih");
      message.error("Pilih file import terlebih dahulu");
      throw error;
    }

    setIsValidating(true);
    setValidationResult(null);
    setImportResult(null);

    try {
      const data = await postImportFile<ImportValidationResult>("/hr/import/validate", file);
      setValidationResult(data);
      setCurrentStep(1);
      message.success("Validasi file berhasil dijalankan");
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Gagal memvalidasi file import");
      message.error(errorMessage);
      throw error;
    } finally {
      setIsValidating(false);
    }
  }, [file, message]);

  const executeImport = useCallback(async () => {
    if (!validationResult?.sessionId) {
      const error = new Error("Sesi validasi belum tersedia");
      message.error("Lakukan validasi file terlebih dahulu");
      throw error;
    }

    setIsExecuting(true);

    try {
      const { data } = await api.post<ImportExecuteResult>("/hr/import/execute", {
        sessionId: validationResult.sessionId,
      });

      setImportResult(data);
      setCurrentStep(2);
      message.success("Import karyawan berhasil dijalankan");
      return data;
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Gagal menjalankan import karyawan");
      message.error(errorMessage);
      throw error;
    } finally {
      setIsExecuting(false);
    }
  }, [message, validationResult]);

  const downloadTemplate = useCallback(async () => {
    try {
      const response = await api.get<Blob>("/hr/import/template", {
        responseType: "blob",
      });

      downloadBlob(response.data, "template-import-fix.xlsx");
      message.success("Template import berhasil diunduh");
    } catch (error) {
      const errorMessage = getErrorMessage(error, "Gagal mengunduh template import");
      message.error(errorMessage);
      throw error;
    }
  }, [message]);

  return {
    currentStep,
    isUploadingPreview,
    isValidating,
    isExecuting,
    previewResult,
    validationResult,
    importResult,
    file,
    selectFile,
    uploadPreview,
    validateImport,
    executeImport,
    downloadTemplate,
    reset,
  };
}
