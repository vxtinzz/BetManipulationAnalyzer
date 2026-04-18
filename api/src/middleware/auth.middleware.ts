import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { findById } from "../repositories/user.repository"
import "dotenv/config"
import { z } from "zod"

export interface JwtUserPayload {
  id: string
  username: string
  role: string
}

const jwtUserSchema = z.object({
    id: z.string(),
    username: z.string(),
    role: z.enum(["user","admin"])
  })

export interface CustomRequest extends Request {
 user: JwtUserPayload;
}

export function auth(req: Request, res: Response, next: NextFunction) {
 try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid authorization format");
    }

    const token = authHeader?.split(" ")[1];

   if (!token) {
     throw new Error("Invalid or expired token");
   } 

   const decoded = jwt.verify(token, process.env.SECRET_KEY!,{ algorithms:['HS256']}) as JwtUserPayload;
   const user = jwtUserSchema.parse(decoded);

   (req as CustomRequest).user = user;

   next();
 } catch (err) {
   res.status(401).json("Invalid or expired token");
 }
};

export function authorize(...roles: string[]){
  return async function(req: Request, res: Response, next: NextFunction){
    try{
      const user = (req as CustomRequest).user

      if(!user){
        return res.sendStatus(401)
      }

      const dbUser = await findById(user.id)

      if(!dbUser || dbUser.role !== user.role){
        return res.sendStatus(403)
      }

    if(!roles.includes(user.role)){
      return res.sendStatus(403)
    }

    next()
  }catch(err){
    next(err)
    }
  }
}
