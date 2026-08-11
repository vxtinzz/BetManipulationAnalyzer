import prisma from "../config/prisma";

export const refreshTokenRepository = {
  async create(data: {
    tokenHash: string;
    userId: string;
    expiresAt: Date;
  }) {
    return prisma.refreshToken.create({ data });
  }
};