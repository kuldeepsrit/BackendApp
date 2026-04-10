import express from "express";
import type { Request, Response, NextFunction } from "express";
import "dotenv/config";
import cors from "cors";

import transactionRoutes from "./routes/transaction.routes";
import authRoutes from "./routes/auth.routes";
import router from "./routes/dashboard.routes";

import { Env } from "./config/env.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import connectDatabase from "./config/database.config";

const app = express();

const BASE_PATH = Env.BASE_PATH || "/api";

// ✅ Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

// ✅ Routes
app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/dashboard`, router);

app.use(`${BASE_PATH}/transactions`, transactionRoutes);


// ✅ API Root
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    endpoints: {
      auth: "/api/auth",
      transactions: "/api/transactions"
    }
  });
});

// ✅ Health Check
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Hello from my side"
    });
  })
);

// ✅ Error Handler
app.use(errorHandler);

// ✅ Start Server
const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(Env.PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${Env.PORT}${BASE_PATH}`
      );
    });

  } catch (error) {
    console.error("Database connection failed ❌", error);
    process.exit(1);
  }
};

startServer();