import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { prisma } from "../src/db";

dotenv.config();

async function createAdmin() {
  console.log("Seeding admin...");

  const defaultAdmin = {
    username: process.env.ADMIN_USERNAME!,
    password: process.env.ADMIN_PASSWORD!,
  };

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: defaultAdmin.username },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(defaultAdmin.password, 10);

    await prisma.admin.create({
      data: {
        username: defaultAdmin.username,
        password: hashedPassword,
      },
    });

    console.log("Admin seeded successfully!");
  } else {
    console.log("Admin already exists. Skipping seeding.");
  }
}

async function main() {
  await createAdmin();
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
