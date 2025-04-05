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
  adminId: string,
  clientUrl: string
) => {
  const table = await prisma.table.create({
    data: {
      number: tableNumber,
      qr_code: "",
      admin_id: adminId,
    },
  });

  await prisma.table.update({
    where: {
      id: table.id,
    },
    data: {
      qr_code: `${clientUrl}${table.id}`,
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

export const updateTable = async (id: string, number: number) => {
  await prisma.table.update({
    where: {
      id,
    },
    data: {
      number,
    },
  });
};
