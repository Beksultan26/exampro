"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    port: Number(process.env.PORT || 5000),
    databaseUrl: process.env.DATABASE_URL || "",
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
//# sourceMappingURL=env.js.map