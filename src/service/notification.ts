import { prisma } from "../db";
import { ApiError } from "../lib/utils";
import * as notificationRepository from "../repository/notification";

export const getAdminNotifications = async (limit: number, offset: number) => {
  return await notificationRepository.getAdminNotifications(limit, offset);
};

export const markNotificationAsRead = async (
  adminId: string,
  notificationId: string
) => {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  });

  if (!notification) {
    throw new ApiError("Notifikasi tidak ditemukan", 404);
  }

  if (notification.admin_id !== adminId) {
    throw new ApiError("Anda tidak memiliki akses ke notifikasi ini", 403);
  }

  return await notificationRepository.markNotificationAsRead(notificationId);
};

export const markAllNotificationsAsRead = async (adminId: string) => {
  const result = await notificationRepository.markAllNotificationsAsRead(
    adminId
  );
  return result.count;
};
