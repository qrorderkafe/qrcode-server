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

export const findAllOrder = async (where: {}) => {
  return await prisma.order.findMany({
    where,
    include: {
      table: true,
      orderItems: {
        include: {
          menu: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
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
