import { App } from "antd";
import { AxiosError } from "axios";
import { useCallback, useState } from "react";
import api from "../../../lib/axios";

export type ImportValidationIssue = {
  row: number;
  field: string;
  message: string;
};

export type ImportValidationResult = {
  sessionId: string;
  filename: string;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  expiresAt: string;
  issues: ImportValidationIssue[];
};

export type ImportExecuteResult = {
  sessionId: string;
  importedRows: number;
  employeeIds: string[];
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

export function useImport() {
  const { message } = App.useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportExecuteResult | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsValidating(false);
    setIsExecuting(false);
    setValidationResult(null);
    setImportResult(null);
    setFile(null);
  }, []);

  const validateFile = useCallback(
    async (selectedFile: File) => {
      setIsValidating(true);
      setFile(selectedFile);
      setImportResult(null);
      setValidationResult(null);
      setCurrentStep(0);

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        const { data } = await api.post<ImportValidationResult>("/hr/import/validate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setValidationResult(data);
        setCurrentStep(1);
        message.success("File berhasil divalidasi");
        return data;
      } catch (error) {
        const errorMessage = getErrorMessage(error, "Gagal memvalidasi file import");
        message.error(errorMessage);
        throw error;
      } finally {
        setIsValidating(false);
      }
    },
    [message],
  );

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
    isValidating,
    isExecuting,
    validationResult,
    importResult,
    file,
    validateFile,
    executeImport,
    downloadTemplate,
    reset,
    setCurrentStep,
    setFile,
  };
}
