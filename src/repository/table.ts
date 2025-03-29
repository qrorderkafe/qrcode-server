import { prisma } from "../db";

export const tableCount = async (tableNumber?: number, qrCodeUrl?: string) => {
  return await prisma.table.count({
    where: {
      OR: [
        {
          number: tableNumber,
        },
        {
          qr_code: qrCodeUrl,
        },
      ],
    },
  });
};

export const createTable = async (
  tableNumber: number,
  qrCodeUrl: string,
  adminId: string
) => {
  await prisma.table.create({
    data: {
      number: tableNumber,
      qr_code: qrCodeUrl,
      admin_id: adminId,
    },
  });
};

export const findAllTable = async () => {
  return await prisma.table.findMany();
};

export const findTableById = async (id: string) => {
  return await prisma.table.findUnique({
    where: {
      id,
    },
  });
};

export const deleteTable = async (id: string) => {
  await prisma.table.delete({
    where: {
      id,
    },
  });
};

export const updateTable = async (
  id: string,
  qrCodeUrl: string,
  number: number
) => {
  await prisma.table.update({
    where: {
      id,
    },
    data: {
      qr_code: qrCodeUrl,
      number,
    },
  });
};
