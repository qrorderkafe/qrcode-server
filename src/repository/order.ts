import type { OrderStatus } from "@prisma/client";
import { prisma } from "../db";

export const createOrder = async (
  tableId: string,
  totalPrice: number,
  items: {
    menu_id: string;
    quantity: number;
    price: number;
    note: string | undefined;
  }[],
  note?: string,
  customerName?: string
) => {
  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        note,
        customer_name: customerName || null,
        total_price: totalPrice,
        table_id: tableId,
        orderItems: {
          create: items,
        },
      },
      include: {
        orderItems: {
          include: {
            menu: true,
          },
        },
        table: true,
      },
    });
    return newOrder;
  });

  return order;
};

export const findAllOrder = async (
  where: {},
  take: number,
  skip: number,
  sortBy?: string,
  sortOrder?: string
) => {
  return await prisma.order.findMany({
    where,
    take,
    skip,
    include: {
      table: true,
      orderItems: {
        include: {
          menu: true,
        },
      },
    },
    orderBy: {
      [sortBy || "created_at"]: sortOrder || "desc",
    },
  });
};

export const findOrderById = async (id: string) => {
  return await prisma.order.findUnique({
    where: {
      id,
    },
    include: {
      table: true,
      orderItems: {
        include: {
          menu: true,
        },
      },
    },
  });
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  return await prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
    include: {
      table: true,
      orderItems: {
        include: {
          menu: true,
        },
      },
    },
  });
};

export const statusOrdersCount = async (status: OrderStatus) => {
  return await prisma.order.count({
    where: {
      status,
    },
  });
};

export const getTotalOrderCount = async () => {
  return await prisma.order.count({
    where: {
      salesReport_id: { not: null },
    },
  });
};

export const getOrdersCountByDate = async (start: Date, end: Date) => {
  return await prisma.order.count({
    where: {
      created_at: {
        gte: start,
        lte: end,
      },
    },
  });
};

export const getCompletedOrdersCountByDate = async (start: Date, end: Date) => {
  return await prisma.order.count({
    where: {
      status: "COMPLETED",
      created_at: {
        gte: start,
        lte: end,
      },
    },
  });
};

export const getTotalOrder = async (whereCondition = {}) => {
  return await prisma.order.count();
};

export const updateOrderTable = async (id: string, tableId: string) => {
  return await prisma.order.update({
    where: {
      id,
    },
    data: {
      table_id: tableId,
    },
    include: {
      table: {
        include: {
          admin: true,
        },
      },
    },
  });
};
