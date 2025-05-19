import type { CreateOrderDTO, OrderWhereInput } from "../../types";
import { ApiError } from "../lib/utils";
import { findAllMenu } from "../repository/menu";
import { findTableById } from "../repository/table";
import * as repository from "../repository/order";
import * as notificationRepository from "../repository/notification";
import type { OrderStatus } from "@prisma/client";
import { emitNewOrder, emitOrderStatusChange } from "../lib/socket-handler";
import {
  createReport,
  findReportByDateAndAdminId,
  updateReport,
} from "../repository/report";

export const createOrder = async (data: CreateOrderDTO) => {
  const { items, tableId, customerName, note } = data;
  if (!tableId || !items || !Array(items) || items.length === 0) {
    throw new ApiError("Table ID dan minimal satu item diperlukan", 400);
  }

  const table = await findTableById(tableId);
  if (!table) {
    throw new ApiError("Meja tidak ditemukan", 404);
  }

  const menudIds = items.map((item) => item.menuId);
  const menuItems = await findAllMenu(
    {
      id: {
        in: menudIds,
      },
      status: true,
    },
    1000000,
    0
  );

  if (menuItems.length !== items.length) {
    throw new ApiError(
      "Satu atau beberapa menu tidak ditemukan atau tidak aktif",
      404
    );
  }

  const menuMap: Record<string, (typeof menuItems)[0]> = {};

  menuItems.forEach((item) => {
    menuMap[item.id] = item;
  });

  let totalPrice = 0;
  const orderItems = items.map((item) => {
    const menuItem = menuMap[item.menuId];
    const itemPrice = menuItem.price * item.quantity;
    totalPrice += itemPrice;
    return {
      menu_id: menuItem.id,
      quantity: item.quantity,
      price: itemPrice,
      note: item.note,
    };
  });

  const order = await repository.createOrder(
    tableId,
    totalPrice,
    orderItems,
    note,
    customerName
  );

  const newNotificaton = await notificationRepository.createNotification(
    table.admin_id,
    `Pesanan baru dari meja ${table.number}`,
    "NEW_ORDER",
    order.id
  );

  emitNewOrder(newNotificaton);

  return order;
};

export const getAllOrders = async (
  page: number,
  limit: number,
  tableId?: string,
  status?: OrderStatus,
  startDate?: string,
  endDate?: string,
  sortBy?: string,
  sortOrder?: string,
  search?: string
) => {
  const skip = (page - 1) * limit;
  const whereCondition: OrderWhereInput = {};
  whereCondition.AND = [];

  if (search) {
    const tableMatch = search.match(/^meja\s*(\d+)$/i);
    if (tableMatch) {
      const tableNumber = parseInt(tableMatch[1]);

      whereCondition.AND?.push({
        OR: [
          {
            table: {
              number: {
                equals: tableNumber,
              },
            },
          },
        ],
      });
    } else {
      whereCondition.AND?.push({
        OR: [
          {
            customer_name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      });
    }
  }

  if (tableId) {
    whereCondition.AND?.push({
      tableId,
    });
  }
  if (status && status !== undefined) {
    whereCondition.AND?.push({
      status: {
        equals: status,
      },
    });
  }
  if (startDate && endDate) {
    whereCondition.AND?.push({
      created_at: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    });
  }

  const totalOrders = await repository.getTotalOrder(whereCondition);
  const totalPages = Math.ceil(totalOrders / limit);

  const orders = await repository.findAllOrder(
    whereCondition,
    limit,
    skip,
    sortBy,
    sortOrder
  );

  return {
    orders,
    totalOrders,
    totalPages,
  };
};

export const getOrderById = async (id: string) => {
  const order = await repository.findOrderById(id);
  if (!order) {
    throw new ApiError("Pesanan tidak ditemukan", 404);
  }
  return order;
};

export const updateOrderStatus = async (
  id: string,
  status: OrderStatus,
  adminId: string
) => {
  if (!id || !status) {
    throw new ApiError("ID dan status diperlukan", 400);
  }

  const order = await repository.findOrderById(id);
  if (!order) {
    throw new ApiError("Pesanan tidak ditemukan", 404);
  }

  const validateStatus: OrderStatus[] = [
    "CANCELLED",
    "COMPLETED",
    "PENDING",
    "PROCESSING",
  ];
  if (!validateStatus.includes(status)) {
    throw new ApiError("Status tidak valid", 400);
  }

  const updatedOrder = await repository.updateOrderStatus(id, status);
  if (updatedOrder.status === "COMPLETED") {
    const orderDate = new Date(updatedOrder.created_at);
    orderDate.setHours(0, 0, 0, 0);

    const report = await findReportByDateAndAdminId(orderDate, adminId);
    const totalItems = updatedOrder.orderItems.reduce((acc, item) => {
      return acc + item.quantity;
    }, 0);

    if (report) {
      await updateReport(
        report.id,
        totalItems,
        updatedOrder.total_price,
        updatedOrder.id
      );
    } else {
      await createReport(
        orderDate,
        adminId,
        totalItems,
        updatedOrder.total_price,
        updatedOrder.id
      );
    }
  }

  emitOrderStatusChange(updatedOrder);
};
