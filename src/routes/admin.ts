import { Router } from "express";
import { login } from "../controller/admin";

const router: Router = Router();

router.post("/login", login);

const adminrouter = router;
export { adminrouter };
