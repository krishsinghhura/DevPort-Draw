import { SignupSchema, SigninSchema } from "@repo/common/zodTypes";
import { prismaClient } from "../config/prisma";
import bcrypt from "bcrypt-ts";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/servers-common/config";
import { Request, Response } from "express";

export async function signup(req: Request, res: Response) {
  if (!req.body) return res.status(400).json("No valid inputs");

  const parsed = SignupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Incorrect Inputs" });

  const hashedPassword = bcrypt.hashSync(parsed.data.password, 10);
  try {
    const user = await prismaClient.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: hashedPassword,
      },
    });
    res.json({ user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function signin(req: Request, res: Response) {
  if (!req.body) return res.status(400).json("No valid inputs");

  const parsed = SigninSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ message: "Incorrect Inputs" });

  try {
    const user = await prismaClient.user.findUnique({
      where: { email: parsed.data.email },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(parsed.data.password, user.password);
    if (!valid) return res.status(401).json({ message: "Wrong Password" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET);
    res.json({ token });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
