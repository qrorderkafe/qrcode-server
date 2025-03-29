import { Router } from "express";
import { authentication } from "../middleware/authentication";
import {
  addMenu,
  deleteMenu,
  getAllMenu,
  getMenuById,
  updateMenu,
  updateMenuStatus,
} from "../controller/menu";
import { upload } from "../middleware/upload-file";

const router: Router = Router();

router.post("/", authentication, upload.single("image"), addMenu);
router.get("/", getAllMenu);
router.get("/:id", getMenuById);
router.patch("/:id", authentication, upload.single("image"), updateMenu);
router.patch("/:id/status", authentication, updateMenuStatus);
router.delete("/:id", authentication, deleteMenu);

const menuRouter = router;
export { menuRouter };
