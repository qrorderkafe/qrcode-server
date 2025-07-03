import type { ReportWhereInput } from "../../types";
import { prisma } from "../db";

export const findReports = async (
  where: ReportWhereInput,
  sortBy?: string,
  sortReport?: "asc" | "desc"
) => {
  return await prisma.salesReport.findMany({
    where,
    orderBy: {
      [sortBy || "created_at"]: sortReport || "desc",
    },
    include: {
      orders: true,
      admin: {
        select: {
          username: true,
        },
      },
    },
  });
};

export const findReportByDateAndAdminId = async (
  date: Date,
  adminId: string
) => {
  return await prisma.salesReport.findFirst({
    where: {
      date,
      admin_id: adminId,
    },
  });
};

export const updateReport = async (
  id: string,
  totalItems: number,
  totalPrice: number,
  orderId: string
) => {
  await prisma.salesReport.update({
    where: {
      id,
    },
    data: {
      total_items_sold: {
        increment: totalItems,
      },
      income: {
        increment: totalPrice,
      },
      orders: {
        connect: {
          id: orderId,
        },
      },
    },
  });
};

export const createReport = async (
  date: Date,
  adminId: string,
  totalItems: number,
  totalPrice: number,
  orderId: string
) => {
  await prisma.salesReport.create({
    data: {
      date,
      total_items_sold: totalItems,
      income: totalPrice,
      admin_id: adminId,
      orders: {
        connect: {
          id: orderId,
        },
      },
    },
  });
};

export const getSalesReportCount = async () => {
  return await prisma.salesReport.aggregate({
    _sum: {
      income: true,
      total_items_sold: true,
    },
  });
};

export const getSalesReportByDate = async (start: Date, end: Date) => {
  return await prisma.salesReport.findFirst({
    where: {
      date: {
        gte: start,
        lte: end,
      },
    },
    select: {
      total_items_sold: true,
      income: true,
    },
  });
};
