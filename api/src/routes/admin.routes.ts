import { Router } from "express"
import { createUser, adminGetUserById, adminGetUsers, getAdminMe ,adminUpdateUser, updateUser, deleteUser, adminDeleteUser } from "../controllers/user.controller"
import { auth, authorize } from "../middleware/auth.middleware"

const router = Router()

//admin
router.post("/user", auth, authorize("admin"), createUser)
router.get("/users", auth, authorize("admin"), adminGetUsers)
router.get("/user/:id", auth, authorize("admin"), adminGetUserById)
router.patch("/user/:id", auth, authorize("admin"), adminUpdateUser)
router.delete("/user/:id", auth, authorize("admin"), adminDeleteUser)
router.get("/me", auth, authorize("admin"), getAdminMe)
router.patch("/me", auth, authorize("admin"), updateUser)
router.delete("/me", auth, authorize("admin"), deleteUser)

export default router