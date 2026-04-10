import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model";
import { HTTPSTATUS } from "../config/http.config";
import { Env } from "../config/env.config";

import {
  BadRequestException,
  UnauthorizedException
} from "../utils/app-error";


// ✅ REGISTER
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Required fields
    if (!name || !email || !password) {
      throw new BadRequestException("All fields are required");
    }

    // ✅ Role validation
    if (role && !["admin", "viewer", "analyst"].includes(role)) {
      throw new BadRequestException("Invalid role");
    }

    // ✅ Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "viewer"
    });

    return res.status(HTTPSTATUS.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    next(error);
  }
};


// ✅ LOGIN
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      throw new BadRequestException("Email and password required");
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // ✅ Check active status

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      Env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (error) {
    next(error);
  }
};

