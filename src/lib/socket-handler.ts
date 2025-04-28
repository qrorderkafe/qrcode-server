import type { Notification } from "@prisma/client";
import { Server } from "socket.io";
import type { NotificationWithOrderDetail } from "../../types";

let io: Server;

const ADMIN_ROOM = "all-admins";

export const initSocketIO = (socketIO: Server) => {
  io = socketIO;
  console.log("Socket.IO initialized");
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }
  return io;
};

export const emitNewOrder = (notification: NotificationWithOrderDetail) => {
  getIO()
    .to(ADMIN_ROOM)
    .emit("new-order", {
      type: "NEW_ORDER",
      message: `Pesanan baru dari meja ${notification.order?.table.number}`,
      data: notification,
    });
};

export const emitOrderStatusChange = (order: any) => {
  getIO()
    .to(ADMIN_ROOM)
    .emit("order-status-change", {
      type: "ORDER_STATUS_CHANGE",
      message: `Status pesanan dari meja ${order.table.number} berubah menjadi ${order.status}`,
      data: order,
    });
};

export const emitPaymentReceived = (order: any) => {
  getIO()
    .to(ADMIN_ROOM)
    .emit("payment-received", {
      type: "PAYMENT_RECEIVED",
      message: `Pembayaran diterima untuk pesanan dari meja ${order.table.number}`,
      data: order,
    });
};
