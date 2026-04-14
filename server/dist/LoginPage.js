"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginPage;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const api_1 = require("./api");
function LoginPage() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [email, setEmail] = (0, react_1.useState)("");
    const [password, setPassword] = (0, react_1.useState)("");
    const [error, setError] = (0, react_1.useState)("");
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            const { data } = await api_1.api.post("/auth/login", {
                email,
                password,
            });
            localStorage.setItem("accessToken", data.accessToken);
            navigate("/profile");
        }
        catch (err) {
            setError(err?.response?.data?.message || "Ошибка входа");
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            maxWidth: "420px",
            margin: "0 auto",
            background: "#fff",
            padding: "24px",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }, children: [(0, jsx_runtime_1.jsx)("h1", { style: { marginBottom: "20px" }, children: "\u0412\u0445\u043E\u0434" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, children: [(0, jsx_runtime_1.jsx)("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), style: {
                            width: "100%",
                            padding: "12px",
                            marginBottom: "12px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                        } }), (0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "\u041F\u0430\u0440\u043E\u043B\u044C", value: password, onChange: (e) => setPassword(e.target.value), style: {
                            width: "100%",
                            padding: "12px",
                            marginBottom: "12px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                        } }), error && ((0, jsx_runtime_1.jsx)("p", { style: { color: "crimson", marginBottom: "12px" }, children: error })), (0, jsx_runtime_1.jsx)("button", { type: "submit", style: {
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "none",
                            background: "#2563eb",
                            color: "#fff",
                            fontWeight: 600,
                            cursor: "pointer",
                        }, children: "\u0412\u043E\u0439\u0442\u0438" })] })] }));
}
//# sourceMappingURL=LoginPage.js.map