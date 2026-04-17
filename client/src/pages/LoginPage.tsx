import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      const { accessToken, user } = response.data;

      // ✅ ВОТ ЭТОГО У ТЕБЯ НЕ БЫЛО
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");

      // можно обновить страницу, чтобы меню сразу обновилось
      window.location.reload();
    } catch (err: any) {
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
          required
        />

        <input
          type="password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="auth-row">
          <Link to="/forgot-password">Забыли пароль?</Link>
        </div>

        <button type="submit">Войти</button>

        {error && <div className="auth-error">{error}</div>}

        <p className="auth-text">
          Нет аккаунта? <Link to="/register">Создать аккаунт</Link>
        </p>
      </form>
    </div>
  );
}