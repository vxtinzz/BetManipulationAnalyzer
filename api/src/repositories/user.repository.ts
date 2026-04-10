import prisma from "../config/prisma"

export function findAll() {
  return prisma.user.findMany()
}

export function findByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  })
}

export function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  })
}

export function create(data: any) {
  return prisma.user.create({ data })
}

export function update(id: string, data: any) {
  return prisma.user.update({
    where: { id },
    data,
  })
}