import prisma from "../config/prisma"

export function findAll() {
  return prisma.user.findMany({
    where: { isActive: true, },
  })
}

export function findByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username, isActive: true, },
  })
}

export function findById(id: string) {
  return prisma.user.findUnique({
    where: { id, isActive: true, },
  })
}

export function findByCpf(cpf: string){
  return prisma.user.findUnique({
    where: { cpf, isActive: true, },
  })
}

export function create(data: any) {
  return prisma.user.create({ data })
}

export function update(id: string, data: any) {
  return prisma.user.update({
    where: { id, isActive: true, },
    data,
  })
}

export function deleteUser(id: string){
  return prisma.user.delete({
    where: { id },
  })
}