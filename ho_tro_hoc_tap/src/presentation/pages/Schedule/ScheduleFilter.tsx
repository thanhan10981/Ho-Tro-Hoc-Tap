import "../../../styles/Schedule/ScheduleFilter.css";
import { useState, useEffect } from "react";
import { updateReminderEmail, getTopSubjectInMonth, getReminderEmail, getWeeklyEventCount, getUpcomingDeadlineCount  } from "../../../shared/services/lichHocService";
import { sendOtp } from "../../../shared/services/emailOtpService";
import { getMyMonHoc } from "../../../shared/services/monHocService";
import type { MonHocResponse } from "../../../shared/types/monHoc";
import type { WeeklyEventCountDTO, TopSubjectDTO  } from "../../../shared/types/lichHoc";

const EVENT_TYPES = [
  { key: "hoc", label: "Lớp học" },
  { key: "thi", label: "Thi cử" },
  { key: "deadline", label: "Deadline bài tập" },
  { key: "on_tap", label: "Ôn tập" },
];

interface Props {
  onFilterChange: (filter: {
    keyword?: string;
    maMonHoc?: number;
    loaiSuKien?: string[];
  }) => void;

  refreshKey: number;
}

export default function ScheduleFilter({ onFilterChange, refreshKey }: Props) {


// ===== STATE =====
const [email, setEmail] = useState("");
const [newEmail, setNewEmail] = useState("");
const [otp, setOtp] = useState("");
const [step, setStep] = useState<"email" | "otp">("email");
const [showModal, setShowModal] = useState(false);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [keyword, setKeyword] = useState("");
const [loaiSuKien, setLoaiSuKien] = useState<string[]>([]);
const [monHocs, setMonHocs] = useState<MonHocResponse[]>([]);
const [maMonHoc, setMaMonHoc] = useState<number | undefined>();
const [weeklyStat, setWeeklyStat] = useState<WeeklyEventCountDTO | null>(null);
const [upcomingDeadline, setUpcomingDeadline] = useState<number>(0);
const [topSubject, setTopSubject] = useState<TopSubjectDTO | null>(null);


useEffect(() => {
  const fetchEmail = async () => {
    try {
      const res = await getReminderEmail();

      // an toàn tuyệt đối
      if (res && typeof res === "string") {
        setEmail(res);
      } else if (res?.email) {
        setEmail(res.email);
      } else {
        setEmail("");
      }

    } catch {
      setEmail("");
    }
  };

  fetchEmail();
}, []);
useEffect(() => {
  const fetchTopSubject = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JS month = 0-based

      const data = await getTopSubjectInMonth(year, month);
      setTopSubject(data);
    } catch {
      setTopSubject(null);
    }
  };

  fetchTopSubject();
}, [refreshKey]);

useEffect(() => {
  const fetchUpcomingDeadline = async () => {
    try {
      const data = await getUpcomingDeadlineCount();
      setUpcomingDeadline(data.total);
    } catch {
      setUpcomingDeadline(0);
    }
  };

  fetchUpcomingDeadline();
}, [refreshKey]);

useEffect(() => {
  const fetchMonHoc = async () => {
    try {
      const data = await getMyMonHoc();
      setMonHocs(data);
    } catch {
      setMonHocs([]);
    }
  };

  fetchMonHoc();
}, []);

  const toggleLoaiSuKien = (type: string, checked: boolean) => {
  const next = checked
    ? [...loaiSuKien, type]
    : loaiSuKien.filter((t) => t !== type);

  setLoaiSuKien(next);

  onFilterChange({
    keyword,
    maMonHoc,
    loaiSuKien: next.length ? next : undefined,
  });
};



