import { Router } from "express";
import { authentication } from "../middleware/authentication";
import {
  addMenu,
  deleteMenu,
  getAllCategories,
  getAllMenu,
  getMenuById,
  updateMenu,
} from "../controller/menu";
import { upload } from "../middleware/upload-file";

const router: Router = Router();

router.post("/", authentication, upload.single("image"), addMenu);
router.get("/", getAllMenu);
router.get("/categories", getAllCategories);
router.get("/:id", getMenuById);
router.patch("/:id", authentication, upload.single("image"), updateMenu);
router.delete("/:id", authentication, deleteMenu);

const menuRouter = router;
export { menuRouter };
