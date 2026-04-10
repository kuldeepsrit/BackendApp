import express from "express";

import {
  getDashboardSummary,
  getCategorySummary,
  getRecentTransactions,
  getMonthlyTrends
} from "../controllers/dashboard.controller";

import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";

const router = express.Router();
console.log("protect:", protect);
console.log("authorize:", authorize);
console.log("summary:", getDashboardSummary);
console.log("summary:", getCategorySummary);
console.log("summary:", getRecentTransactions);
console.log("summary:", getMonthlyTrends);

router.get("/summary", protect, authorize("admin", "analyst", "viewer"), getDashboardSummary);
router.get("/category-summary", protect, authorize("admin", "analyst"), getCategorySummary);
router.get("/recent", protect, authorize("admin", "analyst"), getRecentTransactions);
router.get("/monthly-trends", protect, authorize("admin", "analyst"), getMonthlyTrends);

export default router;

