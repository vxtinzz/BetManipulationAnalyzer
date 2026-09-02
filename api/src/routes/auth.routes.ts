import { Router } from "express"
import { loginUser, registerUser, refreshToken, revokeToken, restoreAccount} from "../controllers/auth.controller"
import { loginLimiter, refreshLimiter, registerLimiter, sensitiveLimiter } from "../middleware/rate.limit.middleware"

const router = Router()

//public
router.post("/login", loginLimiter, loginUser)
router.post("/register", registerLimiter, registerUser)
router.post("/refresh", refreshLimiter, refreshToken)
router.post("/logout", refreshLimiter, revokeToken)
router.post("/restore", refreshLimiter, restoreAccount)

export default router