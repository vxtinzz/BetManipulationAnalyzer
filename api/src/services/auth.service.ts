import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import * as userRepository from "../repositories/user.repository"
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
   const foundUser = await userRepository.findByUsername(data.username);

   if(!foundUser){
    await bcrypt.compare("fake-password", "$2b$10$9WuW0iHmGl4QPQFW0lm4qOhfakehashwi.DXuPgJ07rKjkYHhiGm")
    throw new Error("Invalid Credencials")
   }

   const userMatch = await  bcrypt.compare(data.password,foundUser.password)

    if(!userMatch){
        throw new Error("Invalid Credencials")
    }

     const token = jwt.sign({ id: foundUser.id.toString(), username: foundUser.username }, process.env.SECRET_KEY!, {
       expiresIn: '2d',
     });

     return { 
      user: { 
        id: foundUser.id, 
        username:foundUser.username 
      },
      token: token 
    };

 } catch (error) {
   throw error;
 }
}