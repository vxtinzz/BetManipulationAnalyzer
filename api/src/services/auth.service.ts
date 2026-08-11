import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import "dotenv/config"
import * as userRepository from "../repositories/user.repository"
import * as refreshRepository from "../repositories/refresh.repository"
import { validateUserCreate, validateUserLogin } from "../utils/validators"

export async function registerUser(data: any) {
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

     const acessToken = jwt.sign({ id: foundedUser.id.toString(), username: foundedUser.username, role: foundedUser.role, type: "acess"}, process.env.SECRET_KEY!, {
       expiresIn: '1h',
     });

     const refreshToken = jwt.sign({ id: foundedUser.id.toString(), type: "refresh" }, process.env.SECRET_KEY!, {
       expiresIn: '7d',
     });

     const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
     const expiresAt = new Date();
     expiresAt.setDate(expiresAt.getDate() + 7);

     await refreshRepository.refreshTokenRepository.create({
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
      acessToken: acessToken,
      refreshToken: refreshToken
    };

 } catch (error) {
   throw error;
 }

//refresh function
}