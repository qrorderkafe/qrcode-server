import type { MenuWhereInput } from "../../types";
import { ApiError, imagekit } from "../lib/utils";
import * as repository from "../repository/menu";

export const addMenu = async (
  name: string,
  price: number,
  categoryId: string,
  adminId: string,
  imageFile?: Express.Multer.File
) => {
  if (!name || !price || !categoryId || !adminId || !imageFile) {
    throw new ApiError("Semua field harus diisi", 400);
  }

  const uploadFile = await imagekit.upload({
    file: imageFile.buffer,
    fileName: `menu-${imageFile.originalname}-${Date.now()}`,
    folder: `coffee-resto/menu`,
  });

  await repository.createMenu(
    name,
    parseInt(price.toString()),
    categoryId,
    adminId,
    uploadFile.url
  );
};

export const getAllMenu = async (
  page: number,
  limit: number,
  search: string,
  category: string,
  minPrice?: number,
  maxPrice?: number
) => {
  const skip = (page - 1) * limit;
  let whereCondition: MenuWhereInput = {};

  if (search) {
    whereCondition = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    };
  }

  if (category) {
    whereCondition = {
      OR: [
        {
          category_id: {
            equals: category,
          },
        },
      ],
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereCondition.price = {};
    if (minPrice !== undefined) {
      whereCondition.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      whereCondition.price.lte = maxPrice;
    }
  }

  const totalMenus = await repository.totalMenu(whereCondition);
  const totalPages = Math.ceil(totalMenus / limit);
  const menus = await repository.findAllMenu(whereCondition, limit, skip);

  return {
    menus,
    totalMenus,
    totalPages,
  };
};

export const getMenuById = async (menuId: string) => {
  const menu = await repository.findOneMenu(menuId);
  if (!menu) {
    throw new ApiError("Menu tidak ditemukan", 404);
  }
  return menu;
};

export const updateMenu = async (
  menuId: string,
  name: string,
  price: number,
  categoryId: string,
  adminId: string,
  imageFile?: Express.Multer.File
) => {
  if (!name || !price || !categoryId || !adminId) {
    throw new ApiError("Semua field harus diisi", 400);
  }

  const menu = await repository.findOneMenu(menuId);
  if (!menu) {
    throw new ApiError("Menu tidak ditemukan", 404);
  }

  if (imageFile) {
    const uploadFile = await imagekit.upload({
      file: imageFile.buffer,
      fileName: `menu-${imageFile.originalname}-${Date.now()}`,
      folder: `coffee-resto/menu`,
    });

    await repository.updateMenu(
      menuId,
      name,
      parseInt(price.toString()),
      categoryId,
      adminId,
      uploadFile.url
    );
  } else {
    await repository.updateMenu(
      menuId,
      name,
      parseInt(price.toString()),
      categoryId,
      adminId,
      menu.image!
    );
  }
};

export const updateMenuStatus = async (menudId: string) => {
  const menu = await repository.findOneMenu(menudId);
  if (!menu) {
    throw new ApiError("Menu tidak ditemukan", 404);
  }
  let status: boolean;
  if (menu.status) {
    status = false;
  } else {
    status = true;
  }
  await repository.updateMenuStatus(menudId, status);
};

export const deleteMenu = async (menuId: string) => {
  const menu = await repository.findOneMenu(menuId);
  if (!menu) {
    throw new ApiError("Menu tidak ditemukan", 404);
  }
  await repository.deleteMenu(menuId);
};
