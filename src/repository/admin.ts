import { prisma } from "../db";

export const findOneAdmin = async (username: string) => {
  return await prisma.admin.findUnique({
    where: {
      username,
    },
  });
};
