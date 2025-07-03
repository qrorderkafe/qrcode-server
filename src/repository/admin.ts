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

export const updateAdmin = async (
  id: string,
  data: { username?: string; password?: string }
) => {
  await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
};
