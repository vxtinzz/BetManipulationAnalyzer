import { z } from "zod"

const usernameSchema = z
  .string()
  .trim()
  .regex(
    /^(?=.{3,30}$)[a-z0-9]+([._]?[a-z0-9]+)*$/,
    "Invalid username"
  );

const cpfSchema = z
  .string()
  .trim()
  .regex(
    /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    "Invalid CPF"
  );

const passwordSchema = z
  .string()
  .min(6, "Password too short");

export const userCreateSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
  cpf: cpfSchema
});

export const userUpdateSchema = userCreateSchema.partial();

export const userDeleteSchema = z.object({
  password: passwordSchema
});

export const userLoginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema
});