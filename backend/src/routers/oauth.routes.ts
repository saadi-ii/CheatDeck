import { Router } from "express";
import { callback, providers, start } from "../controller/oauth/index.js";

const router = Router();

// "/providers" must come before "/:provider".
router.get("/providers", providers);
router.get("/:provider", start);
router.get("/:provider/callback", callback);

export default router;
