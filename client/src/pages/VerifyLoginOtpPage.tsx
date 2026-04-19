import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function VerifyLoginOtpPage() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const savedEmail = sessionStorage.getItem("pendingLoginEmail");

    if (!savedEmail) {
      navigate("/login");
      return;
    }

    setEmail(savedEmail);
  }, [navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email не найден. Повторите вход.");
      return;
    }

    if (!code.trim()) {
      setError("Введите код");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-login-otp", {
        email,
        code: code.trim(),
      });

      const token = res.data?.accessToken;
      const user = res.data?.user;

      if (!token) {
        setError("Токен не получен");
        return;
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      sessionStorage.removeItem("pendingLoginEmail");

      setSuccess("Вход подтверждён");
      navigate("/");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Не удалось подтвердить код входа"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1>Подтверждение входа</h1>

        <p className="auth-subtitle">
          Мы отправили код на email:
          <br />
          <span>{email || "..."}</span>
        </p>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Введите код"
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Проверка..." : "Подтвердить вход"}
        </button>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}
      </form>
    </div>
  );
}