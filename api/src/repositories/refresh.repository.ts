import prisma from "../config/prisma";

export function create(data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
  }){
    return prisma.refreshToken.create({ data });
  }

export function findByUserId(userId: string) {
  return prisma.refreshToken.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
  });
}


export async function rotateToken(data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date; 
  }, 
    oldTokenId: string) {
    return prisma.$transaction(async (tx) => {
      const newToken = await tx.refreshToken.create({ data })
      await tx.refreshToken.update({
        where: {
          id: oldTokenId
        },
        data : {
          revokedAt: new Date()
        }
      });
      return newToken;
    })
}