function getISOWeekInfo(date = new Date()) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );

  // ISO: Thứ 2 = 1, CN = 7
  const dayNum = d.getUTCDay() || 7;

  // về thứ 5 của tuần hiện tại
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  const year = d.getUTCFullYear();

  const yearStart = new Date(Date.UTC(year, 0, 1));
  const week = Math.ceil(
    (((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7
  );

  return { year, week };
}

useEffect(() => {
  const fetchWeeklyStat = async () => {
    try {
      const { year, week } = getISOWeekInfo();
      const data = await getWeeklyEventCount(year, week);
      setWeeklyStat(data);
    } catch {
      setWeeklyStat(null);
    }
  };

  fetchWeeklyStat();
}, [refreshKey]);


  return (
    <div className="filter-panel">
      {/* ================= BỘ LỌC ================= */}
      <div className="panel-section">
        <h3>Bộ lọc & Tìm kiếm</h3>

      <input
        type="text"
        className="input"
        placeholder="Tìm kiếm sự kiện..."
        value={keyword}
        onChange={(e) => {
          const val = e.target.value;
          setKeyword(val);
          onFilterChange({
          keyword: val,
          loaiSuKien: loaiSuKien.length ? loaiSuKien : undefined,
          maMonHoc,
        });

        }}
      />


        <label className="label">Môn học</label>
        <select
          className="select"
          value={maMonHoc ?? ""}
          onChange={(e) => {
            const value = e.target.value
              ? Number(e.target.value)
              : undefined;

            setMaMonHoc(value);

            onFilterChange({
              keyword,
              loaiSuKien: loaiSuKien.length ? loaiSuKien : undefined,
              maMonHoc: value,
            });
          }}
        >
          <option value="">Tất cả môn học</option>

          {monHocs.map((mh) => (
            <option key={mh.maMonHoc} value={mh.maMonHoc}>
              {mh.tenMonHoc}
            </option>
          ))}
        </select>


        <div className="checkbox-group">
          {EVENT_TYPES.map((ev) => (
            <label key={ev.key}>
              <input
                type="checkbox"
                checked={loaiSuKien.includes(ev.key)}
                onChange={(e) =>
                  toggleLoaiSuKien(ev.key, e.target.checked)
                }
              />
              {ev.label}
            </label>
          ))}
        </div>


      </div>

      <div className="section-divider" />

      {/* ================= THỐNG KÊ ================= */}
      <div className="panel-section">
        <h3>Thống kê</h3>

        <div className="stat-row">
          <span className="stat-label">Sự kiện tuần này</span>
          <span className="stat-number num-blue">
            {weeklyStat?.totalEvents ?? 0}
          </span>

        </div>

        <div className="stat-row">
          <span className="stat-label">Deadline sắp tới</span>
          <span className="stat-number num-red">
            {upcomingDeadline}
          </span>

        </div>

        {/*<div className="stat-row">
          <span className="stat-label">Lịch thi sắp tới</span>
          <span className="stat-number num-green">85%</span>
        </div> */}
        <div className="best-subject">
          {topSubject ? (
            <>
              Môn có nhiều sự kiện nhất tháng{" "}
              {new Date().getMonth() + 1} / {new Date().getFullYear()}:{" "}
              <strong>{topSubject.tenMonHoc}</strong>{" "}
              ({topSubject.totalEvents} sự kiện)
            </>
          ) : (
            <span>Chưa có dữ liệu tháng này</span>
          )}
        </div>

      </div>

      <div className="section-divider" />

      {/* ================= CÀI ĐẶT EMAIL ================= */}
      <div className="panel-section">
        
        <h3>Cài đặt thông báo</h3>

          <label className="label">Email nhận thông báo</label>

          <div className="email-row">
            <input
              type="email"
              className="readonly-input"
              value={email || "Chưa có email"}
              readOnly
            />

            <button
              type="button"
              className="change-email-btn"
              onClick={() => {
                setShowModal(true);
                setNewEmail("");
                setOtp("");
                setStep("email");
                setError(null);
              }}
            >
              Đổi email
            </button>
          </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Đổi email nhận thông báo</h3>

              <input
                type="email"
                className="input"
                placeholder="Nhập email mới"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={step === "otp"}
              />

              {step === "otp" && (
                <input
                  type="text"
                  className="input"
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              )}

              {error && <p className="form-error">{error}</p>}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowModal(false);
                    setStep("email");
                    setOtp("");
                    setError(null);
                  }}
                >
                  Hủy
                </button>

                {step === "email" ? (
                  <button
                    type="button"
                    className="primary-btn"
                    disabled={loading}
                    onClick={async () => {
                      if (!newEmail) {
                        setError("Email không được để trống");
                        return;
                      }

                      try {
                        setLoading(true);
                        setError(null);

                        await sendOtp(newEmail);
                        setStep("otp");
                      } catch {
                        setError("Gửi OTP thất bại");
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    {loading ? "Đang gửi..." : "Gửi OTP"}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-btn"
                    disabled={loading}
                    onClick={async () => {
                      if (!otp) {
                        setError("Vui lòng nhập OTP");
                        return;
                      }

                      try {
                        setLoading(true);
                        setError(null);

                        await updateReminderEmail(newEmail, otp);

                        setEmail(newEmail);
                        setShowModal(false);
                        setStep("email");
                        setOtp("");

                        alert("Đổi email thành công");
                      } catch {
                        setError("OTP không đúng hoặc đã hết hạn");
                      } finally {
                        setLoading(false);
                      }
                    }}

                  >
                    {loading ? "Đang xác minh..." : "Xác minh OTP"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}
