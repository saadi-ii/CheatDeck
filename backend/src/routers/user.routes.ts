import { Router } from "express";
import { ban, logout, me } from "../controller/user/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireUser } from "../middleware/requireUser.js";
import { validate } from "../middleware/validate.js";
import { banSchema } from "../validation/user.schema.js";

const router = Router();

router.get("/me", requireUser, me);
router.post("/logout", logout);
router.post("/:id/ban", requireAdmin, validate(banSchema), ban);

export default router;
