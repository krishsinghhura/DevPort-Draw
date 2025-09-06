import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";

export function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    if (!decoded || typeof decoded === "string") return null;
    return decoded.userId;
  } catch {
    return null;
  }
}
