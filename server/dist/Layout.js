"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Layout;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
function Layout() {
    return ((0, jsx_runtime_1.jsxs)("div", { style: { minHeight: "100vh", background: "#f8fafc", color: "#0f172a" }, children: [(0, jsx_runtime_1.jsx)("header", { style: {
                    borderBottom: "1px solid #e2e8f0",
                    background: "#ffffff",
                    padding: "16px 24px",
                }, children: (0, jsx_runtime_1.jsxs)("div", { style: {
                        maxWidth: "1100px",
                        margin: "0 auto",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }, children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", style: {
                                fontSize: "28px",
                                fontWeight: 700,
                                color: "#2563eb",
                                textDecoration: "none",
                            }, children: "ExamPro" }), (0, jsx_runtime_1.jsxs)("nav", { style: { display: "flex", gap: "16px", flexWrap: "wrap" }, children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/", children: "\u0413\u043B\u0430\u0432\u043D\u0430\u044F" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", children: "\u0412\u0445\u043E\u0434" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/register", children: "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F" }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/profile", children: "\u041F\u0440\u043E\u0444\u0438\u043B\u044C" })] })] }) }), (0, jsx_runtime_1.jsx)("main", { style: { maxWidth: "1100px", margin: "0 auto", padding: "32px 24px" }, children: (0, jsx_runtime_1.jsx)(react_router_dom_1.Outlet, {}) })] }));
}
//# sourceMappingURL=Layout.js.map