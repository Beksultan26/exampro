"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const publicPath = path_1.default.join(__dirname, "../public");
app_1.default.use(express_1.default.static(publicPath));
app_1.default.get("/{*any}", (_req, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
app_1.default.listen(env_1.env.port, () => {
    console.log(`Server started on http://localhost:${env_1.env.port}`);
});
//# sourceMappingURL=server.js.map