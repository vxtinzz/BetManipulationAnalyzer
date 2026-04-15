import { Router } from "express"
import { createUser, getUsers, updateUser, deleteUser, adminDeleteUser } from "../controllers/user.controller"

const router = Router()

//admin
router.get("/", getUsers)
router.post("/", createUser)
router.put("/:id", updateUser)
router.delete("/admin/:id", adminDeleteUser)

//user
router.delete("/:id", deleteUser)
export default router