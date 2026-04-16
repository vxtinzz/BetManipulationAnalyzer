import { Router } from "express"
import { createUser, getUsers, updateUser, deleteUser, adminDeleteUser } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"

const router = Router()

//admin
router.get("/", auth, getUsers)
router.post("/", auth, createUser)
router.put("/:id", auth, updateUser)
router.delete("/admin/:id", auth, adminDeleteUser)

//user
router.delete("/:id", deleteUser)
export default router