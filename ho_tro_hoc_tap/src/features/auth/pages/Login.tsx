import { useState } from "react";
import { loginApi } from "../api/auth.api";
import { useAuth } from "../context/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await loginApi({ email, matKhau });
    await loginSuccess(res.token);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded w-96 space-y-4">
        <h2 className="text-xl font-bold text-center">Đăng nhập</h2>

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border p-2 rounded"
          placeholder="Mật khẩu"
          value={matKhau}
          onChange={(e) => setMatKhau(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Đăng nhập
        </button>

        <p className="text-sm text-center">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600">
            Đăng ký
          </Link>
        </p>
      </div>
    </div>
  );
}
