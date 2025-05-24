import { Router } from "express";
import { validateLocation } from "../middleware/validate-location";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} from "../controller/order";
import { authentication } from "../middleware/authentication";
import { rateLimiter } from "../middleware/rate-limiter";

const router: Router = Router();

router.post("/", rateLimiter, validateLocation, createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", authentication, updateOrderStatus);

const orderRouter = router;
export { orderRouter };
