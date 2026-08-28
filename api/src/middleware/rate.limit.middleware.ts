import { rateLimit } from "express-rate-limit"
import { MINUTES } from "../utils/validators"
import { CustomRequest } from "./auth.middleware"

export const loginLimiter = rateLimit({
  windowMs: 15 * MINUTES,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many login attempts"
  }
})

export const registerLimiter = rateLimit({
  windowMs: 60 * MINUTES,
  limit: 6,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many create users attemps"
  }
})

export const refreshLimiter = rateLimit({
  windowMs: 30 * MINUTES,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Too many requests attempts"
  }
})

export const sensitiveLimiter = rateLimit({
  windowMs: 10 * MINUTES,
  limit: 5,
  standardHeaders: "draft-8",
  keyGenerator: (req) => {
    const customRequest = (req as CustomRequest)
    return customRequest.user?.userId
  },
  legacyHeaders: false,
  message: {
    error: "Too many requests attempts"
  }
})

export const softLimiter = rateLimit({
  windowMs: 1 * MINUTES,
  limit: 60,
  standardHeaders: "draft-8",
  keyGenerator: (req) => {
    const customRequest = (req as CustomRequest)
    return customRequest.user?.userId
  },
  legacyHeaders: false,
  message: {
    error: "Too many requests attempts"
  }
})