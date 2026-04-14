"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_router_dom_1 = require("react-router-dom");
const Layout_1 = __importDefault(require("./Layout"));
const HomePage_1 = __importDefault(require("./HomePage"));
const LoginPage_1 = __importDefault(require("./LoginPage"));
const RegisterPage_1 = __importDefault(require("./RegisterPage"));
const ProfilePage_1 = __importDefault(require("./ProfilePage"));
exports.router = (0, react_router_dom_1.createBrowserRouter)([
    {
        path: "/",
        element: (0, jsx_runtime_1.jsx)(Layout_1.default, {}),
        children: [
            { index: true, element: (0, jsx_runtime_1.jsx)(HomePage_1.default, {}) },
            { path: "login", element: (0, jsx_runtime_1.jsx)(LoginPage_1.default, {}) },
            { path: "register", element: (0, jsx_runtime_1.jsx)(RegisterPage_1.default, {}) },
            { path: "profile", element: (0, jsx_runtime_1.jsx)(ProfilePage_1.default, {}) },
        ],
    },
]);
//# sourceMappingURL=router.js.map