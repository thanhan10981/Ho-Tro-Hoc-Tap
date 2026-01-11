import { useState } from "react";
import { registerApi } from "../api/auth.api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    hoTen: "",
    email: "",
    matKhau: "",
    xacNhanMatKhau: "",
    linhVucQuanTam: "",
  });

  const navigate = useNavigate();

  const handleRegister = async () => {
    await registerApi(form);
    alert("Đăng ký thành công!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded w-96 space-y-3">
        <h2 className="text-xl font-bold text-center">Đăng ký</h2>

        {Object.keys(form).map((key) => (
          <input
            key={key}
            className="w-full border p-2 rounded"
            placeholder={key}
            type={key.includes("Khau") ? "password" : "text"}
            onChange={(e) =>
              setForm({ ...form, [key]: e.target.value })
            }
          />
        ))}

        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
}
