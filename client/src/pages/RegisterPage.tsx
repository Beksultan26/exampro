import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  general?: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export default function RegisterPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Введите имя";
    } else if (name.trim().length < 2) {
      newErrors.name = "Имя должно содержать минимум 2 символа";
    }

    if (!email.trim()) {
      newErrors.email = "Введите email";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Введите корректный email";
    }

    if (!password) {
      newErrors.password = "Введите пароль";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Минимум 8 символов, хотя бы 1 буква и 1 цифра";
    }

    return newErrors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const { data } = await api.post("/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      const token = data.accessToken || data.token;

      if (token) {
        localStorage.setItem("token", token);

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        navigate("/profile");
        window.location.reload();
      } else {
        navigate("/login");
      }
    } catch (err: any) {
      setErrors({
        general: err?.response?.data?.message || "Ошибка регистрации",
      });
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <h1>Регистрация</h1>

        <p className="auth-subtitle">
          Создайте аккаунт и получите доступ к теории, тестам и прогрессу
        </p>

        <input
          type="text"
          placeholder="Введите имя"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "", general: "" }));
          }}
        />
        {errors.name && <div className="auth-error">{errors.name}</div>}

        <input
          type="email"
          placeholder="Введите email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: "", general: "" }));
          }}
        />
        {errors.email && <div className="auth-error">{errors.email}</div>}

        <input
          type="password"
          placeholder="Создайте пароль"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: "", general: "" }));
          }}
        />

        <div className="auth-hint">
          <p><strong>Требования к паролю:</strong></p>
          <ul>
            <li>Минимум 8 символов</li>
            <li>Минимум одна буква</li>
            <li>Минимум одна цифра</li>
          </ul>
        </div>

        {errors.password && <div className="auth-error">{errors.password}</div>}

        <button type="submit">Зарегистрироваться</button>

        {errors.general && <div className="auth-error">{errors.general}</div>}

        <p className="auth-text">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </div>
  );
}