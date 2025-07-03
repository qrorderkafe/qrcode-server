import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { getStats, getWeeklySales } from "../controller/stats";

const router: Router = Router();

router.get("/", getStats);
router.get("/weekly-sales", getWeeklySales);

const statsRouter = router;
export { statsRouter };
