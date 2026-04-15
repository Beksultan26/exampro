import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      sessionStorage.setItem("pending2faEmail", email.trim().toLowerCase());
      navigate("/verify-otp");
    } catch (err: any) {
      console.error("LOGIN ERROR:", err?.response?.data || err);
      setError(err?.response?.data?.message || "Ошибка входа");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleLogin}>
        <h1>Вход</h1>
        <p className="auth-subtitle">
          Войдите в аккаунт, чтобы продолжить подготовку к экзаменам
        </p>

        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="auth-row">
          <Link to="/forgot-password" className="auth-forgot-link">
            Забыли пароль?
          </Link>
        </div>

        <button type="submit">Войти и получить код</button>

        {error && <div className="auth-error">{error}</div>}

        <p className="auth-text">
          Нет аккаунта? <Link to="/register">Создать аккаунт</Link>
        </p>
      </form>
    </div>
  );
}