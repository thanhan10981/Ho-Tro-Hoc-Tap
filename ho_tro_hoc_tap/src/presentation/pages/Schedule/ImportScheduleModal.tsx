import { useState } from "react";
import {
  importScheduleFromImage,
  confirmImportSchedule,
} from "../../../shared/services/lichHocService";

import type {
  ImportSchedulePreviewDTO,
  ImportLichHocPreviewDTO,
  RepeatFreq,
  RepeatRule,
} from "../../../shared/types/lichHoc";
 import type { ReminderUnit } from "../../../shared/types/lichHoc";
import "../../../styles/Schedule/ImportScheduleModal.css";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
}

type RepeatEndType = "never" | "count" | "date";

export default function ImportScheduleModal({
  onClose,
  onSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] =
    useState<ImportSchedulePreviewDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** mỗi lịch 1 kiểu kết thúc lặp */
  const [repeatEndTypeMap, setRepeatEndTypeMap] = useState<
    Record<number, RepeatEndType>
  >({});

  // ================= IMPORT IMAGE =================
  const handleImport = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      const data = await importScheduleFromImage(file);

      // 🔒 normalize mặc định
      data.lichHoc = data.lichHoc.map(l => ({
        ...l,
        nhacTruocBatDau: l.nhacTruocBatDau ?? false,
        remindStartValue: l.remindStartValue ?? 15,
        remindStartUnit: l.remindStartUnit ?? "minutes",

        nhacTruocKetThuc: l.nhacTruocKetThuc ?? false,
        remindEndValue: l.remindEndValue ?? 15,
        remindEndUnit: l.remindEndUnit ?? "minutes",

        lapLai: l.lapLai ?? false,
        repeatRule: l.repeatRule ?? {
          freq: "WEEKLY",
          interval: 1,
        },
      }));

      setPreview(data);
    } catch {
      setError("Không đọc được dữ liệu từ ảnh");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE ITEM =================
  const updateLichHoc = (
    index: number,
    patch: Partial<ImportLichHocPreviewDTO>
  ) => {
    if (!preview) return;

    const lichHoc = [...preview.lichHoc];
    lichHoc[index] = { ...lichHoc[index], ...patch };

    setPreview({ ...preview, lichHoc });
  };

  const toMinutes = (value: number, unit: ReminderUnit) => {
  switch (unit) {
    case "minutes": return value;
    case "hours": return value * 60;
    case "days": return value * 60 * 24;
  }
};

  // ================= CONFIRM =================
  const handleConfirm = async () => {
    if (!preview) return;

    try {
      setLoading(true);

const cleaned = preview.lichHoc.map((l, i) => {

  // ----- XỬ LÝ REPEAT -----
  let rule: RepeatRule | undefined = undefined;

  if (l.lapLai && l.repeatRule) {
    rule = { ...l.repeatRule };
    const endType = repeatEndTypeMap[i] ?? "never";

    switch (endType) {
      case "never":
        delete rule.count;
        delete rule.until;
        break;

      case "count":
        delete rule.until;
        if (!rule.count || rule.count < 1) {
          throw new Error("Số lần lặp không hợp lệ");
        }
        break;

      case "date":
        delete rule.count;
        if (!rule.until) {
          throw new Error("Chưa chọn ngày kết thúc lặp");
        }
        break;
    }
  }

  // ----- XỬ LÝ REMINDER -----
  return {
    ...l,
    repeatRule: rule,

    soPhutTruocBatDau: l.nhacTruocBatDau
      ? toMinutes(l.remindStartValue!, l.remindStartUnit!)
      : undefined,

    soPhutTruocKetThuc: l.nhacTruocKetThuc
      ? toMinutes(l.remindEndValue!, l.remindEndUnit!)
      : undefined,
  };
});

      await confirmImportSchedule({ lichHoc: cleaned });

      alert("Import lịch học thành công");
      onSuccess?.();
      onClose();
    } catch (e) {
      alert(
        e instanceof Error ? e.message : "Không import được lịch"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="importmodal-overlay" onClick={onClose}>
      <div className="importmodal-container" onClick={e => e.stopPropagation()} onWheel={e => e.stopPropagation()}>
        <div className="importmodal-header">
          <h3>Import lịch học từ ảnh</h3>
        </div>

        <div className="importmodal-body">
          {!preview && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={e =>
                  setFile(e.target.files?.[0] ?? null)
                }
              />

              <button
                className="primary-btn"
                disabled={!file || loading}
                onClick={handleImport}
              >
                {loading ? "Đang xử lý..." : "Đọc ảnh"}
              </button>

              {error && <p className="error-text">{error}</p>}
            </>
          )}

          {preview && (
            <>
              <h4>Môn học mới</h4>
              <ul>
                {preview.monHocMoi.map((m, i) => (
                  <li key={i}>{m.tenMonHoc}</li>
                ))}
              </ul>

              <h4>Lịch học sẽ tạo</h4>

              {preview.lichHoc.map((l, i) => (
                <div key={i} className="import-card">
                  <b>{l.tenMonHoc}</b>
                  <div>{l.thu} | {l.gioBatDau} – {l.gioKetThuc}</div>

                  <input
                    placeholder="Địa điểm"
                    value={l.diaDiem || ""}
                    onChange={e =>
                      updateLichHoc(i, { diaDiem: e.target.value })
                    }
                  />

                  <textarea
                    placeholder="Mô tả"
                    value={l.moTa || ""}
                    onChange={e =>
                      updateLichHoc(i, { moTa: e.target.value })
                    }
                  />

                  {/* ===== REMINDER ===== */}
                  <label>
                    <input
                      type="checkbox"
                      checked={l.nhacTruocBatDau}
                      onChange={e =>
                        updateLichHoc(i, {
                          nhacTruocBatDau: e.target.checked,
                        })
                      }
                    />
                    Nhắc trước bắt đầu
                  </label>

                    {l.nhacTruocBatDau && (
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          value={l.remindStartValue}
                          onChange={e =>
                            updateLichHoc(i, {
                              remindStartValue: Number(e.target.value),
                            })
                          }
                        />

                        <select
                          value={l.remindStartUnit}
                          onChange={e =>
                            updateLichHoc(i, {
                              remindStartUnit: e.target.value as ReminderUnit,
                            })
                          }
                        >
                          <option value="minutes">Phút</option>
                          <option value="hours">Giờ</option>
                          <option value="days">Ngày</option>
                        </select>
                      </div>
                    )}


                  <label>
                    <input
                      type="checkbox"
                      checked={l.nhacTruocKetThuc}
                      onChange={e =>
                        updateLichHoc(i, {
                          nhacTruocKetThuc: e.target.checked,
                        })
                      }
                    />
                    Nhắc trước kết thúc
                  </label>

                  {l.nhacTruocKetThuc && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={1}
                      value={l.remindEndValue}
                      onChange={e =>
                        updateLichHoc(i, {
                          remindEndValue: Number(e.target.value),
                        })
                      }
                    />

                    <select
                      value={l.remindEndUnit}
                      onChange={e =>
                        updateLichHoc(i, {
                          remindEndUnit: e.target.value as ReminderUnit,
                        })
                      }
                    >
                      <option value="minutes">Phút</option>
                      <option value="hours">Giờ</option>
                      <option value="days">Ngày</option>
                    </select>
                  </div>
                )}

                  {/* ===== REPEAT ===== */}
                  <label>
                    <input
                      type="checkbox"
                      checked={l.lapLai}
                      onChange={e =>
                        updateLichHoc(i, {
                          lapLai: e.target.checked,
                          repeatRule: e.target.checked
                            ? { freq: "WEEKLY", interval: 1 }
                            : undefined,
                        })
                      }
                    />
                    Lặp lại
                  </label>

                  {l.lapLai && (
                    <div className="repeat-box">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min={1}
                          value={l.repeatRule?.interval}
                          onChange={e =>
                            updateLichHoc(i, {
                              repeatRule: {
                                ...l.repeatRule!,
                                interval: Number(e.target.value),
                              },
                            })
                          }
                        />

                        <select
                          value={l.repeatRule?.freq}
                          onChange={e =>
                            updateLichHoc(i, {
                              repeatRule: {
                                ...l.repeatRule!,
                                freq: e.target.value as RepeatFreq,
                              },
                            })
                          }
                        >
                          <option value="DAILY">Ngày</option>
                          <option value="WEEKLY">Tuần</option>
                          <option value="MONTHLY">Tháng</option>
                        </select>
                      </div>

                      <div className="mt-2">
                        <label>
                          <input
                            type="radio"
                            checked={(repeatEndTypeMap[i] ?? "never") === "never"}
                            onChange={() =>
                              setRepeatEndTypeMap({ ...repeatEndTypeMap, [i]: "never" })
                            }
                          />
                          Không kết thúc
                        </label>

                        <label>
                          <input
                            type="radio"
                            checked={repeatEndTypeMap[i] === "count"}
                            onChange={() =>
                              setRepeatEndTypeMap({ ...repeatEndTypeMap, [i]: "count" })
                            }
                          />
                          Sau
                          <input
                            type="number"
                            min={1}
                            onChange={e =>
                              updateLichHoc(i, {
                                repeatRule: {
                                  ...l.repeatRule!,
                                  count: Number(e.target.value),
                                  until: undefined,
                                },
                              })
                            }
                          />
                          lần
                        </label>

                        <label>
                          <input
                            type="radio"
                            checked={repeatEndTypeMap[i] === "date"}
                            onChange={() =>
                              setRepeatEndTypeMap({ ...repeatEndTypeMap, [i]: "date" })
                            }
                          />
                          Đến ngày
                          <input
                            type="date"
                            onChange={e =>
                              updateLichHoc(i, {
                                repeatRule: {
                                  ...l.repeatRule!,
                                  until: e.target.value,
                                  count: undefined,
                                },
                              })
                            }
                          />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              
            </>
          )}
        </div>

        <div className="importmodal-actions">
                <button className="secondary-btn" onClick={onClose}>
                  Hủy
                </button>
                <button
                  className="success-btn"
                  onClick={handleConfirm}
                  disabled={loading}
                >
                  Xác nhận import
                </button>
              </div>
      </div>
    </div>
  );
}
