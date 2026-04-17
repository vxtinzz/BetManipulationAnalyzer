import { Router } from "express"
import { createUser, adminGetUser, adminGetUsers, getUser ,adminUpdateUser, updateUser, deleteUser, adminDeleteUser } from "../controllers/user.controller"
import { auth } from "../middleware/auth.middleware"

const router = Router()

//admin
router.post("/user", auth, createUser)
router.get("/users", auth, adminGetUsers)
router.get("/user/:id", auth, adminGetUser)
router.patch("/user/:id", auth, adminUpdateUser)
router.delete("/user/:id", auth, adminDeleteUser)

router.get("/me", auth, getUser)
router.patch("/me", auth, updateUser)
router.delete("/me", deleteUser)

export default router