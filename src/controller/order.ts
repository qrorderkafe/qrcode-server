import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/utils";
import type { AdminRequest, CreateOrderDTO } from "../../types";
import * as service from "../service/order";
import type { OrderStatus } from "@prisma/client";

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { customerName, items, tableId, note }: CreateOrderDTO = req.body;
  try {
    const order = await service.createOrder({
      customerName,
      items,
      tableId,
      note,
    });
    res.status(200).json({
      status: "Success",
      message: "Pesanan berhasil dibuat",
      data: order,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { tableId, status, startDate, endDate, sortBy, sortOrder, search } =
    req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const { orders, totalOrders, totalPages } = await service.getAllOrders(
      page,
      limit,
      tableId as string,
      status as OrderStatus,
      startDate as string,
      endDate as string,
      sortBy as string,
      sortOrder as string,
      search as string
    );
    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan semua pesanan",
      data: orders,
      meta: {
        totalOrders,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        filters: {
          search: search || undefined,
          sortBy: sortBy || undefined,
          sortOrder: sortOrder || undefined,
          tableId: tableId || undefined,
          status: status || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
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

export const getOrderById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const order = await service.getOrderById(id);
    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan pesanan",
      data: order,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const updateOrderStatus = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const order = await service.updateOrderStatus(id, status, req.admin!.id);
    res.status(200).json({
      status: "Success",
      message: "Status pesanan berhasil diupdate",
      data: order,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const changeTableOrder = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const { tableId, oldTable } = req.body;

  try {
    await service.changeTableOrder(id, tableId, oldTable);
    res.status(200).json({
      status: "Success",
      message: "Meja pesanan berhasil diupdate",
    });
  } catch (error) {
    console.log(error);
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
