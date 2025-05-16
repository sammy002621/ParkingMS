// seedBooks.ts

import { Client } from "pg";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
dotenv.config(); // Load environment variables

const prisma = new PrismaClient();

async function seedParkingSlots() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  const slotNumbers = Array.from({ length: 20 }, (_, i) => `A${100 + i}`); // e.g., A100, A101, ..., A119

  try {
    await client.connect();

    for (const number of slotNumbers) {
      const id = uuidv4();
      await client.query(
        `
          INSERT INTO parking_slots (id, number, "isOccupied", created_at, updated_at)
          VALUES ($1, $2, false, NOW(), NOW())
          ON CONFLICT (number) DO NOTHING
        `,
        [id, number]
      );
    }

    console.log("✅ Seeded parking slots successfully.");
  } catch (err) {
    console.error("❌ Error seeding parking slots:", err);
  } finally {
    await client.end();
  }
}

async function main() {
  const adminEmail = "admin@example.com";
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin already exists:", adminEmail);
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const adminUser = await prisma.user.create({
    data: {
      firstName: "Default",
      lastName: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user created:", adminUser.email);
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// seedParkingSlots();
// seedUsers();
