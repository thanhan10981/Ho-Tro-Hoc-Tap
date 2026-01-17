import axios from "../utils/axios";
import type { PreviewMixParams, PreviewResponse, TomTatConfirmRequest,SummaryItem 
  , TomTatViewDTO, TomTatFilterRequest,
  MonHocThongKe, AuditLogDTO
 } 
from "../types/Summary.type";
import type { LichHocUpcoming } from "../types/lichHoc";

export const previewSummaryMix = async (
  params: PreviewMixParams
): Promise<PreviewResponse> => {
  const formData = new FormData();

  if (params.noiDungText) {
    formData.append("noiDungText", params.noiDungText);
  }

  params.files?.forEach(f => {
    formData.append("files", f);
  });

  formData.append("doDai", params.doDai.toUpperCase()); // NGAN | VUA | DAI
  formData.append("maMonHoc", String(params.maMonHoc));
  formData.append("highlightTuKhoa", String(params.highlightTuKhoa));
  formData.append("themViDu", String(params.themViDu));
  formData.append("taoCauHoiOnTap", String(params.taoCauHoiOnTap));

  const res = await axios.post<PreviewResponse>(
    "/api/tom-tat/preview-mix",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};

export async function confirmSummary(
  payload: TomTatConfirmRequest
): Promise<void> {
  await axios.post("/api/tom-tat/confirm", payload);
}

export async function regenerateTitle(noiDung: string): Promise<string> {
  const res = await axios.post<string>(
    "/api/tom-tat/regenerate-title",
    { noiDung },
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}

export async function getMySummaries(): Promise<SummaryItem[]> {
  const res = await axios.get<TomTatViewDTO[]>("/api/tom-tat/da-luu");

  return res.data.map((item): SummaryItem => ({
    id: item.maTomTat,
    title: item.tieuDe,
    chapter: item.subTieuDe ?? undefined,
    subject: item.monHoc?.tenMonHoc ?? "—",
    timeAgo: item.thoiGianTao,
    wordCount: item.soTu,
    pageCount: item.soTrang,
    fileName: "AI Summary",
    description: item.noiDung,
    keywords: item.tuKhoa ?? [],
    icon: "file",
    status: "done",
  }));
}


export async function filterSummaries(
  payload: TomTatFilterRequest
): Promise<SummaryItem[]> {
  const res = await axios.post<TomTatViewDTO[]>(
    "/api/tom-tat/filter",
    payload
  );

  return res.data.map((item): SummaryItem => ({
    id: item.maTomTat,
    title: item.tieuDe,
    chapter: item.subTieuDe ?? undefined,
    subject: item.monHoc?.tenMonHoc ?? "—",
    timeAgo: item.thoiGianTao,
    wordCount: item.soTu,
    pageCount: item.soTrang,
    fileName: "AI Summary",
    description: item.noiDung,
    keywords: item.tuKhoa ?? [],
    icon: "file",
    status: "done",
  }));
}

export const exportPdf = (id: number) => {
  return axios.get(`/api/tom-tat/export/${id}/pdf`, {
    responseType: "blob",
  });
};

export const exportDocx = (id: number) => {
  return axios.get(`/api/tom-tat/export/${id}/docx`, {
    responseType: "blob",
  });
};


export const getTopSubjectThisWeek = async () => {
  const res = await axios.get<MonHocThongKe>(
    "/api/tom-tat/top-subject-this-week"
  );

  return res.data;
};

export const getRecentAuditLogs = async (): Promise<AuditLogDTO[]> => {
  const res = await axios.get<AuditLogDTO[]>("/api/audit-log/recent");
  return res.data;
};

export const getUpcomingEvents = async (): Promise<LichHocUpcoming[]> => {
  const res = await axios.get<LichHocUpcoming[]>("/api/lich-hoc/upcoming");
  return res.data;
};