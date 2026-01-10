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
}

// event dùng cho calendar UI
export interface CalendarEvent {
  date: string;
  title: string;
  time: string;
  color: string;
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
  priority: "binh_thuong" | "quan_trong";
  reminder: string; // phút
  repeat: boolean;
  repeatMonths?: number;
}

export interface EventFormProps {
  onSubmit: (data: EventFormData) => void;
  onCancel?: () => void;
}

