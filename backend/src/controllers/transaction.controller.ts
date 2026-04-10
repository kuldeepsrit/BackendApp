import { Request, Response, NextFunction } from "express";
import { Transaction } from "../models/transaction.model";
import { HTTPSTATUS } from "../config/http.config";
import { ErrorCodeEnum } from "../enums/error-code.enum";

import {
  BadRequestException,
  NotFoundException
} from "../utils/app-error";


// CREATE
export const createTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { amount, type, category, date, notes } = req.body;

    if (!amount || !type || !category || !date) {
      throw new BadRequestException(
        "All fields are required",
        ErrorCodeEnum.VALIDATION_ERROR
      );
    }

    if (typeof amount !== "number" || amount <= 0) {
      throw new BadRequestException(
        "Amount must be a positive number",
        ErrorCodeEnum.VALIDATION_ERROR
      );
    }

    if (!["income", "expense"].includes(type)) {
      throw new BadRequestException(
        "Type must be income or expense",
        ErrorCodeEnum.VALIDATION_ERROR
      );
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new BadRequestException(
        "Invalid date format",
        ErrorCodeEnum.VALIDATION_ERROR
      );
    }

    const data = await Transaction.create({
      amount,
      type,
      category,
      date: parsedDate,
      notes
    });

    return res.status(HTTPSTATUS.CREATED).json({
      success: true,
      message: "Transaction created successfully",
      data
    });

  } catch (error) {
    next(error);
  }
};


// GET (FILTER + PAGINATION)
export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      page = "1",
      limit = "10",
      sortBy = "date",
      order = "desc",
      search
    } = req.query;

    let filter: any = {};

    if (type) {
      if (!["income", "expense"].includes(type as string)) {
        throw new BadRequestException(
          "Invalid transaction type",
          ErrorCodeEnum.VALIDATION_ERROR
        );
      }
      filter.type = type;
    }

    if (category) filter.category = category;

    if (startDate && endDate) {
      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException(
          "Invalid date format",
          ErrorCodeEnum.VALIDATION_ERROR
        );
      }

      filter.date = { $gte: start, $lte: end };
    }

    if (search) {
      filter.$or = [
        { category: { $regex: search as string, $options: "i" } },
        { notes: { $regex: search as string, $options: "i" } }
      ];
    }

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);

    const skip = (pageNumber - 1) * limitNumber;

    const sortOptions: any = {
      [sortBy as string]: order === "asc" ? 1 : -1
    };

    const [data, total] = await Promise.all([
      Transaction.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNumber),
      Transaction.countDocuments(filter)
    ]);

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Transactions fetched successfully",
      data: {
        data,
        meta: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber)
        }
      }
    });

  } catch (error) {
    next(error);
  }
};


// UPDATE
export const updateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!data) {
      throw new NotFoundException(
        "Transaction not found",
        ErrorCodeEnum.RESOURCE_NOT_FOUND
      );
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Transaction updated successfully",
      data
    });

  } catch (error) {
    next(error);
  }
};


// DELETE
export const deleteTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Transaction.findByIdAndDelete(req.params.id);

    if (!data) {
      throw new NotFoundException(
        "Transaction not found",
        ErrorCodeEnum.RESOURCE_NOT_FOUND
      );
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Transaction deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};