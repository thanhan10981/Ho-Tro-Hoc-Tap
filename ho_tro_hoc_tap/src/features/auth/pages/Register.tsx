import { useState } from "react";
import { registerApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

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

    await registerApi(form);
    alert("Đăng ký thành công!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded w-96 space-y-3">
        <h2 className="text-xl font-bold text-center">Đăng ký</h2>

        {(Object.keys(form) as (keyof RegisterForm)[]).map((key) => (
          <div key={key}>
            <input
              className="w-full border p-2 rounded"
              placeholder={key}
              type={key.includes("Khau") ? "password" : "text"}
              value={form[key]}
              onChange={(e) => handleChange(key, e.target.value)}
            />

            {key === "email" && emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>
        ))}

        <button
          onClick={handleRegister}
          disabled={!!emailError || !form.email}
          className={`w-full p-2 rounded text-white transition
            ${
              emailError
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}
