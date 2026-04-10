import { Request, Response } from "express"
import * as userService from "../services/user.service"

export async function getUsers(req: Request, res: Response) {
  const users = await userService.getAllUsers()
  res.json(users)
}

export async function createUser(req: Request, res: Response) {
  try {
    const result = await userService.createUser(req.body)
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
    const result = await userService.updateUser(id, req.body)
    res.status(200).json(result)
  } catch (err: any) {
    res.status(422).json({error:err.message})
  }
}