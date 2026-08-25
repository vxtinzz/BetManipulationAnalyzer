import { Request, Response } from "express"
import * as userService from "../services/user.service"
import { CustomRequest } from "../middleware/auth.middleware"
import { z } from "zod"

const userSchema = z.object({
    username: z.string(),
    cpf: z.string(),
    password: z.string(),
  })

  const userSchemaDelete = z.object({
    password: z.string(),
  })

  const userIdSchema = z.object({
    id: z.string(),
  })
  
  const userSchemaUpdate = userSchema.partial().strict()

export async function adminGetUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers()
  res.json(users)
}

export async function adminGetUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    if(typeof id !== "string"){
      return res.status(400).json({error: "Invalid Id"})
    }
    const user = await userService.getUser(id)
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.status(200).json(user)
  } catch (err: any) {
   res.status(400).json({ error: err.message  }) 
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const userReq = (req as CustomRequest).user
    const id = userReq.userId
    const userFounded = await userService.getUser(id)
    if (!userFounded) {
      return res.status(404).json({ error: "User not found" })
  }
    res.status(200).json(userFounded)
  } catch (err: any) {
   res.status(400).json({ error: err.message  }) 
  }
}

export async function createUser(req: Request, res: Response) {
  try {
    const dataCreate = userSchema.parse(req.body);
    await userService.createUser(dataCreate)
    res.status(201).send("User created successfully")
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function adminUpdateUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid Id" })
  }
    const dataUpdate = userSchemaUpdate.parse(req.body)
    await userService.updateUser(id, dataUpdate)
    res.status(200).send("User updated successfully")
  } catch (err: any) {
    res.status(422).json({error:err.message})
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userReq = (req as CustomRequest).user
    const id = userReq.userId
    const dataUpdate = userSchemaUpdate.parse(req.body)
    await userService.updateUser(id, dataUpdate)
    res.status(200).send("User updated successfully")
  } catch (err: any) {
    res.status(422).json({error:err.message})
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userReq = (req as CustomRequest).user
    const id = userReq.userId
    const dataDelete = userSchemaDelete.parse(req.body)
    await userService.deleteUser(id, dataDelete)
    res.status(200).send("User deleted successfully")
  } catch (err: any) {
    res.status(422).json({error:err.message})
  }
}

export async function adminDeleteUser(req: Request, res: Response) {
  try {
    const { id } = userIdSchema.parse(req.params)
    await userService.adminDeleteUser(id)
    res.status(200).send("User deleted successfully")
  } catch (err: any) {
    res.status(422).json({error:err.message})
  }
}