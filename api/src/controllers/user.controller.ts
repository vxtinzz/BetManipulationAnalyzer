import { Request, Response } from "express"
import * as userService from "../services/user.service"
import { CustomRequest } from "../middleware/auth.middleware"
import * as validators from "../utils/validators"


export async function adminGetUsers(req: Request, res: Response) {
  try {
    const limit = 10
    const { page, sortBy, order } = validators.paginationSchema.parse(req.query)

    const users = await userService.getAllUsers(page, limit, sortBy, order)
    res.status(200).json({state: "sucess", message: "Users successfully retrieved", response: users})
  } catch (err:any) {
    res.status(400).json({state: "error", code: "GET_USERS_FAILED", message: err.message})
  }
}

export async function adminGetUserById(req: Request, res: Response) {
  try {
    const { id } = validators.userIdSchema.parse(req.params)

    const user = await userService.getAdmin(id)
    
    if (!user) {
      return res.status(404).json({state: "error", code: "GET_USER_BY_ID_FAILED", message: "User Not Found"})
    }
      res.status(200).json({state: "sucess", message: "User successfully retrieved", response: user})
  } catch (err: any) {
    res.status(400).json({state: "error", code: "GET_USER_BY_ID_FAILED", message: err.message})
  }
}

export async function getUser(req: Request, res: Response) {
  try {
    const userReq = (req as CustomRequest).user
    const id = userReq.userId
    const userFounded = await userService.getUser(id)

    if (!userFounded) {
      return res.status(404).json({state: "error", code: "GET_USER_FAILED", message: "User Not Found"})
  }
    res.status(200).json({state: "sucess", message: "User successfully retrieved", response: userFounded})
  } catch (err: any) {
    res.status(400).json({state: "error", code: "GET_USER_FAILED", message: err.message})
  }
}

export async function getAdminMe(req: Request, res: Response) {
  try {
    const userReq = (req as CustomRequest).user
    const id = userReq.userId
    const userFounded = await userService.getAdmin(id)

    if (!userFounded) {
      return res.status(404).json({state: "error", code: "GET_USER_FAILED", message: "User Not Found"})
  }
    res.status(200).json({state: "sucess", message: "User successfully retrieved", response: userFounded})
  } catch (err: any) {
    res.status(400).json({state: "error", code: "GET_ADMIN_ME_FAILED", message: err.message})
  }
}

export async function adminUpdateUser(req: Request, res: Response) {
  try {
    const { id } = validators.userIdSchema.parse(req.params)
    
    const dataUpdate = validators.userUpdateSchema.parse(req.body)
    await userService.updateUser(id, dataUpdate)
    res.status(200).json({state: "sucess", message: "User successfully updated"})
  } catch (err: any) {
    res.status(422).json({state: "error", code: "ADMIN_UPDATE_USER_FAILED", message: err.message})
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const userReq = (req as CustomRequest).user
    const id = userReq.userId
    const dataUpdate = validators.userUpdateSchema.parse(req.body)
    await userService.updateUser(id, dataUpdate)
    res.status(200).json({state: "sucess", message: "User successfully updated"})
  } catch (err: any) {
    res.status(422).json({state: "error", code: "UPDATE_USER_FAILED", message: err.message})
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const userReq = (req as CustomRequest).user
    const id = userReq.userId
    const dataDelete = validators.userDeleteSchema.parse(req.body)
    await userService.deleteUser(id, dataDelete)
    res.status(200).json({state: "sucess", message: "User successfully deleted"})
  } catch (err: any) {
    res.status(422).json({state: "error", code: "DELETE_USER_FAILED", message: err.message})
  }
}

export async function adminDeleteUser(req: Request, res: Response) {
  try {
    const { id } = validators.userIdSchema.parse(req.params)
    await userService.adminDeleteUser(id)
    res.status(200).json({state: "sucess", message: "User successfully deleted"})
  } catch (err: any) {
    res.status(422).json({state: "error", code: "ADMIN_DELETE_USER_FAILED", message: err.message})
  }
}
