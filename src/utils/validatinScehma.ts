import z from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(8).max(20),
});

export const loginSchema = z.object({
  username: z.string().min(3).max(10),
  password: z.string().min(8).max(20),
});

export const contentSchema = z.object({
  title: z.string(),
  link: z.string().url(),
  types: z.string(),
  tag: z.string().nullable().optional(),
});
