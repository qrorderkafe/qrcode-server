import bcrypt from "bcryptjs";
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

async function createCategories() {
  console.log("Seeding categories...");

  const categories = ["minuman", "makanan", "seafood"];

  const admin = await prisma.admin.findFirst();

  if (!admin) {
    throw new Error("Admin not found");
  }

  for (const category of categories) {
    await prisma.category.create({
      data: {
        name: category,
        admin_id: admin.id,
      },
    });
  }

  console.log("Categories seeded successfully!");
}

async function createLocationSetting() {
  const locationSetting = await prisma.locationSetting.findFirst();

  await prisma.locationSetting.upsert({
    where: {
      id: locationSetting?.id || "",
    },
    update: {
      latitude: 0,
      longitude: 0,
      radius: 0,
      isActive: false,
    },
    create: {
      latitude: 0,
      longitude: 0,
      radius: 0,
      isActive: false,
    },
  });
  console.log("Location setting seeded successfully!");
}

async function main() {
  // await createAdmin();
  // await createCategories();
  await createLocationSetting();
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
