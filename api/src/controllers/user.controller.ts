import { Request, Response } from "express"
import * as userService from "../services/user.service"
import { z } from "zod"

const userSchema = z.object({
    username: z.string(),
    cpf: z.string(),
    password: z.string(),
  })
  
  const userSchemaUpdate = userSchema.partial().strict()
  const userSchemaDelete = userSchema.partial().strict()

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers()
  res.json(users)
}

export async function createUser(req: Request, res: Response) {
  try {
    const dataCreate = userSchema.parse(req.body);
    const result = await userService.createUser(dataCreate)
    res.status(201).json(result)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid Id" })
  }
    const dataUpdate = userSchemaUpdate.parse(req.body)
    const result = await userService.updateUser(id, dataUpdate)
    res.status(200).json(result)
  } catch (err: any) {
    res.status(422).json({error:err.message})
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params
    if (typeof id !== "string") {
      return res.status(400).json({ error: "Invalid Id" })
  }
    const dataDelete = userSchemaDelete.parse(req.body)
    const result = await userService.deleteUser(id, dataDelete)
    res.status(200).json(result)
  } catch (err: any) {
    res.status(422).json({error:err.message})
  }
}