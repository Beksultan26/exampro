"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfilePage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const api_1 = require("./api");
function ProfilePage() {
    const [user, setUser] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        async function loadProfile() {
            try {
                const { data } = await api_1.api.get("/auth/me");
                setUser(data);
            }
            catch (err) {
                setError(err?.response?.data?.message || "Ошибка загрузки профиля");
            }
        }
        loadProfile();
    }, []);
    function handleLogout() {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    }
    if (error) {
        return (0, jsx_runtime_1.jsx)("p", { style: { color: "crimson" }, children: error });
    }
    if (!user) {
        return (0, jsx_runtime_1.jsx)("p", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            maxWidth: "600px",
            background: "#fff",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }, children: [(0, jsx_runtime_1.jsx)("h1", { style: { marginBottom: "16px" }, children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C" }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u0418\u043C\u044F:" }), " ", user.name] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Email:" }), " ", user.email] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "\u0420\u043E\u043B\u044C:" }), " ", user.role] }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogout, style: {
                    marginTop: "20px",
                    padding: "12px 16px",
                    borderRadius: "10px",
                    border: "none",
                    background: "#ef4444",
                    color: "#fff",
                    cursor: "pointer",
                }, children: "\u0412\u044B\u0439\u0442\u0438" })] }));
}
//# sourceMappingURL=ProfilePage.js.map