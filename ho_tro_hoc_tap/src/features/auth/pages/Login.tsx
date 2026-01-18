import { useState } from "react";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginApi({ email, matKhau });
      await loginSuccess(res.token);
      navigate("/dashboard");
    } catch (error) {
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card space-y-4">
        <h2 className="auth-title">Đăng nhập</h2>

        <input
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="auth-input"
          placeholder="Mật khẩu"
          value={matKhau}
          onChange={(e) => setMatKhau(e.target.value)}
        />

        <button onClick={handleLogin} className="auth-btn">
          Đăng nhập
        </button>

        <p className="auth-link">
          Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
        </p>
      </div>
    </div>
  );
}
