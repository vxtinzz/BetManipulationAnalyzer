import { Router } from "express"
import { getUser, updateUser, deleteUser } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"
import { sensitiveLimiter, softLimiter } from "../middleware/rate.limit.middleware"

const router = Router()

//user
router.get("/me", auth, softLimiter, getUser)
router.patch("/me", auth, sensitiveLimiter, updateUser)
router.delete("/me", auth, sensitiveLimiter, deleteUser)

export default router