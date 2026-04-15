import bcrypt from "bcrypt";

import { envVariables } from "../config/env";
import { UserRole } from "../interfaces/userRole";
import { prisma } from "../config/prisma";

const seedPlatformAdmin = async () => {
  try {
    const isPlatformAdminExist = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (isPlatformAdminExist) {
      console.log("Admin already exists!");
      return;
    }

    const hashedPassword = await bcrypt.hash(
      envVariables.ADMIN_PASSWORD as string,
      Number(envVariables.BCRYPT_SALT_ROUND) || 10,
    );

    const platformAdmin = await prisma.user.create({
      data: {
        name: envVariables.ADMIN_NAME as string,
        email: envVariables.ADMIN_EMAIL as string,
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    console.log("Platform Admin Created Successfully!", platformAdmin);
  } catch (err) {
    console.error("Error seeding Platform Admin:", err);
  } finally {
    await prisma.$disconnect();
  }
};

export default seedPlatformAdmin;
