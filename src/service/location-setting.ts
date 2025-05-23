import { ApiError } from "../lib/utils";
import * as repository from "../repository/location-setting";

export const getLocationSetting = async () => {
  return await repository.findLocationSetting();
};

export const updateLocationSetting = async (
  latitude: number,
  longitude: number,
  radius: number,
  status: "ACTIVE" | "INACTIVE"
) => {
  const locationSetting = await repository.findLocationSetting();
  if (!locationSetting) {
    throw new ApiError("Location setting tidak ditemukan", 404);
  }
  if (status === "ACTIVE") {
    if (!latitude || !longitude || !radius) {
      throw new ApiError("Semua field harus diisi", 400);
    }
  }

  await repository.updateLocationSetting(
    locationSetting.id,
    latitude,
    longitude,
    radius,
    status === "ACTIVE" ? true : false
  );
};
