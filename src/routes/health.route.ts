import { Router } from "express";
import { handleHealth } from "../controller/health.controller.js";

const router = Router();

router.get("", handleHealth);

export default router;
