import { Router } from "express"
import { getUser, updateUser, deleteUser } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"

const router = Router()

//admin
router.get("/me", auth, getUser)
router.patch("/me", auth, updateUser)
router.delete("/me", auth, deleteUser)

export default router