import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const email = sessionStorage.getItem("pending2faEmail") || "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/verify-otp", {
        email,
        code,
      });

      localStorage.setItem("accessToken", data.accessToken);
      sessionStorage.removeItem("pending2faEmail");
      navigate("/profile");
      window.location.reload();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Ошибка подтверждения");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleVerify}>
        <h1>Подтверждение</h1>
        <p className="auth-subtitle">
          Мы отправили 6-значный код на ваш email
        </p>

        <input
          type="text"
          placeholder="Введите 6-значный код"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />

        <button type="submit">Подтвердить вход</button>

        {error && <div className="auth-error">{error}</div>}
      </form>
    </div>
  );
}