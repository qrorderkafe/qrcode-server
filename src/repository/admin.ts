import { prisma } from "../db";

export const findOneAdminByUsername = async (username: string) => {
  return await prisma.admin.findUnique({
    where: {
      username,
    },
  });
};

export const findOneAdminById = async (id: string) => {
  return await prisma.admin.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      username: true,
    },
  });
};
