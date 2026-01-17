  import type { CalendarEvent, LichHocCalendarDTO, CreateEventRequest } from "../types/lichHoc";
  import {
    addWeeks, addMonths, isAfter
  } from "date-fns";
  import type { EventFormData } from "../types/lichHoc";

  import type { ReminderUnit } from "../types/lichHoc";

const toMinutes = (value: number, unit: ReminderUnit): number => {
  switch (unit) {
    case "days":
      return value * 24 * 60;
    case "hours":
      return value * 60;
    default:
      return value;
  }
};

  const COLOR_MAP: Record<string, string> = {
    hoc: "#bfdbfe",
    thi: "#fef3c7",
    deadline: "#fecaca",
  };
  export function mapToCalendarEvents(
  dto: LichHocCalendarDTO
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  const color = COLOR_MAP[dto.loaiSuKien] ?? "#e5e7eb";

  // ===== EVENT NGÀY BẮT ĐẦU =====
  events.push({
    date: dto.ngayBatDau,
    title: dto.tieuDe,
    time: `Bắt đầu - ${dto.gioBatDau?.slice(0, 5) ?? ""}`,
    color,

    location: dto.diaDiem || undefined,
    description: dto.moTa ?? undefined,
    type: dto.loaiSuKien,

    rawDto: dto, // 🔥🔥🔥 BẮT BUỘC
  });

  // ===== EVENT NGÀY KẾT THÚC =====
  if (dto.ngayBatDau !== dto.ngayKetThuc) {
    events.push({
      date: dto.ngayKetThuc,
      title: dto.tieuDe,
      time: `Kết thúc - ${dto.gioKetThuc?.slice(0, 5) ?? ""}`,
      color,

      location: dto.diaDiem || undefined,
      description: dto.moTa ?? undefined,
      type: dto.loaiSuKien,

      rawDto: dto, // 🔥🔥🔥 BẮT BUỘC
    });
  }

  return events;
}



  export function calcReminderTime(
    endDate: string,
    endTime: string,
    reminderMinutes: number
  ): string {
    const [hour, minute] = endTime.split(":").map(Number);

    const totalMinutes = hour * 60 + minute - reminderMinutes;

    const h = Math.floor((totalMinutes + 1440) % 1440 / 60);
    const m = (totalMinutes + 1440) % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${endDate}T${pad(h)}:${pad(m)}:00`;
  }



  export function generateWeeklyEvents(
    base: EventFormData
  ): EventFormData[] {
    if (!base.repeat || !base.repeatMonths) {
      return [base];
    }

    const events: EventFormData[] = [];

    let currentStart = new Date(`${base.startDate}T${base.startTime}`);
    let currentEnd = new Date(`${base.endDate}T${base.endTime}`);

    const endLimit = addMonths(currentStart, base.repeatMonths);
    const formatDate = (d: Date) =>
     `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    const formatTime = (d: Date) =>
      `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    
    while (!isAfter(currentStart, endLimit)) {
      events.push({
        ...base,
        startDate: formatDate(currentStart),
        startTime: formatTime(currentStart),
        endDate: formatDate(currentEnd),
        endTime: formatTime(currentEnd),
      });

      currentStart = addWeeks(currentStart, 1);
      currentEnd = addWeeks(currentEnd, 1);
    }

    return events;
  }
  export function buildReminderDateTime(
    date: string, // yyyy-MM-dd
    time: string  // HH:mm
  ): string {
    return `${date}T${time}:00`;
  }
// shared/utils/lichHocMapper.ts

function convertToMinutes(value: number, unit: ReminderUnit): number {
  switch (unit) {
    case "minutes": return value;
    case "hours": return value * 60;
    case "days": return value * 24 * 60;
    default: return value;
  }
}

export function mapFormToCreateEventRequest(
  data: EventFormData
): CreateEventRequest {

  if (!data.startDate || !data.startTime) {
    throw new Error("Thiếu ngày/giờ bắt đầu");
  }

  if (!data.endDate || !data.endTime) {
    throw new Error("Thiếu ngày/giờ kết thúc");
  }

  const startDateTime = `${data.startDate}T${data.startTime}:00`;
  const endDateTime = `${data.endDate}T${data.endTime}:00`;

  return {
    tieuDe: data.title,
    moTa: data.description || null,
    maMonHoc: data.subject === "" ? null : Number(data.subject),
    loaiSuKien: data.type,

    thoiGianBatDau: startDateTime,
    thoiGianKetThuc: endDateTime,

    mucDoUuTien: data.priority,
    diaDiem: data.location || null,

    nhacTruocBatDau: data.remindBeforeStart,
    soPhutTruocBatDau: data.remindBeforeStart
      ? convertToMinutes(data.remindStartValue, data.remindStartUnit)
      : null,

    nhacTruocKetThuc: data.remindBeforeEnd,
    soPhutTruocKetThuc: data.remindBeforeEnd
      ? convertToMinutes(data.remindEndValue, data.remindEndUnit)
      : null,

    emailNhacNho: null,
  };
}
