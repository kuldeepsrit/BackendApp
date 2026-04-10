import { Request, Response, NextFunction } from "express";
import { Transaction } from "../models/transaction.model";
import { HTTPSTATUS } from "../config/http.config";


// SUMMARY
export const getDashboardSummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [income, expense] = await Promise.all([
      Transaction.aggregate([
        { $match: { type: "income" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]),
      Transaction.aggregate([
        { $match: { type: "expense" } },
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    const totalIncome = income[0]?.total || 0;
    const totalExpense = expense[0]?.total || 0;

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        netBalance: totalIncome - totalExpense
      }
    });

  } catch (error) {
    next(error);
  }
};


// CATEGORY
export const getCategorySummary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Transaction.aggregate([
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } }
    ]);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};


// RECENT
export const getRecentTransactions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Transaction.find().sort({ date: -1 }).limit(5);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};


// MONTHLY
export const getMonthlyTrends = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" }
          },
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
            }
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0]
            }
          }
        }
      }
    ]);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      data
    });

  } catch (error) {
    next(error);
  }
};