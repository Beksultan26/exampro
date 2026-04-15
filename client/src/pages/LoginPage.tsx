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
    console.log("LOGIN CLICKED");

    try {
      const normalizedEmail = email.trim().toLowerCase();

      console.log("BEFORE REQUEST", {
        url: "/auth/login",
        email: normalizedEmail,
      });

      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      console.log("AFTER REQUEST", response.data);

      sessionStorage.setItem("pending2faEmail", normalizedEmail);
      navigate("/verify-otp");
    } catch (err: any) {
      console.error("LOGIN ERROR FULL:", err);
      console.error("LOGIN ERROR RESPONSE:", err?.response?.data);
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
          name="email"
          autoComplete="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="Введите пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
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