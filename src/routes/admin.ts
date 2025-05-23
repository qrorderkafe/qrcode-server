import { Router } from "express";
import { getAdminById, login, logout, updateAdmin } from "../controller/admin";
import { authentication } from "../middleware/authentication";

const router: Router = Router();

router.post("/login", login);
router.get("/me", authentication, getAdminById);
router.patch("/", authentication, updateAdmin);
router.delete("/logout", authentication, logout);

const adminrouter = router;
export { adminrouter };
