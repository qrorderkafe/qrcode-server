import { ApiError } from "../lib/utils";
import * as repository from "../repository/table";

export const createTable = async (
  qrCodeUrl: string,
  tableNumber: number,
  adminId: string
) => {
  const tableCount = await repository.tableCount(tableNumber);
  if (tableCount > 0) {
    throw new ApiError("Meja sudah ada", 400);
  }
  await repository.createTable(tableNumber, qrCodeUrl, adminId);
};

export const getAllTable = async () => {
  return await repository.findAllTable();
};

export const getTableById = async (id: string) => {
  const table = await repository.findTableById(id);
  if (!table) {
    throw new ApiError("Meja tidak ditemukan", 404);
  }
  return table;
};

export const deleteTable = async (id: string) => {
  const table = await repository.findTableById(id);
  if (!table) {
    throw new ApiError("Meja tidak ditemukan", 404);
  }
  await repository.deleteTable(id);
};

export const updateTable = async (
  id: string,
  qrCodeUrl: string,
  tableNumber: number
) => {
  const table = await repository.findTableById(id);
  if (!table) {
    throw new ApiError("Meja tidak ditemukan", 404);
  }

  if (tableNumber && tableNumber !== table.number) {
    const tableCount = await repository.tableCount(tableNumber);
    if (tableCount > 0) {
      throw new ApiError("Meja sudah ada", 400);
    }
  }

  if (qrCodeUrl && qrCodeUrl !== table.qr_code) {
    const tableCount = await repository.tableCount(undefined, qrCodeUrl);
    if (tableCount > 0) {
      throw new ApiError("QR Code sudah ada", 400);
    }
  }

  if (qrCodeUrl) {
    table.qr_code = qrCodeUrl;
  }

  if (tableNumber) {
    table.number = tableNumber;
  }

  await repository.updateTable(id, table.qr_code, table.number);
};
