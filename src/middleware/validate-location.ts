import type { NextFunction, Response, Request } from "express";
import { ApiError, calculateDistance } from "../lib/utils";

export const validateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { latitude, longitude } = req.body;
  try {
    if (!latitude || !longitude) {
      throw new ApiError("Latitude dan longitude harus diisi", 400);
    }

    console.log({
      latitude,
      longitude,
    });

    const distance = calculateDistance(
      latitude,
      longitude,
      -4.3795399,
      121.5521879
    );

    console.log(`Jarak pelanggan: ${distance.toFixed(2)} meter`);
    if (distance > 50) {
      throw new ApiError("Jarak pelanggan lebih dari 50 meter", 400);
    }

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
