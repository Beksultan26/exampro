import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/auth/forgot-password", {
        email,
      });

      sessionStorage.setItem("resetPasswordEmail", email.trim().toLowerCase());
      setMessage(data.message || "Код отправлен");
      navigate("/reset-password");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ошибка отправки кода");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSendCode}>
        <h1>Сброс пароля</h1>
        <p className="auth-subtitle">
          Введите email, и мы отправим код для восстановления доступа
        </p>

        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Отправить код</button>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <p className="auth-text">
          Вспомнили пароль? <Link to="/login">Вернуться ко входу</Link>
        </p>
      </form>
    </div>
  );
}