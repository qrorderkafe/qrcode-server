import type { Admin } from "@prisma/client";
import { Request } from "express";

interface AdminRequest extends Request {
  admin?: Admin;
}

interface AuthenticationPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}
