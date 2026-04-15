import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 минут
  max: 50, // увеличили лимит
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Слишком много попыток. Попробуйте позже.",
  },

  skipFailedRequests: true,
});