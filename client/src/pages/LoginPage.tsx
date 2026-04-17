import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      const token = response.data.accessToken || response.data.token;
      localStorage.setItem("token", token);
      navigate("/");
      const user = response.data.user;

      if (!token) {
        throw new Error("Токен не получен");
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      sessionStorage.removeItem("pending2faEmail");

      navigate("/");
    } catch (err: any) {
      console.error("LOGIN ERROR:", err);
      setError(err?.response?.data?.message || "Ошибка входа");
    } finally {
      setLoading(false);
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

        <button type="submit" disabled={loading}>
          {loading ? "Входим..." : "Войти"}
        </button>

        {error && <div className="auth-error">{error}</div>}

        <p className="auth-text">
          Нет аккаунта? <Link to="/register">Создать аккаунт</Link>
        </p>
      </form>
    </div>
  );
}