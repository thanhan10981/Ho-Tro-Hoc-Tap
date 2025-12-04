import "../../styles/dashboard.css";

const DashboardPage = () => {
  return (
    <div className="dashboard">

      {/* HERO */}
            <section className="hero">
        <div className="hero-left">
          <h1>Xin chào Nguyễn Thành! 👋</h1>
          <p>Hôm nay bạn muốn học gì?</p>

          <div className="search-row">
            <div className="search-box">
              <input type="text" placeholder="Đặt câu hỏi cho AI hoặc tìm kiếm..." />
              <img src="/search.svg" className="search-icon" />
            </div>

            <button className="ask-ai-btn">Hỏi AI ngay</button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-circle"></div>
          <img src="/logo_ai.svg" className="hero-img" />
        </div>
      </section>



      {/* STAT CARDS */}
      <section className="stats">
  <div className="stat-card">
    <div className="stat-top">
      <h3>Môn học đang theo</h3>
      <div className="stat-icon blue">
        <img src="/icons/book.svg" />
      </div>
    </div>
    <div className="stat-value">8</div>
  </div>

  <div className="stat-card">
    <div className="stat-top">
      <h3>Deadline sắp tới</h3>
      <div className="stat-icon orange">
        <img src="/icons/bell.svg" />
      </div>
    </div>
    <div className="stat-value orange">5</div>
  </div>

  <div className="stat-card">
    <div className="stat-top">
      <h3>Quiz hoàn thành</h3>
      <div className="stat-icon green">
        <img src="/icons/check.svg" />
      </div>
    </div>
    <div className="stat-value green">85%</div>
  </div>

  <div className="stat-card">
    <div className="stat-top">
      <h3>Điểm yếu cần cải thiện</h3>
      <div className="stat-icon red">
        <img src="/icons/warning.svg" />
      </div>
    </div>
    <div className="stat-value red">3</div>
  </div>
</section>


      {/* ASSISTANT + SỰ KIỆN (2 CỘT) */}
<section className="assistant-events">
  
  {/* CỘT 1 — AI ASSISTANT */}
  <div className="assistant">
    <div className="assistant-header">
      <div className="icon-blue">
        <img src="/logo_ai.svg" />
      </div>
      <h2>AI Assistant</h2>
    </div>

    <div className="assistant-input">
      <input placeholder="Đặt câu hỏi cho AI..." />
      <button>Gửi</button>
    </div>

    <div className="assistant-suggest">
      <button>“Hôm nay có môn gì?”</button>
      <button>“Deadline tuần này?”</button>
      <button>“Tạo quiz Toán”</button>
    </div>

    <div className="assistant-chat">
      <div className="user-msg">Tuần này còn môn nào thi không?</div>
      <div className="ai-msg">
        Bạn có môn Cấu trúc dữ liệu thi vào 12/12 lúc 13:00, phòng B203.
        Còn môn Cơ sở dữ liệu thi 15/12 lúc 8:00, phòng A101.
      </div>
    </div>
  </div>

      {/* CỘT 2 — SỰ KIỆN SẮP TỚI */}
      {/* === UPCOMING EVENTS === */}
<section className="events-card">
  <h2 className="events-title">Sự kiện sắp tới</h2>

  <div className="event-item urgent">
    <div className="event-line urgent"></div>
    <div className="event-body">
      <div className="event-top">
        <span className="badge urgent">URGENT</span>
        <span className="event-time">Hôm nay 14:00</span>
      </div>
      <h3 className="event-name">Nộp bài tập Cơ sở dữ liệu</h3>
      <p className="event-desc">Thiết kế CSDL cho hệ thống quản lý thư viện</p>
    </div>
  </div>

  <div className="event-item important">
    <div className="event-line important"></div>
    <div className="event-body">
      <div className="event-top">
        <span className="badge important">IMPORTANT</span>
        <span className="event-time">Ngày mai 8:00</span>
      </div>
      <h3 className="event-name">Kiểm tra giữa kỳ Toán</h3>
      <p className="event-desc">Phòng A205 • Đại số tuyến tính</p>
    </div>
  </div>

  <div className="event-item normal">
    <div className="event-line normal"></div>
    <div className="event-body">
      <div className="event-top">
        <span className="badge normal">NORMAL</span>
        <span className="event-time">T3 • 10:00</span>
      </div>
      <h3 className="event-name">Thuyết trình nhóm AI</h3>
      <p className="event-desc">Ứng dụng Machine Learning trong y tế</p>
    </div>
  </div>

  <div className="event-item normal">
    <div className="event-line normal"></div>
    <div className="event-body">
      <div className="event-top">
        <span className="badge normal">NORMAL</span>
        <span className="event-time">T5 • 15:30</span>
      </div>
      <h3 className="event-name">Học bù Lập trình Web</h3>
      <p className="event-desc">Phòng B103 • Framework React</p>
    </div>
  </div>
</section>


    </section>
<div className="dashboard-grid">
{/* RECENT ACTIVITIES */}
<section className="recent-activity">
  <h2>Hoạt động học tập gần đây</h2>

  <div className="activity-item">
    <div className="activity-left">
      <div className="activity-icon blue">
        <img src="/icons/document.svg" />
      </div>
      <div>
        <p className="activity-title">Tóm tắt: Thuật toán sắp xếp</p>
        <span className="activity-desc">Cấu trúc dữ liệu • 2 giờ trước</span>
      </div>
    </div>
    <button className="activity-btn blue">Xem tóm tắt</button>
  </div>

  <div className="activity-item">
    <div className="activity-left">
      <div className="activity-icon green">
        <img src="/icons/check.svg" />
      </div>
      <div>
        <p className="activity-title">Quiz: Cơ sở dữ liệu quan hệ</p>
        <span className="activity-desc">Điểm: 8.5/10 • 1 ngày trước</span>
      </div>
    </div>
    <button className="activity-btn green">Xem kết quả</button>
  </div>

  <div className="activity-item">
    <div className="activity-left">
      <div className="activity-icon purple">
        <img src="/icons/layers.svg" />
      </div>
      <div>
        <p className="activity-title">Flashcard: Từ vựng tiếng Anh</p>
        <span className="activity-desc">Tiến độ: 45/60 thẻ • 3 ngày trước</span>
      </div>
    </div>
    <button className="activity-btn purple">Tiếp tục học</button>
  </div>
</section>

        
        {/* RIGHT: Smart Suggestions */}
  <section className="smart-suggest">
    <h2>Gợi ý thông minh</h2>

    {/* Gợi ý 1 */}
    <div className="suggest-card danger">
      <div className="suggest-icon red">
        <img src="/icons/alert.svg" />
      </div>
      <div className="suggest-content">
        <p className="suggest-title">Bạn nên ôn lại</p>
        <span className="suggest-desc">
          Dynamic Programming – điểm yếu trong môn Cấu trúc dữ liệu
        </span>
        <button className="suggest-btn red">Tạo Quiz</button>
      </div>
    </div>

    {/* Gợi ý 2 */}
    <div className="suggest-card warning">
      <div className="suggest-icon orange">
        <img src="/icons/time.svg" />
      </div>
      <div className="suggest-content">
        <p className="suggest-title">Deadline sắp tới</p>
        <span className="suggest-desc">
          Bài tập Cơ sở dữ liệu — còn 6 tiếng
        </span>
        <button className="suggest-btn orange">Xem chi tiết</button>
      </div>
    </div>

    {/* Gợi ý 3 */}
    <div className="suggest-card info">
      <div className="suggest-icon blue">
        <img src="/icons/info.svg" />
      </div>
      <div className="suggest-content">
        <p className="suggest-title">Gợi ý tóm tắt</p>
        <span className="suggest-desc">
          Slide mới từ môn Trí tuệ nhân tạo
        </span>
        <button className="suggest-btn blue">Tóm tắt ngay</button>
      </div>
    </div>
  </section>
</div>
</div>
      );
    };

export default DashboardPage;
