import { FiSearch } from "react-icons/fi";
import { useState, useEffect } from "react";
import type { SummaryItem, MonHocThongKe  } from "../../../shared/types/Summary.type";
import { getMyMonHoc } from "../../../shared/services/monHocService";
import type { MonHocResponse } from "../../../shared/types/monHoc";
import "../../../styles/summary/summary-left.css";
import { getTopSubjectThisWeek} from "../../../shared/services/summary.Service";

interface Props {
  summaries: SummaryItem[];
  applyFilter: (filter: {
    keyword?: string;
    maMonHoc?: number;
    fromDate?: string;
    toDate?: string;
  }) => void;
}

export default function LeftPage({ summaries, applyFilter }: Props) {
  const [keyword, setKeyword] = useState("");
  const [subject, setSubject] = useState<number | "">("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [monHocs, setMonHocs] = useState<MonHocResponse[]>([]);
  const [topSubject, setTopSubject] = useState<MonHocThongKe | null>(null);

useEffect(() => {
  getTopSubjectThisWeek()
    .then(setTopSubject)
    .catch(err => {
      console.error("Lỗi load thống kê:", err);
    });
}, []);


  useEffect(() => {
    const timeout = setTimeout(() => {
      applyFilter({
        keyword: keyword || undefined,
        maMonHoc: subject === "" ? undefined : subject,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
    }, 400);

    return () => clearTimeout(timeout);
  }, [keyword, subject, fromDate, toDate, applyFilter]);


  useEffect(() => {
    getMyMonHoc()
      .then(setMonHocs)
      .catch(err => {
        console.error("Lỗi load môn học:", err);
      });
  }, []);

  return (
    <div className="left-column">
      <aside className="filter-box">
        <h2>Tìm kiếm & Bộ lọc</h2>

        {/* Search */}
        <div className="search-box">
          <span><FiSearch size={18} /></span>
          <input
            placeholder="Tìm kiếm theo tiêu đề hoặc nội dung..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
          />
        </div>

        {/* Subject */}
        <label>Môn học</label>
        <select
          value={subject}
          onChange={e =>
            setSubject(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">Tất cả môn học</option>

          {monHocs.map(mon => (
            <option key={mon.maMonHoc} value={mon.maMonHoc}>
              {mon.tenMonHoc}
            </option>
          ))}
        </select>


        {/* Created time */}
        <label>Thời gian tạo</label>
        <div className="date-range">
          <input
            type="date"
            value={fromDate}
            onChange={e => setFromDate(e.target.value)}
          />
          <span className="date-separator">→</span>
          <input
            type="date"
            value={toDate}
            onChange={e => setToDate(e.target.value)}
          />
        </div>

        <small className="hint">
          Bỏ trống cả hai để xem tất cả
        </small>
      </aside>

      {/* Stats */}
      <div className="stats-box under-filter">
        <h3>Thống kê</h3>

        <div className="stat-row">
          <span>Tổng tóm tắt</span>
          <strong className="blue">{summaries.length}</strong>
        </div>

        <div className="stat-row">
          <span>Môn có nhiều tóm tắt nhất tuần này</span>
          <strong>
            {topSubject
              ? `${topSubject.tenMonHoc} (${topSubject.soLuongTomTat})`
              : "Chưa có dữ liệu"}
          </strong>

        </div>
      </div>
    </div>
  );
}
