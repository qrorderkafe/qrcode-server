import type { CreateOrderDTO, OrderWhereInput } from "../../types";
import { ApiError } from "../lib/utils";
import { findAllMenu } from "../repository/menu";
import { findTableById } from "../repository/table";
import * as repository from "../repository/order";
import * as notificationRepository from "../repository/notification";
import type { OrderStatus } from "@prisma/client";
import { emitNewOrder, emitOrderStatusChange } from "../lib/socket-handler";

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
  tableId?: string,
  status?: OrderStatus,
  paymentStatus?: string,
  fromDate?: string,
  toDate?: string
) => {
  const whereCondition: OrderWhereInput = {};
  if (tableId) {
    whereCondition.table_id = tableId;
  }
  if (status) {
    whereCondition.status = status;
  }
  if (paymentStatus !== undefined) {
    whereCondition.payment_status = paymentStatus === "true";
  }

  if (fromDate || toDate) {
    whereCondition.created_at = {};
    if (fromDate) {
      whereCondition.created_at.gte = new Date(fromDate);
    }
    if (toDate) {
      whereCondition.created_at.lte = new Date(toDate);
    }
  }

  return await repository.findAllOrder(whereCondition);
};

export const getOrderById = async (id: string) => {
  const order = await repository.findOrderById(id);
  if (!order) {
    throw new ApiError("Pesanan tidak ditemukan", 404);
  }
  return order;
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
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
  emitOrderStatusChange(updatedOrder);
};
