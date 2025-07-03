import { Router } from "express";
import { authentication } from "../middleware/authentication";
import {
  createTable,
  deleteTable,
  getAllTable,
  getTableById,
  updateTable,
} from "../controller/table";

const router: Router = Router();

router.post("/", authentication, createTable);
router.get("/", getAllTable);
router.get("/:id", getTableById);
router.delete("/:id", authentication, deleteTable);
router.patch("/:id", authentication, updateTable);

const tableRouter = router;
export { tableRouter };
