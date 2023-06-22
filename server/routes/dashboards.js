import express from "express";
import {getDashboards, createDashboard, getDashboard, updateDashboard, deleteDashboard} from "../controllers/dashboards.js";

const router = express.Router();

router.get("/getDashboards", getDashboards);
router.post("/createDashboard", createDashboard);
router.get("/:id", getDashboard);
router.put("/:id", updateDashboard);
router.delete("/:id", deleteDashboard);

export default router;