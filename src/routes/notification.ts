import express from "express";
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controller/notificaation";
import { authentication } from "../middleware/authentication";

const router = express.Router();

router.get("/", authentication, getNotifications);
router.patch("/:notificationId/read", authentication, markAsRead);
router.patch("/read-all", authentication, markAllAsRead);

export const notificationRouter = router;
