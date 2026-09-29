import { Router } from "express";
import { accept, create, list, mine, reject } from "../controller/suggestion/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { requireUser } from "../middleware/requireUser.js";
import { validate } from "../middleware/validate.js";
import { createSuggestionSchema, reviewSchema } from "../validation/suggestion.schema.js";

const router = Router();

// Community members
router.post("/", requireUser, validate(createSuggestionSchema), create);
router.get("/mine", requireUser, mine); // must come before anything with a :param

// Admin review
router.get("/", requireAdmin, list);
router.post("/:id/accept", requireAdmin, validate(reviewSchema), accept);
router.post("/:id/reject", requireAdmin, validate(reviewSchema), reject);

export default router;
