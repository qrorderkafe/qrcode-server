import type { Admin, OrderStatus } from "@prisma/client";
import { Request } from "express";
import { Prisma } from "@prisma/client";

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

type NotificationWithOrderDetail = Prisma.NotificationGetPayload<{
  include: {
    order: {
      include: {
        table: true;
        orderItems: {
          include: {
            menu: true;
          };
        };
      };
    };
  };
}>;

type NotificationWithOrder = Prisma.NotificationGetPayload<{
  include: {
    order: {
      include: {
        table: true;
      };
    };
  };
}>;

type OrderWithDetail = Prisma.OrderGetPayload<{
  include: {
    orderItems: {
      include: {
        menu: true;
      };
    };
    table: true;
  };
}>;
