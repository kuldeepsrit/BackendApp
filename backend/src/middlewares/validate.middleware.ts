import { Request, Response, NextFunction } from "express";

export const validateTransaction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount, type, category, date } = req.body;

  if (!amount || !type || !category || !date) {
    return res.status(400).json({ message: "All fields required" });
  }

  if (typeof amount !== "number" || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount" });
  }

  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({ message: "Invalid type" });
  }

  next();
};