import type { NextFunction, Response } from "express";
import { ApiError } from "../lib/utils";
import type { AdminRequest } from "../../types";
import * as service from "../service/stats";

export const getStats = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      completedOrders,
      completedOrdersChangePercentage,
      ordersChangePercentage,
      processingOrders,
      salesChangePercentage,
      totalOrders,
      totalSales,
    } = await service.getStats();
    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan statistik",
      data: {
        completedOrders,
        completedOrdersChangePercentage,
        ordersChangePercentage,
        processingOrders,
        salesChangePercentage,
        totalOrders,
        totalSales,
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

export const getWeeklySales = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const weeklySales = await service.getWeeklySales();
    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan penjualan mingguan",
      data: weeklySales,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
