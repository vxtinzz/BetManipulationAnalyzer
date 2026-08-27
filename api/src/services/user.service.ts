import bcrypt from "bcrypt"
import * as userRepository from "../repositories/user.repository"
import { validateUserCreate, validateUserDelete, validateUserUpdate } from "../utils/validators"

export async function createUser(data: any) {
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

export async function getAllUsers(page: number, limit: number, sortBy: string, order: string) {
  const usersData = await userRepository.findAll(page, limit, sortBy, order)
  const totalUsers = await userRepository.countUsers()

  return {
    users: usersData,
    pagination: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit)
    }
  }
}

export async function getUser(id: string) {
    if(!id){
        throw new Error("Invalid Id")
    }

    const user = await userRepository.findById(id)
    
    if(!user){
        throw new Error("User not found")
    }

    const selectedData = {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "balance": user.balance
    }

    return selectedData;
}

export async function getAdmin(id: string) {
    if(!id){
        throw new Error("Invalid Id")
    }

    const user = await userRepository.findById(id)
    
    if(!user){
        throw new Error("User not found")
    }

    const selectedData = {
        "id": user.id,
        "username": user.username,
        "cpf": user.cpf,
        "role": user.role,
        "balance": user.balance,
        "isActive": user.isActive,
        "createdAt": user.createdAt,
        "updatedAt": user.updatedAt,
        "deletedAt": user.deletedAt
    }

    return selectedData;
}

export async function updateUser(id: string, data: any) {
    validateUserUpdate(data)
    if(!id){
        throw new Error("Invalid Id")
    }

    const user = await userRepository.findById(id)

    if(!user){
        throw new Error("User not found")
    }

    if (data.username) {
    const existsName = await userRepository.findByUsername(data.username)
        if (existsName && existsName.id !== id) {
            throw new Error("Username already exists")
        }
    }

    if (data.cpf) {
    const existsCpf = await userRepository.findByUsername(data.username)
        if (existsCpf && existsCpf.id !== id) {
            throw new Error("Cpf already exists")
        }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    return userRepository.update(id, data)
}

export async function deleteUser(id: string, password: any) {
    validateUserDelete(password)
    if(!id){
        throw new Error("Invalid Id")
    }

    const user = await userRepository.findById(id)

    if(!user){
        await bcrypt.compare("fake-password", "$2b$10$9WuW0iHmGl4QPQFW0lm4qOhfakehashwi.DXuPgJ07rKjkYHhiGm")
        throw new Error("Invalid Credencials")
    }

    if(!password){
      throw new Error("Invalid Credencials")
    }

    const passwordIsValid = await bcrypt.compare(password.password,user.password) 

    if(!passwordIsValid){
        throw new Error("Invalid Credencials")
    }

    return await userRepository.requestUserDelete(id)
}

export async function adminDeleteUser(id: string) {
    if(!id){
        throw new Error("Invalid Id")
    }

    const user = await userRepository.findById(id)
    
    if(!user){
        throw new Error("User not Found")
    }

    return await userRepository.adminDeleteUser(id)
}