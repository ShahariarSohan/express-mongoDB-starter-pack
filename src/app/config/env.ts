import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

dotenv.config({ path: path.join(process.cwd(), ".env") });
interface EnvConfig {
  PORT: string;
  NODE_ENV: string;
  DATABASE_URL: string;
  ADMIN_NAME: string;
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD: string;
  BCRYPT_SALT_ROUND: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  FRONTEND_URL: string;
}

const loadEnvVariables = (): EnvConfig => {
  const requiredVariables: string[] = [
    "DATABASE_URL",
    "ADMIN_EMAIL",
    "ADMIN_NAME",
    "ADMIN_PASSWORD",
    "BCRYPT_SALT_ROUND",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "FRONTEND_URL",
  ];
  requiredVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing env variables ${key}`);
    }
  });

  return {
    PORT: (process.env.PORT as string) || "5000",
    NODE_ENV: process.env.NODE_ENV as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    ADMIN_NAME: process.env.ADMIN_NAME as string,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN as string,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
  };
};

export const envVariables = loadEnvVariables();
