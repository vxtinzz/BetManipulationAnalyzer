import bcrypt from "bcrypt"
import * as userRepository from "../repositories/user.repository"

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
    const existsCpf = await userRepository.findByCpf(data.cpf)
        if (existsCpf && existsCpf.id !== id) {
            throw new Error("Cpf already exists")
        }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    return userRepository.update(id, data)
}

export async function deleteUser(id: string, password: any) {

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

    const passwordIsValid = await bcrypt.compare(password,user.password) 

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