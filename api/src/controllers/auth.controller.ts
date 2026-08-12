import { Request, Response } from "express"
import * as authService from "../services/auth.service"
import { z } from "zod"

const userSchema = z.object({
    username: z.string(),
    cpf: z.string(),
    password: z.string(),
  })

const userSchemaLogin = z.object({
    username: z.string(),
    password: z.string(),
  })

export async function loginUser(req: Request, res: Response) {
  try {
    const user = userSchemaLogin.parse(req.body);
    const foundUser = await authService.loginUser(user)
    res.status(200).send(foundUser)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const user = userSchema.parse(req.body);
    await authService.registerUser(user)
    res.status(200).send("User created successfully")
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Refresh Token is invalid, expired or revoked"
      });
    }

    const refresh = await authService.refresh(refreshToken)
    res.status(200).send(refresh)
    
  } catch (err: any) {
    res.status(400).json({error: err.message})
  }
}