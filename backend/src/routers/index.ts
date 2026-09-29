import { Router } from "express";
import authRoutes from "./auth.routes.js";
import cheatsheetRoutes from "./cheatsheet.routes.js";
import oauthRoutes from "./oauth.routes.js";
import searchRoutes from "./search.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true });
});
router.use("/auth", authRoutes); // admin (password)
router.use("/oauth", oauthRoutes); // community sign-in
router.use("/user", userRoutes); // community member session
router.use("/cheatsheets", cheatsheetRoutes);
router.use("/search", searchRoutes);

export default router;
