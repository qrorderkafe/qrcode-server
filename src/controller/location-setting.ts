import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../lib/utils";
import * as service from "../service/location-setting";

export const getLocationSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locationSetting = await service.getLocationSetting();

    res.status(200).json({
      data: locationSetting,
      status: "Success",
      message: "Sukses mendapatkan location setting",
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const updateLocationSetting = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { latitude, longitude, radius, status } = req.body;
  try {
    await service.updateLocationSetting(
      parseFloat(latitude),
      parseFloat(longitude),
      parseFloat(radius),
      status as "ACTIVE" | "INACTIVE"
    );
    res.status(200).json({
      status: "Success",
      message: "Sukses update location setting",
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
