import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 минут
  max: 50, // было 10 → увеличили
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Слишком много попыток. Попробуйте позже.",
  },

  // 🔥 КЛЮЧЕВОЕ для Railway
  keyGenerator: (req) => {
    return req.ip || req.socket.remoteAddress || "unknown";
  },

  // чтобы не падало из-за прокси
  skipFailedRequests: true,
});