//lichHocService.ts

import type { LichHocCalendarDTO } from "../types/lichHoc";
import { getToken } from "../../features/auth/util/token";
import type { EventFormData } from "../types/lichHoc";
import { calcReminderTime } from "../utils/lichHocMapper";
import axios from "axios";

const BASE_URL = "http://localhost:9090/api/lich-hoc";

export async function getCalendarEvents(
  fromDate: string,
  toDate: string
): Promise<LichHocCalendarDTO[]> {
  const res = await fetch(
    `${BASE_URL}/calendar?fromDate=${fromDate}&toDate=${toDate}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Không lấy được dữ liệu lịch học");
  }

  return res.json();


}


export async function createEvent(form: EventFormData) {
  const payload = {
    tieuDe: form.title,
    moTa: form.description,
    maMonHoc: Number(form.subject),
    loaiSuKien: form.type,
    mucDoUuTien: form.priority,
    diaDiem: form.location,

    thoiGianBatDau: `${form.startDate}T${form.startTime}:00`,
    thoiGianKetThuc: `${form.endDate}T${form.endTime}:00`,

    thoiGianNhacNho: form.reminder
      ? calcReminderTime(
          form.endDate,
          form.endTime,
          Number(form.reminder)
        )
      : null,
  };

  return axios.post(BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}