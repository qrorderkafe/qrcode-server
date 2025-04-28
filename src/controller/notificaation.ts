import { Response, NextFunction } from "express";
import { ApiError } from "../lib/utils";
import * as notificationService from "../service/notification";
import type { AdminRequest } from "../../types";

export const getNotifications = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { notifications, total } =
      await notificationService.getAdminNotifications(limit, offset);

    res.status(200).json({
      status: "Success",
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
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

export const markAsRead = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { notificationId } = req.params;
    const adminId = req.admin?.id;

    const notification = await notificationService.markNotificationAsRead(
      adminId!,
      notificationId
    );

    res.status(200).json({
      status: "Success",
      message: "Notifikasi ditandai telah dibaca",
      data: notification,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};

export const markAllAsRead = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const adminId = req.admin?.id;

    const count = await notificationService.markAllNotificationsAsRead(
      adminId!
    );

    res.status(200).json({
      status: "Success",
      message: `${count} notifikasi ditandai telah dibaca`,
    });
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
