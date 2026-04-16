import { Request, Response } from "express"
import * as authService from "../services/auth.service"
import { z } from "zod"

const userSchema = z.object({
    username: z.string(),
    cpf: z.string(),
    password: z.string(),
  })

export async function loginUser(req: Request, res: Response) {
  try {
    const user = userSchema.parse(req.body);
    const foundUser = await authService.loginUser(user)
    res.status(200).send(foundUser)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const user = userSchema.parse(req.body);
    const result = await authService.registerUser(user)
    res.status(200).send("User created successfully")
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}