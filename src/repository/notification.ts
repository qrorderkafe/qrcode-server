import type { NotificationType } from "@prisma/client";
import { prisma } from "../db";

export const createNotification = async (
  adminId: string,
  message: string,
  type: NotificationType,
  orderId?: string
) => {
  return await prisma.notification.create({
    data: {
      admin_id: adminId,
      message,
      type,
      order_id: orderId || null,
    },
    include: {
      order: {
        include: {
          table: true,
          orderItems: {
            include: {
              menu: true,
            },
          },
        },
      },
    },
  });
};

export const getAdminNotifications = async (limit: number, offset: number) => {
  const notifications = await prisma.notification.findMany({
    orderBy: {
      created_at: "desc",
    },
    skip: offset,
    take: limit,
    include: {
      order: {
        include: {
          table: true,
          orderItems: {
            include: {
              menu: true,
            },
          },
        },
      },
    },
  });
  const total = await prisma.notification.count();

  return { notifications, total };
};

export const markNotificationAsRead = async (notificationId: string) => {
  return await prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      read: true,
    },
  });
};

export const markAllNotificationsAsRead = async (adminId: string) => {
  return await prisma.notification.updateMany({
    where: {
      admin_id: adminId,
      read: false,
    },
    data: {
      read: true,
    },
  });
};
