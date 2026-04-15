import { z } from "zod";

export const createUserZodSchema = z.object({
  name: z.string({ error: "Full name is required" }),
  email: z.email("Invalid email format"),
  password: z
    .string({ error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
  role: z
    .enum(["STUDENT", "VENDOR", "LANDLORD", "EVENT_ORGANISER", "SERVICE_PROVIDER", "ADMIN"])
    .default("STUDENT"),
  phone: z.string().optional(),
  showPhoneToPublic: z.boolean().default(false),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  bio: z.string().optional(),

  isStudent: z.boolean().default(false),
  country: z.string().optional(),
  city: z.string().optional(),
  institutionId: z.string().optional(),
  institutionName: z.string().optional(),
  campus: z.string().optional(),
  
  location: z
    .object({
      latitude: z.number(),
      longitude: z.number(),
    })
    .optional(),

  academicDetails: z
    .object({
      course: z.string().optional(),
      yearOfStudy: z.string().optional(),
      studentIdNumber: z.string().optional(),
    })
    .optional(),

  businessDetails: z
    .object({
      businessName: z.string().optional(),
      businessType: z.string().optional(),
      businessAddress: z.string().optional(),
      businessPhone: z.string().optional(),
      businessWebsite: z.string().optional(),
      businessRegistration: z.string().optional(),
    })
    .optional(),
});

export const updateUserZodSchema = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  showPhoneToPublic: z.boolean().optional(),
  profileImage: z.string().optional(),
  coverImage: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  institutionId: z.string().optional(),
  institutionName: z.string().optional(),
  campus: z.string().optional(),
  
  location: z
    .object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),

  academicDetails: z
    .object({
      course: z.string().optional(),
      yearOfStudy: z.string().optional(),
      studentIdNumber: z.string().optional(),
    })
    .optional(),

  businessDetails: z
    .object({
      businessName: z.string().optional(),
      businessType: z.string().optional(),
      businessAddress: z.string().optional(),
      businessPhone: z.string().optional(),
      businessWebsite: z.string().optional(),
      businessRegistration: z.string().optional(),
    })
    .optional(),

  socialLinks: z
    .object({
      instagram: z.string().optional(),
      twitter: z.string().optional(),
      tiktok: z.string().optional(),
      facebook: z.string().optional(),
      linkedin: z.string().optional(),
      whatsapp: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),

  privacySettings: z
    .object({
      showEmail: z.boolean().optional(),
      showPrivacyPolicy: z.boolean().optional(),
      showPhoneNumber:z.boolean().optional(),
    })
    .optional(),
  
  subscriptionTier: z.enum(["FREE", "BASIC", "PREMIUM", "ENTERPRISE"]).optional(),
  followersCount: z.number().int().optional(),
  followingCount: z.number().int().optional(),
  responseTime: z.string().optional(),
  verified: z.boolean().optional(),
});
