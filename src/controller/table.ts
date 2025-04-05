import type { NextFunction, Response } from "express";
import { ApiError } from "../lib/utils";
import * as service from "../service/table";
import type { AdminRequest } from "../../types";

export const createTable = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const { tableNumber } = req.body;
  try {
    await service.createTable(parseInt(tableNumber), req.admin?.id!);
    res.status(201).json({ message: "Meja berhasil dibuat" });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const getAllTable = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tables = await service.getAllTable();
    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan semua meja",
      data: tables,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
    }
  }
};

export const getTableById = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const table = await service.getTableById(id);
    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan meja",
      data: table,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
    }
  }
};

export const deleteTable = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    await service.deleteTable(id);
    res.status(200).json({
      status: "Success",
      message: "Meja berhasil dihapus",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const updateTable = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const { tableNumber } = req.body;
  const id = req.params.id;
  try {
    await service.updateTable(id, parseInt(tableNumber));
    res.status(200).json({
      status: "Success",
      message: "Meja berhasil diupdate",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
