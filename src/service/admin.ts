import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../lib/utils";
import * as service from "../repository/admin";

export const login = async (username: string, password: string) => {
  if (!username || !password) {
    throw new ApiError("Username dan password harus diisi", 400);
  }

  const admin = await service.findOneAdmin(username);
  if (!admin) {
    throw new ApiError("Admin tidak ditemukan", 404);
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    throw new ApiError("Username atau password salah", 401);
  }

  const payload = {
    id: admin.id,
    username: admin.username,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "3d",
  });

  return {
    ...payload,
    token,
  };
};
