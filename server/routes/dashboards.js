import express from "express";
import {getDashboards, createDashboard, getDashboard, updateDashboard} from "../controllers/dashboards.js";

const router = express.Router();

router.get("/getDashboards", getDashboards);
router.post("/createDashboard", createDashboard);
router.get("/:id", getDashboard);
router.put("/:id", updateDashboard);

export default router;