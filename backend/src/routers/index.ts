import { Router } from "express";
import authRoutes from "./auth.routes.js";
import cheatsheetRoutes from "./cheatsheet.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});
router.use("/auth", authRoutes);
router.use("/cheatsheets", cheatsheetRoutes);

export default router;
