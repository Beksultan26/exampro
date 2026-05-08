"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const profile_routes_1 = __importDefault(require("./modules/profile/profile.routes"));
app_1.default.use("/uploads", express_1.default.static(path_1.default.join(process.cwd(), "uploads")));
app_1.default.use("/api/profile", profile_routes_1.default);
app_1.default.listen(env_1.env.port, () => {
    console.log(`Server started on http://localhost:${env_1.env.port}`);
});
//# sourceMappingURL=server.js.map