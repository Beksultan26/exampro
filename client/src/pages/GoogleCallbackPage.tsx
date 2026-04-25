import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const user = params.get("user");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    if (user) {
      localStorage.setItem("user", user);
    }

    navigate("/");
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Вход через Google</h1>
        <p className="auth-subtitle">Подождите...</p>
      </div>
    </div>
  );
}