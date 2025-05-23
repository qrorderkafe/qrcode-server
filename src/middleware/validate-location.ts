import type { NextFunction, Response, Request } from "express";
import { ApiError, calculateDistance } from "../lib/utils";
import { findLocationSetting } from "../repository/location-setting";

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

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new ApiError("Latitude dan longitude harus berupa angka", 400);
    }

    const locationSetting = await findLocationSetting();
    if (!locationSetting) {
      throw new ApiError("Location setting tidak ditemukan", 404);
    }

    if (!locationSetting.isActive) {
      next();
    } else {
      const distance = calculateDistance(
        latitude,
        longitude,
        locationSetting.latitude!,
        locationSetting.longitude!
      );

      console.log(`Jarak pelanggan: ${distance.toFixed(2)} meter`);
      if (distance > locationSetting.radius!) {
        throw new ApiError(
          `Jarak pelanggan lebih dari ${locationSetting.radius} meter`,
          400
        );
      }

      next();
    }
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
