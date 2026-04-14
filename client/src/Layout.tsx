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

  const token = localStorage.getItem("accessToken");
  const [user, setUser] = useState<Me | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        setUser(null);
      }
    };

    loadMe();
  }, [token]);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="app-shell">
      <nav className="main-nav">
        <Link to="/" className="nav-logo">
          Exam<span>Pro</span>
        </Link>

        {/* бургер */}
        <button className="burger" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link className={`nav-btn ${isActive("/") ? "active" : ""}`} to="/">
            Главная
          </Link>

          <Link className="nav-btn" to="/theory">
            Теория
          </Link>

          <Link className="nav-btn" to="/tests">
            Тесты
          </Link>

          {user?.role === "ADMIN" && (
            <Link className="nav-btn" to="/admin">
              Админка
            </Link>
          )}

          {!token ? (
            <>
              <Link className="nav-btn" to="/login">
                Вход
              </Link>
              <Link className="nav-btn nav-outline" to="/register">
                Регистрация
              </Link>
            </>
          ) : (
            <>
              <Link className="nav-btn" to="/profile">
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