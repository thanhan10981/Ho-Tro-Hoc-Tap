import { useState } from "react";
import { registerApi } from "../api/auth.api";
import { useNavigate, Link } from "react-router-dom";
import "./auth.css";

interface RegisterForm {
  hoTen: string;
  email: string;
  matKhau: string;
  xacNhanMatKhau: string;
  linhVucQuanTam: string;
}

export default function Register() {
  const [form, setForm] = useState<RegisterForm>({
    hoTen: "",
    email: "",
    matKhau: "",
    xacNhanMatKhau: "",
    linhVucQuanTam: "",
  });

  const [emailError, setEmailError] = useState<string | null>(null);
  const navigate = useNavigate();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = <K extends keyof RegisterForm>(
    key: K,
    value: RegisterForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    if (key === "email") {
      if (!validateEmail(value)) {
        setEmailError("Email không đúng định dạng");
      } else {
        setEmailError(null);
      }
    }
  };

  const handleRegister = async () => {
    if (emailError) {
      alert("Vui lòng nhập email hợp lệ");
      return;
    }

    if (form.matKhau !== form.xacNhanMatKhau) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      await registerApi(form);
      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card space-y-3">
        <h2 className="auth-title">Đăng ký</h2>

        {(Object.keys(form) as (keyof RegisterForm)[]).map((key) => (
          <div key={key}>
            <input
              className="auth-input"
              placeholder={
                key === "hoTen"
                  ? "Họ và tên"
                  : key === "email"
                  ? "Email"
                  : key === "matKhau"
                  ? "Mật khẩu"
                  : key === "xacNhanMatKhau"
                  ? "Xác nhận mật khẩu"
                  : "Lĩnh vực quan tâm"
              }
              type={key.includes("Khau") ? "password" : "text"}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />

            {key === "email" && emailError && (
              <p className="auth-error">{emailError}</p>
            )}
          </div>
        ))}

        <button
          onClick={handleRegister}
          disabled={!!emailError || !form.email}
          className="auth-btn"
        >
          Đăng ký
        </button>

        <p className="auth-link">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
