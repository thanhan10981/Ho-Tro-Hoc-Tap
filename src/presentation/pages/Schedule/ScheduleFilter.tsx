import "../../../styles/Schedule/ScheduleFilter.css";

export default function ScheduleFilter() {
  return (
    <div className="filter-panel">

      {/* BỘ LỌC */}
      <div className="panel-section">
        <h3>Bộ lọc & Tìm kiếm</h3>

        <input type="text" className="input" placeholder="Tìm kiếm sự kiện..." />

        <label className="label">Môn học</label>
        <select className="select">
          <option>Tất cả môn học</option>
        </select>

        <label className="label">Loại sự kiện</label>
        <div className="checkbox-group">
          <label><input type="checkbox" /> Lớp học</label>
          <label><input type="checkbox" /> Thi cử</label>
          <label><input type="checkbox" /> Deadline bài tập</label>
          <label><input type="checkbox" /> Ôn tập</label>
        </div>

        <label><input type="checkbox" /> Hiển thị sự kiện đã qua</label>
      </div>

      <div className="section-divider"></div>

      {/* THỐNG KÊ */}
      <div className="panel-section">
        <h3>Thống kê</h3>

        <div className="stat-row">
          <span className="stat-label">Sự kiện tuần này</span>
          <span className="stat-number num-blue">12</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Deadline sắp tới</span>
          <span className="stat-number num-red">3</span>
        </div>

        <div className="stat-row">
          <span className="stat-label">Tỷ lệ hoàn thành</span>
          <span className="stat-number num-green">85%</span>
        </div>

        <div className="best-subject">
          Môn có nhiều sự kiện nhất: <strong>Cấu trúc dữ liệu</strong>
        </div>
      </div>

      <div className="section-divider"></div>

      {/* CÀI ĐẶT THÔNG BÁO */}
      <div className="panel-section">
        <h3>Cài đặt thông báo</h3>

        <label><input type="checkbox" /> Nhắc nhở lớp học</label>
        <label><input type="checkbox" /> Nhắc nhở thi cử</label>
        <label><input type="checkbox" /> Nhắc nhở deadline</label>

        <label className="label">Thời gian nhắc trước:</label>
        <select className="select">
          <option>1 giờ</option>
          <option>2 giờ</option>
          <option>1 ngày</option>
        </select>
      </div>

    </div>
  );
}
