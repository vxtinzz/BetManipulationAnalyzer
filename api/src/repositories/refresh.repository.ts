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

export function revokeTokenById(tokenId: string) {
  return prisma.refreshToken.update({
    where: {
      id: tokenId,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}