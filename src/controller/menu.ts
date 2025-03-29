import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/utils";
import * as service from "../service/menu";
import type { AdminRequest } from "../../types";

export const addMenu = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, price, categoryId } = req.body;
  const imageFile = req.file;
  try {
    await service.addMenu(name, price, categoryId, req.admin?.id!, imageFile);

    res.status(201).json({
      status: "Success",
      message: "Menu berhasil ditambahkan",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const getAllMenu = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = req.query.search as string;
  const category = req.query.category as string;
  const minPrice = req.query.minPrice
    ? parseFloat(req.query.minPrice as string)
    : undefined;
  const maxPrice = req.query.maxPrice
    ? parseFloat(req.query.maxPrice as string)
    : undefined;

  try {
    const { menus, totalMenus, totalPages } = await service.getAllMenu(
      page,
      limit,
      search,
      category,
      minPrice,
      maxPrice
    );

    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan semua menu",
      data: menus,
      meta: {
        totalMenus,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        filtes: {
          search: search || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          category: category || undefined,
        },
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const getMenuById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const menu = await service.getMenuById(id);

    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan menu",
      data: menu,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const updateMenu = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const { name, price, categoryId } = req.body;
  const imageFile = req.file;
  const id = req.params.id;
  try {
    await service.updateMenu(
      id,
      name,
      price,
      categoryId,
      req.admin?.id!,
      imageFile
    );

    res.status(200).json({
      status: "Success",
      message: "Menu berhasil diupdate",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const updateMenuStatus = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    await service.updateMenuStatus(id);

    res.status(200).json({
      status: "Success",
      message: "Status menu berhasil diupdate",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const deleteMenu = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    await service.deleteMenu(id);

    res.status(200).json({
      status: "Success",
      message: "Menu berhasil dihapus",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
