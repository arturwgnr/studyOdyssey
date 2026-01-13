import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function userLogin({ email, password }) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    throw new Error("USER_NOT_FOUND");
  }

  const userId = existingUser.id;

  const comparePassword = await bcrypt.compare(password, existingUser.password);

  if (!comparePassword) {
    throw new Error("WRONG_PASSWORD");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  return token;
}

export async function userRegister({ email, name, password }) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: { email, name, password: hashPassword },
  });

  return newUser;
}
