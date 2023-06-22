import express from "express";
import {getKPIs, createKPI, getKPI} from "../controllers/kpis.js";

const router = express.Router();

router.get("/getKPIs", getKPIs);
router.post("/createKPI", createKPI);
router.get("/getKPI", getKPI);

export default router;