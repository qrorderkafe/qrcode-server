import type { Admin, OrderStatus } from "@prisma/client";
import { Request } from "express";
import { Prisma } from "@prisma/client";

interface AdminRequest extends Request {
  admin?: {
    id: string;
    username: string;
  };
}

interface AuthenticationPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

type MenuWhereInput = {
  AND?: Array<{
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
  AND?: Array<{
    OR?: Array<{
      customer_name?: {
        contains: string;
        mode: "insensitive";
      };
      table?: {
        number: {
          equals: number;
        };
      };
    }>;
    status?: {
      equals?: OrderStatus;
    };
    tableId?: string;
    created_at?: {
      gte?: Date;
      lte?: Date;
    };
  }>;
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

type ReportWhereInput = {
  AND?: Array<{
    created_at?: {
      gte?: Date;
      lte?: Date;
    };
  }>;
};
