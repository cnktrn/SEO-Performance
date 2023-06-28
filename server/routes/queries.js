import express from "express";
import { metricMean_bucket, metricOverall_page_time_sum, get_top_keywords_for_metric_per_subpage, get_top_keywords_for_metric_all_subpages} from "../controllers/queries.js";
import { metricOverall_page_time } from "../controllers/queries.js";
import { metricMean_page_time } from "../controllers/queries.js";
import { metricMean_pages_bucket } from "../controllers/queries.js";
import { available_events } from "../controllers/queries.js";
import { available_subpages } from "../controllers/queries.js";
import { get } from "http";


const router = express.Router();

router.get("/mmB", metricMean_bucket);
router.get("/mopT", metricOverall_page_time);
router.get("/mmpT", metricMean_page_time);
router.get("/mmpB", metricMean_pages_bucket);
router.get("/aE", available_events);
router.get("/aS", available_subpages);
router.get("/moptS", metricOverall_page_time_sum);
router.get( "/gtkfmpS", get_top_keywords_for_metric_per_subpage)
router.get( "/gtkfmaS", get_top_keywords_for_metric_all_subpages)

export default router;