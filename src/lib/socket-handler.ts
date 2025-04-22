import { Server } from "socket.io";

let io: Server;

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

export const emitNewOrder = (adminId: string, order: any) => {
  getIO()
    .to(`admin-${adminId}`)
    .emit("new-order", {
      type: "NEW_ORDER",
      message: `Pesanan baru dari meja ${order.table.number}`,
      data: order,
    });
};

export const emitOrderStatusChange = (adminId: string, order: any) => {
  getIO()
    .to(`admin-${adminId}`)
    .emit("order-status-change", {
      type: "ORDER_STATUS_CHANGE",
      message: `Status pesanan dari meja ${order.table.number} berubah menjadi ${order.status}`,
      data: order,
    });
};

export const emitPaymentReceived = (adminId: string, order: any) => {
  getIO()
    .to(`admin-${adminId}`)
    .emit("payment-received", {
      type: "PAYMENT_RECEIVED",
      message: `Pembayaran diterima untuk pesanan dari meja ${order.table.number}`,
      data: order,
    });
};
