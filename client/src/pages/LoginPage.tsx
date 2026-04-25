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

    try {
      setLoading(true);

      const normalizedEmail = email.trim().toLowerCase();

      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      // 🔥 ВАЖНО: теперь проверяем OTP
      if (response.data?.requiresOtp) {
        sessionStorage.setItem(
          "pendingLoginEmail",
          response.data.email
        );

        navigate("/verify-login-otp");
        return;
      }

      // fallback (если вдруг сервер вернёт токен напрямую)
      const token = response.data.accessToken || response.data.token;
      const user = response.data.user;

      if (!token) {
        throw new Error("Не удалось начать подтверждение входа");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
      window.location.reload();
    } catch (err: any) {
      console.error(err);
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

        <button type="submit" disabled={loading}>
          {loading ? "Проверка..." : "Войти"}
        </button>


        {error && <div className="auth-error">{error}</div>}

        <p className="auth-text">
          Нет аккаунта? <Link to="/register">Создать аккаунт</Link>
        </p>
        <button
  type="button"
  className="google-btn"
  onClick={() => {
    window.location.href = "/api/auth/google";
  }}
>
  Войти через Google
</button>
      </form>
    </div>

  );
}