import type { CalendarEvent, LichHocCalendarDTO } from "../types/lichHoc";
import {
  parseISO,
  addWeeks, addMonths, isAfter
} from "date-fns";
import type { EventFormData } from "../types/lichHoc";

const COLOR_MAP: Record<string, string> = {
  hoc: "#bfdbfe",
  thi: "#fef3c7",
  deadline: "#fecaca",
};
export function mapToCalendarEvents(
  dto: LichHocCalendarDTO
): CalendarEvent[] {
  const events: CalendarEvent[] = [];

  const startDate = parseISO(dto.ngayBatDau);
  const endDate = parseISO(dto.ngayKetThuc);

  const color = COLOR_MAP[dto.loaiSuKien] ?? "#e5e7eb";

  // ===== EVENT NGÀY BẮT ĐẦU =====
  events.push({
    date: startDate.toISOString(),
    title: dto.tieuDe,
    time: `Bắt đầu - ${dto.gioBatDau?.slice(0, 5) ?? ""}`,
    color,
  });

  // ===== EVENT NGÀY KẾT THÚC (nếu khác ngày) =====
  if (dto.ngayBatDau !== dto.ngayKetThuc) {
    events.push({
      date: endDate.toISOString(),
      title: dto.tieuDe,
      time: `Kết thúc - ${dto.gioKetThuc?.slice(0, 5) ?? ""}`,
      color,
    });
  }

  return events;
}


export function calcReminderTime(
  endDate: string,
  endTime: string,
  reminderMinutes: number
): string {
  const end = new Date(`${endDate}T${endTime}`);
  end.setMinutes(end.getMinutes() - reminderMinutes);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(end.getDate())}T${pad(end.getHours())}:${pad(end.getMinutes())}:00`;
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

  while (!isAfter(currentStart, endLimit)) {
    events.push({
      ...base,
      startDate: currentStart.toISOString().slice(0, 10),
      startTime: currentStart.toTimeString().slice(0, 5),
      endDate: currentEnd.toISOString().slice(0, 10),
      endTime: currentEnd.toTimeString().slice(0, 5),
    });

    currentStart = addWeeks(currentStart, 1);
    currentEnd = addWeeks(currentEnd, 1);
  }

  return events;
}
