import "../../styles/header.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/useAuth";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

    useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <header className="h-header">
      <div className="h-container">

        {/* LEFT: Logo */}
        <div className="h-left">
          <img
            src="/logo_ai.svg"
            className="w-10 h-10"
            style={{
              filter:
                "invert(43%) sepia(88%) saturate(2711%) hue-rotate(201deg) brightness(95%) contrast(92%)",
            }}
          />
          <span className="h-logo-text">AI StudyBuddy</span>
        </div>

        {/* CENTER */}
        <nav className="h-nav">
          <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
            Dashboard
          </Link>
          <Link to="/ai-chat" className={`nav-item ${isActive("/ai-chat") ? "active" : ""}`}>
            Hỏi đáp AI
          </Link>
          <Link to="/summary" className={`nav-item ${isActive("/summary") ? "active" : ""}`}>
            Tóm tắt bài học
          </Link>
          <Link to="/knowledgestorage" className={`nav-item ${isActive("/knowledgestorage") ? "active" : ""}`}>
            Kho kiến thức
          </Link>
          <Link to="/quiz" className={`nav-item ${isActive("/quiz") ? "active" : ""}`}>
            Quiz/Flashcard
          </Link>
          <Link to="/schedule" className={`nav-item ${isActive("/schedule") ? "active" : ""}`}>
            Lịch học
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="h-right">

          {/* Notification */}
          <div className="h-noti">
            <span className="noti-badge">5</span>
            <img src="/bell.svg" className="fa-regular fa-bell" />
          </div>

          {/* User */}
          <div
            className="h-user"
            onClick={() => setOpen((prev) => !prev)}
            ref={dropdownRef}
          >

            <div className="h-avatar">
              {user ? user.hoTen.charAt(0).toUpperCase() : "?"}
            </div>

            <div className="h-user-info">
              <div className="name">
                {user ? user.hoTen : "Khách"}
              </div>
              <div className="role">
                {user ? user.email : "Chưa đăng nhập"}
              </div>
            </div>

            <i className={`fa-solid fa-chevron-down arrow ${open ? "rotate" : ""}`} />
            {open && (
              <div className="h-user-dropdown">
                <button className="dropdown-item" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
