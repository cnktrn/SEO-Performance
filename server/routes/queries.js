import express from "express";
import { metricMean_bucket} from "../controllers/queries.js";

const router = express.Router();

router.get("/mmB", metricMean_bucket);

export default router;
