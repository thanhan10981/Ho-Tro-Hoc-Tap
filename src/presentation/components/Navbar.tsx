import "../../styles/navbar.css";


const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Logo */}
    <div className="nav-left">
      <div className="logo-wrapper">
        <img src="/logo_ai.svg" alt="logo" />
      </div>
      <span className="brand">AI StudyBuddy</span>
    </div>


      {/* Menu */}
      <ul className="nav-menu">
        <li className="active">Dashboard</li>
        <li>Hỏi đáp AI</li>
        <li>Tóm tắt bài học</li>
        <li>Kho kiến thức</li>
        <li>Quiz/Flashcard</li>
        <li>Lịch học</li>
      </ul>

      {/* User */}
      <div className="nav-user">
        <div className="bell">
          <span className="badges">3</span>
          <img src="/bell.svg" className="bell-icon" />
        </div>

        <div className="user-info">
          <div className="avatar">NT</div>
          <div>
            <p className="user-name">Nguyễn Thành</p>
            <p className="user-role">Sinh viên CNTT</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
