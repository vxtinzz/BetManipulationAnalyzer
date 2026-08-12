import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import "dotenv/config"
import * as userRepository from "../repositories/user.repository"
import * as refreshRepository from "../repositories/refresh.repository"
import { validateUserCreate, validateUserLogin } from "../utils/validators"
import { hash } from "node:crypto"

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
      acessToken: acessToken,
      refreshToken: refreshToken
    };

 } catch (error) {
    throw error;
 }
}

export async function refresh(refreshToken: string) {
  try{
      const payload = jwt.verify(refreshToken, process.env.SECRET_KEY!, { algorithms:['HS256']}) as JwtPayload;
      if(payload.type !== 'refresh'){
         throw new Error("Unauthorized")
      }
      
      const foundedUser = await userRepository.findById(payload.id);

      if(!foundedUser){
        throw new Error("Invalid Refresh Token")
      }

      const foundedHash = await refreshRepository.findByUserId(foundedUser.id);
      let validToken = null;

      for (const hashTest of foundedHash) {
        const isValid = await bcrypt.compare(refreshToken, hashTest.tokenHash);

        if(isValid){
          validToken = hashTest;
          break;
        }
      }

      if(!validToken){
        throw new Error("Invalid Refresh Token")
      }     

      const newAcessToken = jwt.sign({ id: foundedUser.id.toString(), username: foundedUser.username, role: foundedUser.role, type: "acess"}, process.env.SECRET_KEY!, {
       expiresIn: '1h',
     });

     const newRefreshToken = jwt.sign({ id: foundedUser.id.toString(), type: "refresh" }, process.env.SECRET_KEY!, {
       expiresIn: '7d',
     });

     const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
     const expiresAt = new Date();
     expiresAt.setDate(expiresAt.getDate() + 7);

     await refreshRepository.create({
      tokenHash: newRefreshTokenHash,
      userId: foundedUser.id,
      expiresAt: expiresAt
     })

     await refreshRepository.revokeTokenById(validToken.id)

     return { 
      user: { 
        id: foundedUser.id, 
        username:foundedUser.username,
        role:foundedUser.role
      },
      acessToken: newAcessToken,
      refreshToken: newRefreshToken
    };
  } catch (error){
    throw error;
  }
}
