import { Router } from "express";
import { authentication } from "../middleware/authentication";
import { getAllReports } from "../controller/report";

const router: Router = Router();

router.get("/", getAllReports);

const reportRouter = router;
export { reportRouter };
