import bcrypt, { hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../lib/utils";
import * as repository from "../repository/admin";

export const login = async (username: string, password: string) => {
  if (!username || !password) {
    throw new ApiError("Username dan password harus diisi", 400);
  }

  const admin = await repository.findOneAdminByUsername(username);
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

export const getAdminById = async (id: string) => {
  const admin = await repository.findOneAdminById(id);
  if (!admin) {
    throw new ApiError("Admin tidak ditemukan", 404);
  }
  return admin;
};

export const updateAdmin = async (
  id: string,
  username: string,
  password: string
) => {
  if (!username) {
    throw new ApiError("Username harus diisi", 400);
  }

  if (/\s/.test(username)) {
    throw new ApiError("Username tidak boleh mengandung spasi", 400);
  }

  const existingAdmin = await repository.findOneAdminByUsername(username);
  if (existingAdmin && existingAdmin.id !== id) {
    throw new ApiError("Username sudah digunakan oleh admin lain", 400);
  }

  if (password) {
    const hashPassword = await hash(password, 10);
    await repository.updateAdmin(id, { username, password: hashPassword });
  } else {
    await repository.updateAdmin(id, { username });
  }
};
