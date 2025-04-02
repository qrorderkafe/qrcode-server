import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/utils";
import type { CreateOrderDTO } from "../../types";
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
  const { tableId, status, paymentStatus, fromDate, toDate } = req.query;
  try {
    const orders = await service.getAllOrders(
      tableId as string,
      status as OrderStatus,
      paymentStatus as string,
      fromDate as string,
      toDate as string
    );
    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan semua pesanan",
      data: orders,
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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const { status } = req.body;
  try {
    const order = await service.updateOrderStatus(id, status);
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
