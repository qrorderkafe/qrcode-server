import { Router } from "express";
import { getAdminById, login } from "../controller/admin";
import { authentication } from "../middleware/authentication";

const router: Router = Router();

router.post("/login", login);
router.get("/me", authentication, getAdminById);

const adminrouter = router;
export { adminrouter };
