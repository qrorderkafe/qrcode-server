import type { Admin, OrderStatus } from "@prisma/client";
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

interface OrderItem {
  menuId: string;
  quantity: number;
  note?: string;
}

interface CreateOrderDTO {
  customerName?: string;
  note?: string;
  tableId: string;
  items: OrderItem[];
}

type OrderWhereInput = {
  table_id?: string;
  status?: OrderStatus;
  payment_status?: boolean;
  created_at?: {
    gte?: Date;
    lte?: Date;
  };
};
