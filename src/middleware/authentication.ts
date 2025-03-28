import type { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import type { AdminRequest, AuthenticationPayload } from "../../types";
import { ApiError } from "../lib/utils";
import { findOneAdmin } from "../repository/admin";

export const authentication = async (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token = req.cookies.token;
    if (!token) {
      const authHeader = req.headers["authorization"];
      token = authHeader && authHeader.split(" ")[1];
    }

    if (!token) {
      throw new ApiError("Unauthorized", 401);
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as AuthenticationPayload;

    const admin = await findOneAdmin(payload.username);
    if (!admin) {
      throw new ApiError("Unauthorized", 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(new ApiError(error.message, error.statusCode));
    } else {
      next(new ApiError("Internal server error", 500));
    }
  }
};
