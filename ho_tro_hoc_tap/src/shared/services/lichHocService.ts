//lichHocService.ts

import type { ImportScheduleConfirmRequest, ImportSchedulePreviewDTO, LichHocCalendarDTO } from "../types/lichHoc";
import { getToken } from "../../features/auth/util/token";
import type {  UpdateReminderRequest, TopSubjectDTO, CreateEventRequest, 
  LichHocSearchRequest, WeeklyEventCountDTO, TodayEventDTO   } 
from "../types/lichHoc";

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


export async function createEvent(payload: CreateEventRequest) {
  return axios.post(BASE_URL, payload, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

  


export async function updateReminder(
  payload: UpdateReminderRequest
) {
  return axios.put(`${BASE_URL}/nhac-nho`, payload, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

export async function updateReminderEmail(
  emailMoi: string,
  otp: string
) {
  return axios.put(
    `${BASE_URL}/email-nhac-nho`,
    { emailMoi, otp },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}


export async function getReminderEmail(): Promise<{ email: string }> {
  const res = await axios.get(`${BASE_URL}/email-nhac-nho`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
}

// ========== UPDATE EVENT ==========
export async function updateEvent(
  maSuKien: number,
  payload: {
    tieuDe: string;
    diaDiem: string;
    loaiSuKien: string;
    ngayBatDau: string;
    ngayKetThuc: string;
    gioBatDau: string;
    gioKetThuc: string;
    mucDoUuTien: string;
    moTa: string;
  }
) {
  return axios.put(`${BASE_URL}/${maSuKien}`, payload, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

// ========== UPDATE NHẮC NHỞ ==========
export async function updateNhacNho(
  maSuKien: number,
  loai: boolean,
  thoiGianNhacNho: string
) {
  return axios.put(
    `${BASE_URL}/${maSuKien}/nhac-nho/${loai}`,
    { thoiGianNhacNho },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
}

// ========== DELETE NHẮC NHỞ ==========
export async function deleteNhacNho(
  maSuKien: number,
  loai: boolean
) {
  return axios.delete(
    `${BASE_URL}/${maSuKien}/nhac-nho/${loai}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
}

// ========== DELETE EVENT ==========
export async function deleteEvent(maSuKien: number) {
  return axios.delete(`${BASE_URL}/${maSuKien}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
}

// ========== SEARCH LỊCH HỌC ==========

export async function searchLichHoc(
  payload: LichHocSearchRequest
): Promise<LichHocCalendarDTO[]> {
  const res = await axios.post(
    `${BASE_URL}/search`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
}

export async function getWeeklyEventCount(
  year: number,
  week: number
): Promise<WeeklyEventCountDTO> {
  const res = await axios.get(
    `${BASE_URL}/weekly?year=${year}&week=${week}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
}

export async function getUpcomingDeadlineCount(): Promise<{ total: number }> {
  const res = await axios.get(
    `${BASE_URL}/upcoming-deadlines`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
}


export async function getTopSubjectInMonth(
  year: number,
  month: number
): Promise<TopSubjectDTO | null> {
  const res = await axios.get(
    `${BASE_URL}/top-subject`,
    {
      params: { year, month },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data; // có thể null
}


export async function getTodayEvents(): Promise<
  Record<string, TodayEventDTO[]>
> {
  const res = await axios.get(`${BASE_URL}/today`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
}

export async function importScheduleFromImage(
  file: File
): Promise<ImportSchedulePreviewDTO> {
  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(
    `${BASE_URL}/import-image`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}

export async function confirmImportSchedule(
  payload: ImportScheduleConfirmRequest
): Promise<void> {
  await axios.post(
    `${BASE_URL}/import-image/confirm`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
}
