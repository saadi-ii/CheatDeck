import { Router } from "express";
import { create, get, list, remove, update } from "../controller/cheatsheet/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { validate } from "../middleware/validate.js";
import { cheatsheetBodySchema } from "../validation/cheatsheet.schema.js";

const router = Router();

router.get("/", list);
router.get("/:slug", get);
router.post("/", requireAdmin, validate(cheatsheetBodySchema), create);
router.put("/:slug", requireAdmin, validate(cheatsheetBodySchema), update);
router.delete("/:slug", requireAdmin, remove);

export default router;
