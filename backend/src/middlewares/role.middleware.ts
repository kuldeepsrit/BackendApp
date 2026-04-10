import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../utils/app-error";

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!roles.includes(user.role)) {
      throw new UnauthorizedException("Access denied");
    }

    next();
  };
};