import { prisma } from "../db";

export const createMenu = async (
  name: string,
  price: number,
  categoryId: string,
  adminId: string,
  imageUrl: string
) => {
  await prisma.menu.create({
    data: {
      name,
      price,
      admin_id: adminId,
      image: imageUrl,
      category_id: categoryId,
    },
  });
};

export const findAllMenu = async (
  whereCondition = {},
  take: number,
  skip: number
) => {
  return await prisma.menu.findMany({
    where: whereCondition,
    take,
    skip,
    orderBy: {
      created_at: "desc",
    },
  });
};

export const totalMenu = async (whereCondition = {}) => {
  return await prisma.menu.count({
    where: whereCondition,
  });
};

export const findOneMenu = async (menuId: string) => {
  return await prisma.menu.findUnique({
    where: {
      id: menuId,
    },
  });
};

export const updateMenu = async (
  id: string,
  name: string,
  price: number,
  categoryId: string,
  adminId: string,
  imageUrl: string
) => {
  await prisma.menu.update({
    where: {
      id,
    },
    data: {
      name,
      price,
      admin_id: adminId,
      category_id: categoryId,
      image: imageUrl,
    },
  });
};

export const updateMenuStatus = async (menuId: string, status: boolean) => {
  await prisma.menu.update({
    where: {
      id: menuId,
    },
    data: {
      status,
    },
  });
};

export const deleteMenu = async (menuId: string) => {
  await prisma.menu.delete({
    where: {
      id: menuId,
    },
  });
};
