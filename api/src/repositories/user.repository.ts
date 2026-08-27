import prisma from "../config/prisma"

export function findAll(page: number, limit: number, sortBy: string, order: string) {
  return prisma.user.findMany({
    select: { id: true, username: true, role: true, balance: true, isActive: true, createdAt: true, updateAt: true, deleteAt: true },

    skip: (page - 1) * limit,
    take: limit,
    
    orderBy: {
      [sortBy]: order
    }
  });
}

export function countUsers() {
  return prisma.user.count();
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

export function requestUserDelete(id: string) {
  return prisma.user.update({
    where: { id, isActive: true, },
    data: {
      isActive: false,
      deletedAt: new Date()
    }
  })
}

export function adminDeleteUser(id: string){
  return prisma.user.delete({
    where: { id },
  })
}

async function cleanupInactiveUsers() {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() - 30);

  const result = await prisma.user.deleteMany({
    where: {
      isActive: false,
      deletedAt: {
        lte: expirationDate
      }
    }
  });

  console.log(`${result.count} users removed!`);
}