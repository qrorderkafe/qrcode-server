import { prisma } from "../db";

export const findLocationSetting = async () => {
  return await prisma.locationSetting.findFirst();
};

export const updateLocationSetting = async (
  id: string,
  latitude: number,
  longitude: number,
  radius: number,
  status: boolean
) => {
  await prisma.locationSetting.update({
    where: {
      id,
    },
    data: {
      latitude,
      longitude,
      radius,
      isActive: status,
    },
  });
};
