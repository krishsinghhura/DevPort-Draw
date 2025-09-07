import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";

export interface AuthRequest extends Request {
  userId?: string;
}

export function middleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];  

  if (!authHeader) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  const decoded = jwt.verify(token, JWT_SECRET);

  if (typeof decoded == "string") {
    return;
  }

  if (decoded) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({ message: "Unauthozied" });
  }
}
