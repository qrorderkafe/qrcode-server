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

type MenuWhereInput = {
  OR?: Array<{
    name?: {
      contains: string;
      mode: "insensitive";
    };
    category_id?: {
      equals: string;
    };
  }>;
  price?: {
    gte?: number;
    lte?: number;
  };
};
