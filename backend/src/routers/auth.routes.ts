import { Router } from "express";
import { login, logout, me } from "../controller/auth/index.js";
import { loginLimiter } from "../middleware/loginLimiter.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validate } from "../middleware/validate.js";
import { loginSchema } from "../validation/auth.schema.js";

const router = Router();

router.post("/login", loginLimiter, validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", requireAdmin, me);

export default router;
