import "../../../styles/Schedule/ScheduleTodayEvents.css";
export default function ScheduleTodayEvents() {
  return (
    <div className="today-section">
      <h3>Sự kiện hôm nay - 22/12/2024</h3>

      <div className="today-event blue">
        <div className="icon">🕮</div>
        <div className="content">
          <div className="title">Toán cao cấp</div>
          <div className="desc">8:00 - 10:00 • Phòng A205 • Đại số tuyến tính</div>
        </div>

        <div className="actions">
          <button className="edit">✎</button>
          <button className="delete">🗑</button>
        </div>
      </div>


      <div className="today-event red">
        <div className="icon">⏱</div>
        <div className="content">
          <div className="title">Deadline bài tập AI</div>
          <div className="desc">23:59 • Machine Learning ứng dụng</div>
        </div>

        <div className="actions">
          <button className="edit">✎</button>
          <button className="delete">🗑</button>
        </div>
      </div>
    </div>
  );
}
