import { Router } from "express";
import { authentication } from "../middleware/authentication";
import {
  getLocationSetting,
  updateLocationSetting,
} from "../controller/location-setting";

const router: Router = Router();

router.get("/", authentication, getLocationSetting);
router.patch("/", authentication, updateLocationSetting);

const locationSettingRouter = router;
export { locationSettingRouter };
