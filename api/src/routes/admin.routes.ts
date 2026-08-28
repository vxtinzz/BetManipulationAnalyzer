import { Router } from "express"
import { createUser, adminGetUserById, adminGetUsers, getAdminMe ,adminUpdateUser, updateUser, deleteUser, adminDeleteUser } from "../controllers/user.controller"
import { auth, authorize } from "../middleware/auth.middleware"
import { sensitiveLimiter, softLimiter } from "../middleware/rate.limit.middleware"

const router = Router()

//admin
router.post("/user", auth, authorize("admin"), sensitiveLimiter, createUser)
router.get("/users", auth, authorize("admin"), softLimiter, adminGetUsers)
router.get("/user/:id", auth, authorize("admin"), softLimiter, adminGetUserById)
router.patch("/user/:id", auth, authorize("admin"), sensitiveLimiter, adminUpdateUser)
router.delete("/user/:id", auth, authorize("admin"), sensitiveLimiter, adminDeleteUser)
router.get("/me", auth, authorize("admin"), softLimiter, getAdminMe)
router.patch("/me", auth, authorize("admin"), sensitiveLimiter, updateUser)
router.delete("/me", auth, authorize("admin"), sensitiveLimiter, deleteUser)

export default router