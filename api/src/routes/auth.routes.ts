import { Router } from "express"
import { loginUser, registerUser, refreshToken, revokeToken} from "../controllers/auth.controller"
import { loginLimiter, refreshLimiter, registerLimiter } from "../middleware/rate.limit.middleware"

const router = Router()

//public
router.post("/login", loginLimiter, loginUser)
router.post("/register", registerLimiter, registerUser)
router.post("/refresh", refreshLimiter, refreshToken)
router.post("/logout", refreshLimiter, revokeToken)

export default router