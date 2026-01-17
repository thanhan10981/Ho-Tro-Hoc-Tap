import { useState } from "react";
import { previewSummaryMix, confirmSummary, regenerateTitle } from "../../shared/services/summary.Service";
import type { PreviewMixParams, PreviewResponse, TomTatConfirmRequest } from "../../shared/types/Summary.type";


export function useSummaryCreate() {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const regenerate = async (noiDung: string): Promise<string> => {
  try {
    setLoading(true);
    return await regenerateTitle(noiDung);
  } finally {
    setLoading(false);
  }
};

  const createPreview = async (params: PreviewMixParams) => {
    try {
      setLoading(true);
      setError(null);

      const data = await previewSummaryMix(params);
      setPreview(data);

      return data;
    } catch (e: unknown) {
        let message = "Không thể tạo tóm tắt";

        if (
            typeof e === "object" &&
            e !== null &&
            "response" in e
        ) {
            const err = e as {
            response?: { data?: { message?: string } };
            };
            message = err.response?.data?.message ?? message;
        }

        setError(message);
        throw e;
        }
finally {
      setLoading(false);
    }
  };

  const confirm = async (payload: TomTatConfirmRequest) => {
    try {
      setLoading(true);
      await confirmSummary(payload);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    preview,
    error,
    createPreview,
    confirm,
    regenerate,
    setPreview,
  };
}
