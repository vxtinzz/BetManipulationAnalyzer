import { Request, response, Response } from "express"
import * as authService from "../services/auth.service"
import * as validators from "../utils/validators"

export async function loginUser(req: Request, res: Response) {
  try {
    const user = validators.userLoginSchema.parse(req.body)
    const foundUser = await authService.loginUser(user)
    res.status(200).json({state: "sucess", message: "Logged-in User", response: foundUser})
  } catch (err: any) {
    res.status(400).json({state: "error", code: "LOGIN_FAILED", message: err.message})
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const user = validators.userCreateSchema.parse(req.body);
    await authService.registerUser(user)
    res.status(200).json({state: "sucess", message: "User successfully created"})
  } catch (err: any) {
    res.status(400).json({state: "error", code: "SIGNUP_FAILED", message: err.message})
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({state: "error", code: "REFRESH_FAILED", message: "Refresh Token is invalid, expired or revoked"});
    }

    const refresh = await authService.refresh(refreshToken)
    res.status(200).json({state: "sucess", message: "Token successfully refreshed", response: refresh})
    
    
  } catch (err: any) {
    res.status(400).json({state: "error", code: "REFRESH_FAILED", message: err.message});
  }
}

export async function revokeToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({state: "error", code: "REVOKE_FAILED", message: "Refresh Token is invalid, expired or revoked"});
    }

    await authService.refresh(refreshToken)
    res.status(200).json({state: "sucess", message: "Token revoked"})
    
  } catch (err: any) {
    res.status(400).json({state: "error", code: "REVOKE_FAILED", message: err.message});
  }
}

export async function restoreAccount(req: Request, res: Response) {
  try {
    const dataRestore = validators.userLoginSchema.parse(req.body)
    await authService.restoreAccount(dataRestore)
    res.status(200).json({state: "sucess", message: "User successfully updated"})
  } catch (err: any) {
    res.status(422).json({state: "error", code: "RESTORE_FAILED", message: err.message})
  }
}