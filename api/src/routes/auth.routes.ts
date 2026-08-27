import { Router } from "express"
import { loginUser, registerUser, refreshToken, revokeToken} from "../controllers/auth.controller"

const router = Router()

//public
router.post("/login", loginUser)
router.post("/register", registerUser)
router.post("/refresh", refreshToken)
router.post("/logout", revokeToken)

export default router