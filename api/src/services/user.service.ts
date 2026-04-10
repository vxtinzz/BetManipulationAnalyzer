import bcrypt from "bcrypt"
import * as userRepository from "../repositories/user.repository"
import { validateUser } from "../utils/validators"
import { error } from "node:console"

export async function createUser(data: any) {
  validateUser(data)

  const exists = await userRepository.findByUsername(data.username)

  if (exists) {
    throw new Error("Username already exists")
  }

  const hashedPassword = await bcrypt.hash(data.password, 10)

  return userRepository.create({
    ...data,
    password: hashedPassword,
  })
}

export async function getAllUsers() {
  return userRepository.findAll()
}

export async function updateUser(id: string, data: any) {
    validateUser(data)
    if(!id){
        throw new Error("Invalid Id")
    }

    const user = await userRepository.findById(id)

    if(!user){
        throw new Error("User not found")
    }

    if (data.username) {
    const exists = await userRepository.findByUsername(data.username)
        if (exists && exists.id !== id) {
            throw new Error("Username already exists")
        }
    }

    return userRepository.update(id, data)
}