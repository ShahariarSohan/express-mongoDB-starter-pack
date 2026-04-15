import { z } from "zod";

export const loginZodSchema = z.object({
  email: z.string({ error: "Email is required" }),
  password: z
    .string({
      error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters"),
});


export const forgotPassword = z.object({
  email: z.string({ error: "Email is required" }).email({
    message: "Invalid email format!",
  }),
});

export const verifyOtp = z.object({
  email: z.email({ error: "Email is required" }).optional(),
  otp: z.number({ error: "OTP is required!" }),
});

export const changePassword = z.object({
  currentPassword: z.string({ error: "Password is required" }),
  newPassword: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});
