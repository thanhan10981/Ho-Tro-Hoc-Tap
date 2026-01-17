

export type SummaryLength = "short" | "medium" | "long";

export interface PreviewMixParams {
  title?: string;
  noiDungText?: string;
  files?: File[];

  doDai: SummaryLength;
  maMonHoc: number;

  highlightTuKhoa: boolean;
  themViDu: boolean;
  taoCauHoiOnTap: boolean;
}
export interface MonHocThongKe {
  maMonHoc: number;
  tenMonHoc: string;
  soLuongTomTat: number;
}

export interface PreviewResponse {
  tieuDe: string;
  noiDungTomTat: string;
  soTu: number;
  soTrang: number;
}
export interface TomTatConfirmRequest {
  tieuDe: string;
  noiDungTomTat: string;
  soTu: number;
  soTrang: number;

  maMonHoc: number;

  highlightTuKhoa: boolean;
  themViDu: boolean;
  taoCauHoiOnTap: boolean;
}

export interface SummaryItem {
  id: number;
  title: string;
  chapter?: string;
  subject: string;
  timeAgo: string;
  wordCount: number;
  pageCount: number;
  fileName?: string;
  description: string;
  keywords: string[];
  icon: "file";
  status: "done";
}

export interface TomTatViewDTO {
  maTomTat: number;
  tieuDe: string;
  subTieuDe?: string | null;
  monHoc?: {
    maMonHoc: number;
    tenMonHoc: string;
  } | null;
  tuKhoa: string[];
  soTu: number;
  soTrang: number;
  thoiGianTao: string; // "3 ngày trước"
  noiDung: string;
}
export type TomTatSortType =
  | "MOI_NHAT"
  | "CU_NHAT"
  | "TEN_A_Z"
  | "SO_TRANG_CAO_NHAT"
  | "SO_TRANG_THAP_NHAT"
  | "SO_TU_NHIEU_NHAT"
  | "SO_TU_IT_NHAT";

export interface TomTatFilterRequest {
  sortType?: TomTatSortType;
  keyword?: string;
  maMonHoc?: number;

  fromDate?: string; // yyyy-MM-dd
  toDate?: string;

  minSoTrang?: number;
  maxSoTrang?: number;

  minSoTu?: number;
  maxSoTu?: number;
}

export interface AuditLogDTO {
  moTa: string;
  thoiGian: string;
}