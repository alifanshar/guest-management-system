import { z } from "zod";

// Schema untuk register
export const registerSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z // Password minimal ada huruf besar, huruf kecil dan angka
    .string()
    .min(8)
    .regex(/[A-Z]/, "Must contain uppercase letter")
    .regex(/[0-9]/, "Must contain number"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
