import rateLimit from "express-rate-limit";
import { ApiError } from "../lib/utils";

export const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  handler: (req, res, next) => {
    throw new ApiError("Too many requests, please try again later", 429);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
