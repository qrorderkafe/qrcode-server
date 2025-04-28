import { ApiError } from "../lib/utils";
import * as repository from "../repository/table";

export const createTable = async (tableNumber: number, adminId: string) => {
  if (!tableNumber) {
    throw new ApiError("Nomor meja tidak boleh kosong", 400);
  }
  const tableCount = await repository.tableCount(tableNumber);
  if (tableCount > 0) {
    throw new ApiError("Meja sudah ada", 400);
  }

  const clientDomain = `${
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : `https://${process.env.CLIENT_DOMAIN}`
  }/menu?table=`;
  await repository.createTable(tableNumber, adminId, clientDomain);
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

export const updateTable = async (id: string, tableNumber: number) => {
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

  if (tableNumber) {
    table.number = tableNumber;
  }

  await repository.updateTable(id, table.number);
};
