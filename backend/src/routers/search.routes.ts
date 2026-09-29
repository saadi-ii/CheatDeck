import { Router } from "express";
import { search } from "../controller/search/index.js";

const router = Router();

router.get("/", search);

export default router;
