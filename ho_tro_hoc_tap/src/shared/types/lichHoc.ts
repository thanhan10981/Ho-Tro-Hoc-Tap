// lichHoc.ts
export interface LichHocCalendarDTO {
  maSuKien: number;
  tieuDe: string;
  diaDiem: string | null;
  loaiSuKien: string;

  ngayBatDau: string; // yyyy-MM-dd
  ngayKetThuc: string;

  gioBatDau: string; // HH:mm:ss
  gioKetThuc: string;

  moTa: string | null;
}

// event dùng cho calendar UI
export interface CalendarEvent {
  date: string;
  title: string;
  time: string;
  color: string;

  location?: string;
  description?: string;
  type?: string;
  rawDto?: LichHocCalendarDTO;

}

export type RepeatFreq = "DAILY" | "WEEKLY" | "MONTHLY";

export interface RepeatRule {
  freq: RepeatFreq;
  interval: number;
  count?: number;
  until?: string;
}
export interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  type: string;
  subject: number | "";
  location: string;
  priority: "binh_thuong" | "quan_trong" | "khan_cap";


  repeat: boolean;
  repeatRule?: RepeatRule;

  remindBeforeStart: boolean;
  remindStartValue: number;
  remindStartUnit: ReminderUnit;

  remindBeforeEnd: boolean;
  remindEndValue: number;
  remindEndUnit: ReminderUnit;

  // ===== BỔ SUNG CHO ĐÚNG BACKEND =====
  nhacTruocBatDau?: boolean;
  soPhutTruocBatDau?: number | null;

  nhacTruocKetThuc?: boolean;
  soPhutTruocKetThuc?: number | null;
}

export interface CreateEventRequest {
  tieuDe: string;
  moTa: string | null;
  maMonHoc: number | null;
  loaiSuKien: string;

  thoiGianBatDau: string;
  thoiGianKetThuc: string;

  mucDoUuTien: "binh_thuong" | "quan_trong" | "khan_cap";
  diaDiem: string | null;

  nhacTruocBatDau: boolean;
  soPhutTruocBatDau: number | null;

  nhacTruocKetThuc: boolean;
  soPhutTruocKetThuc: number | null;

  emailNhacNho: string | null;
}

// lichHoc.ts
// lichHoc.ts

export interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onCancel: () => void;
}

export interface UpdateReminderRequest {
  maSuKien: number;
  thoiGianNhacNhoMoi: string; // yyyy-MM-ddTHH:mm:ss
  emailNhacNhoMoi?: string;
}
export type ReminderUnit = "minutes" | "hours" | "days";

export interface UpdateEventFormState {
  tieuDe: string;
  diaDiem: string;
  loaiSuKien: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  gioBatDau: string;
  gioKetThuc: string;
  mucDoUuTien: "binh_thuong" | "quan_trong" | "khan_cap";
  moTa: string;
};
export interface LichHocSearchRequest {
  keyword?: string;
  maMonHoc?: number;
loaiSuKien?: string[];
}

export interface WeeklyEventCountDTO {
  year: number;
  week: number;
  totalEvents: number;
}
export interface UpcomingDeadlineDTO {
  total: number;
}
export interface TopSubjectDTO {
  maMonHoc: number;
  tenMonHoc: string;
  totalEvents: number;
}


export interface TodayEventDTO {
  maSuKien: number;
  loaiSuKien: string;
  tieuDe: string;
  tenMonHoc?: string;
  thoiGianHoc?: string;
  diaDiem?: string;
  thoiGian?: string;
  moTa?: string;
}

export interface ImportMonHocPreviewDTO {
  tenMonHoc: string;
}
export interface ImportLichHocPreviewDTO {
  tenMonHoc: string;
  thu: string;

  startDate?: string;
  endDate?: string;

  gioBatDau: string;
  gioKetThuc: string;

  diaDiem: string;
  moTa?: string;

  loaiSuKien?: string;
  mucDoUuTien?: "binh_thuong" | "quan_trong" | "khan_cap";

  nhacTruocBatDau?: boolean;
  remindStartValue?: number;
  remindStartUnit?: ReminderUnit;

  nhacTruocKetThuc?: boolean;
  remindEndValue?: number;
  remindEndUnit?: ReminderUnit;

  lapLai?: boolean;
  repeatRule?: RepeatRule;
}


export interface ImportSchedulePreviewDTO {
  monHocMoi: ImportMonHocPreviewDTO[];
  lichHoc: ImportLichHocPreviewDTO[];
}

export interface ImportScheduleConfirmRequest {
  lichHoc: ImportLichHocPreviewDTO[];
}

export interface LichHocUpcoming {
  tieuDe: string;
  diaDiem: string;
  moTa: string;
  mucDoUuTien: string;
  thoiGianKetThuc: string;
}