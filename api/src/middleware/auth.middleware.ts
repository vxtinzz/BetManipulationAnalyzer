import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import "dotenv/config"

export interface CustomRequest extends Request {
 user: string | JwtPayload;
}

export async function auth(req: Request, res: Response, next: NextFunction) {
 try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new Error("Invalid authorization format");
    }

    const token = authHeader?.split(" ")[1];

   if (!token) {
     throw new Error();
   }

   const decoded = jwt.verify(token, process.env.SECRET_KEY!,{ algorithms:['HS256']});
   (req as CustomRequest).user = decoded;

   next();
 } catch (err) {
   res.status(401).json('Invalid or expired token');
 }
};