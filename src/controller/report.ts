import type { NextFunction, Response } from "express";
import type { AdminRequest } from "../../types";
import { ApiError } from "../lib/utils";
import * as service from "../service/report";

export const getAllReports = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  const { startDate, endDate, sortBy, sortReport } = req.query;
  try {
    const reports = await service.getReports(
      startDate as string,
      endDate as string,
      sortBy as string,
      sortReport as string
    );
    res.status(200).json({
      status: "Success",
      message: "Berhasil mendapatkan semua laporan",
      data: reports,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
