import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { Env } from "../config/env.config";
import { UnauthorizedException } from "../utils/app-error";
import { User } from "../models/user.model";

// ✅ Extend Request type
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // ✅ Check header exists
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header missing");
    }

    // ✅ Check Bearer format
    if (!authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("Invalid token format");
    }

    // ✅ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedException("Token not provided");
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, Env.JWT_SECRET) as {
      id: string;
      role: string;
    };

    // ✅ Check user exists in DB
    const user = await User.findById(decoded.id).select("_id role isActive");

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // ✅ Check active user
    if (!user.isActive) {
      throw new UnauthorizedException("User is deactivated");
    }

    // ✅ Attach to request
    req.user = {
      id: user._id.toString(),
      role: user.role
    };

    next();

  } catch (error) {
    // ✅ Handle JWT errors properly
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedException("Invalid token"));
    }

    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedException("Token expired"));
    }

    next(error);
  }
};