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

  const [, setUser] = useState<Me | null>(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem("user");
      return null;
    }
  });

  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    const loadMe = async () => {
      const token = localStorage.getItem("token");

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
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.clear();
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <nav className="main-nav">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          Exam<span>Prep</span>
        </Link>

        <button
          type="button"
          className="burger"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link
            className={`nav-btn ${isActive("/") ? "active" : ""}`}
            to="/"
            onClick={closeMenu}
          >
            Главная
          </Link>

          <Link
            className={`nav-btn ${isActive("/theory") ? "active" : ""}`}
            to="/theory"
            onClick={closeMenu}
          >
            Теория
          </Link>

          <Link
            className={`nav-btn ${isActive("/tests") ? "active" : ""}`}
            to="/tests"
            onClick={closeMenu}
          >
            Тесты
          </Link>

          {isLoggedIn && (
  <Link
    className={`nav-btn ${isActive("/admin") ? "active" : ""}`}
    to="/admin"
    onClick={closeMenu}
  >
    Админка
  </Link>
)}

          {!isLoggedIn ? (
            <>
              <Link
                className={`nav-btn ${isActive("/login") ? "active" : ""}`}
                to="/login"
                onClick={closeMenu}
              >
                Вход
              </Link>

              <Link
                className={`nav-btn nav-outline ${
                  isActive("/register") ? "active" : ""
                }`}
                to="/register"
                onClick={closeMenu}
              >
                Регистрация
              </Link>
            </>
          ) : (
            <>
              <Link
                className={`nav-btn ${isActive("/profile") ? "active" : ""}`}
                to="/profile"
                onClick={closeMenu}
              >
                Профиль
              </Link>

              <button
                type="button"
                className="nav-btn nav-logout"
                onClick={handleLogout}
              >
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