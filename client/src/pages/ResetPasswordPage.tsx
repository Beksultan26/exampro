import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const email = sessionStorage.getItem("resetPasswordEmail") || "";

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/auth/reset-password", {
        email,
        code,
        newPassword,
      });

      sessionStorage.removeItem("resetPasswordEmail");
      setMessage(data.message || "Пароль обновлён");
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ошибка сброса пароля");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleResetPassword}>
        <h1>Новый пароль</h1>
        <p className="auth-subtitle">
          Введите код из письма и задайте новый пароль
        </p>

        <input
          type="text"
          placeholder="Введите 6-значный код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />

        <input
          type="password"
          placeholder="Введите новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button type="submit">Обновить пароль</button>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <p className="auth-text">
          <Link to="/login">Вернуться ко входу</Link>
        </p>
      </form>
    </div>
  );
}