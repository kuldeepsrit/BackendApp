// import express from "express";

// import {
//   createTransaction,
//   getTransactions,
//   updateTransaction,
//   deleteTransaction, getDashboardSummary,
//   getCategorySummary,
//   getRecentTransactions,
//   getMonthlyTrends
// } from "../controllers/transaction.controller";

// import { protect } from "../middlewares/auth.middleware";
// import { authorize } from "../middlewares/role.middleware";

// import { validateTransaction } from "../middlewares/validate.middleware";

// const router = express.Router();



// router.post("/", validateTransaction, createTransaction);
// router.get("/", getTransactions);
// router.put("/:id", validateTransaction, updateTransaction);
// router.delete("/:id", deleteTransaction);

// // these  routes   for  dashboard  summary  : 

// router.get("/summary", getDashboardSummary);
// router.get("/category-summary", getCategorySummary);
// router.get("/recent", getRecentTransactions);
// router.get("/monthly-trends", getMonthlyTrends);



// //  admin , viewer  , analyst rule;  

// router.post("/", protect, authorize("admin"), createTransaction);

// router.get("/", protect, authorize("admin", "analyst"), getTransactions);

// router.get("/summary", protect, authorize("viewer", "analyst", "admin"), getDashboardSummary);


// export default router;

import express from "express";

import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
 
} from "../controllers/transaction.controller";

import { protect } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/role.middleware";
import { validateTransaction } from "../middlewares/validate.middleware";

const router = express.Router();


// 🔐 TRANSACTION CRUD (Role-based)

// Create → Admin only
router.post("/", protect, authorize("admin"), validateTransaction, createTransaction);

// Get → Admin + Analyst
router.get("/", protect, authorize("admin", "analyst"), getTransactions);

// Update → Admin only
router.put("/:id", protect, authorize("admin"), validateTransaction, updateTransaction);

// Delete → Admin only
router.delete("/:id", protect, authorize("admin"), deleteTransaction);


// // 📊 DASHBOARD ROUTES

// // Summary → All roles
// router.get("/summary", protect, authorize("viewer", "analyst", "admin"), getDashboardSummary);

// // Category → Analyst + Admin
// router.get("/category-summary", protect, authorize("analyst", "admin"), getCategorySummary);

// // Recent → Analyst + Admin
// router.get("/recent", protect, authorize("analyst", "admin"), getRecentTransactions);

// // Monthly → Analyst + Admin
// router.get("/monthly-trends", protect, authorize("analyst", "admin"), getMonthlyTrends);


export default router;