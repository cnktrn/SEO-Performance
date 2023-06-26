import express from "express";
import { metricMean_bucket} from "../controllers/queries.js";
import { metricOverall_page_time } from "../controllers/queries.js";
import { metricMean_page_time } from "../controllers/queries.js";
import { metricMean_pages_bucket } from "../controllers/queries.js";
import { available_events } from "../controllers/queries.js";
import { available_subpages } from "../controllers/queries.js";
import { metricSum_bucket_time } from "../controllers/queries.js";

const router = express.Router();

router.get("/mmB", metricMean_bucket);
router.get("/mopT", metricOverall_page_time);
router.get("/mmpT", metricMean_page_time);
router.get("/mmpB", metricMean_pages_bucket);
router.get("/aE", available_events);
router.get("/aS", available_subpages);
router.get("/msbT", metricSum_bucket_time);

export default router;
