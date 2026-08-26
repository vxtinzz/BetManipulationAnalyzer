import bcrypt from "bcrypt"
import crypto from "crypto"
import { z } from "zod"
import jwt, { JwtPayload } from "jsonwebtoken"
import "dotenv/config"
import * as userRepository from "../repositories/user.repository"
import * as refreshRepository from "../repositories/refresh.repository"
import { validateUserCreate, validateUserLogin } from "../utils/validators"

const jwtRefreshSchema = z.object({
  userId: z.string(),
  type: z.literal("refresh")
})

interface CreateUserData {
  username: string;
  cpf: string;
  password: string;
}

function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}

function refreshTokenMatches(providedTokenHash: string, storedTokenHash: string): boolean {
  const providedBuffer = Buffer.from(providedTokenHash, "hex")
  const storedBuffer = Buffer.from(storedTokenHash, "hex")

  if (providedBuffer.length !== storedBuffer.length) {
    return false
  }

  return crypto.timingSafeEqual(providedBuffer, storedBuffer)
}

export async function registerUser(data: CreateUserData) {
  validateUserCreate(data)

  const exists = await userRepository.findByUsername(data.username)
  const cpfExists = await userRepository.findByCpf(data.cpf)

  if (exists || cpfExists) {
    throw new Error("Invalid or already registered data")
  }
  
  const hashedPassword = await bcrypt.hash(data.password, 10)

  return userRepository.create({
    username: data.username,
    password: hashedPassword,
    cpf: data.cpf,
  })
}

export async function loginUser(data: any) {
  validateUserLogin(data)
 try {
   const foundedUser = await userRepository.findByUsername(data.username);

   if(!foundedUser){
    await bcrypt.compare("fake-password", "$2b$10$9WuW0iHmGl4QPQFW0lm4qOhfakehashwi.DXuPgJ07rKjkYHhiGm")
    throw new Error("Invalid Credencials")
   }

   const userMatch = await bcrypt.compare(data.password,foundedUser.password)

    if(!userMatch){
        throw new Error("Invalid Credencials")
    }

     const accessToken = jwt.sign({ userId: foundedUser.id.toString(), username: foundedUser.username, role: foundedUser.role, type: "access"}, process.env.SECRET_KEY!, {
       expiresIn: '15m',
     });

     const refreshToken = jwt.sign({ userId: foundedUser.id.toString(), type: "refresh" }, process.env.SECRET_KEY!, {
       expiresIn: '7d',
     });

     const refreshTokenHash = hashRefreshToken(refreshToken);
     const expiresAt = new Date();
     expiresAt.setDate(expiresAt.getDate() + 7);

     await refreshRepository.create({
      tokenHash: refreshTokenHash,
      userId: foundedUser.id,
      expiresAt: expiresAt
     })

     return { 
      user: { 
        id: foundedUser.id, 
        username:foundedUser.username,
        role:foundedUser.role
      },
      accessToken: accessToken,
      refreshToken: refreshToken
    };

 } catch (error) {
    throw error;
 }
}

export async function refresh(refreshToken: string) {
  try{
      const decoded = jwt.verify(refreshToken, process.env.SECRET_KEY!, { algorithms:['HS256']}) as JwtPayload;
      const payload = jwtRefreshSchema.parse(decoded);
      
      const foundedUser = await userRepository.findById(payload.userId);

      if(!foundedUser){
        throw new Error("Invalid Refresh Token")
      }

      const foundedHash = await refreshRepository.findByUserId(foundedUser.id);
      const incomingTokenHash = hashRefreshToken(refreshToken);
      let validToken = null;

      for (const hashTest of foundedHash) {     
        const isValid = refreshTokenMatches(incomingTokenHash, hashTest.tokenHash);
        if(isValid){
          validToken = hashTest;
          break;
        }
      }

      if(!validToken || validToken.revokedAt){
        throw new Error("Invalid Refresh Token")
      }
      
      const newAccessToken = jwt.sign({ userId: foundedUser.id.toString(), username: foundedUser.username, role: foundedUser.role, type: "access"}, process.env.SECRET_KEY!, {
       expiresIn: '15m',
     });

     const newRefreshToken = jwt.sign({ userId: foundedUser.id.toString(), type: "refresh" }, process.env.SECRET_KEY!, {
       expiresIn: '7d',
     });

     const newRefreshTokenHash = hashRefreshToken(newRefreshToken);
     const expiresAt = new Date();
     expiresAt.setDate(expiresAt.getDate() + 7);

     const data = {
      tokenHash: newRefreshTokenHash,
      userId: foundedUser.id,
      expiresAt: expiresAt
     };

     await refreshRepository.rotateToken(data ,validToken.id)

     return { 
      user: { 
        id: foundedUser.id, 
        username:foundedUser.username,
        role:foundedUser.role
      },
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  } catch (error){
    throw error;
  }
}