import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "./api";

type Me = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<Me | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const loadMe = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } catch {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    };

    loadMe();
  }, []);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="app-shell">
      <nav className="main-nav">
        <Link to="/" className="nav-logo">
          Exam<span>Prep</span>
        </Link>

        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link className={`nav-btn ${isActive("/") ? "active" : ""}`} to="/">
            Главная
          </Link>

          <Link className={`nav-btn ${isActive("/theory") ? "active" : ""}`} to="/theory">
            Теория
          </Link>

          <Link className={`nav-btn ${isActive("/tests") ? "active" : ""}`} to="/tests">
            Тесты
          </Link>

          {user?.role === "ADMIN" && (
            <Link className={`nav-btn ${isActive("/admin") ? "active" : ""}`} to="/admin">
              Админка
            </Link>
          )}

          {!isLoggedIn ? (
            <>
              <Link className={`nav-btn ${isActive("/login") ? "active" : ""}`} to="/login">
                Вход
              </Link>
              <Link
                className={`nav-btn nav-outline ${isActive("/register") ? "active" : ""}`}
                to="/register"
              >
                Регистрация
              </Link>
            </>
          ) : (
            <>
              <Link className={`nav-btn ${isActive("/profile") ? "active" : ""}`} to="/profile">
                Профиль
              </Link>
              <button className="nav-btn nav-logout" onClick={handleLogout}>
                Выйти
              </button>
            </>
          )}
        </div>
      </nav>

      <main className="page-wrap">
        <Outlet />
      </main>
    </div>
  );
}