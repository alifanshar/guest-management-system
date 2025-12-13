import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log("🌱 Starting database seeding...");

  //  CLEAN EXISTING DATA
  //  (child -> parent)
  await prisma.eventGuest.deleteMany();
  await prisma.guest.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Existing data cleared");

  // CREATE USERS
  const adminPassword = await bcrypt.hash("admin12345", SALT_ROUNDS);
  const userPassword = await bcrypt.hash("user12345", SALT_ROUNDS);

  const admin = await prisma.user.create({
    data: {
      name: "Admin System",
      email: "admin@gms.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const users = await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        email: "john@gms.com",
        password: userPassword,
        role: "USER",
      },
      {
        name: "Jane Smith",
        email: "jane@gms.com",
        password: userPassword,
        role: "USER",
      },
      {
        name: "Michael Lee",
        email: "michael@gms.com",
        password: userPassword,
        role: "USER",
      },
    ],
  });

  console.log("👤 Users created");

  const allUsers = await prisma.user.findMany({
    where: { role: "USER" },
  });


  //  CREATE EVENTS (ADMIN)
  const events = await prisma.event.createMany({
    data: [
      {
        title: "Tech Conference 2025",
        description: "Annual technology conference",
        location: "Jakarta Convention Center",
        eventDate: new Date("2025-06-10"),
        createdById: admin.id,
      },
      {
        title: "Startup Meetup",
        description: "Networking for startups",
        location: "Bandung Creative Hub",
        eventDate: new Date("2025-07-05"),
        createdById: admin.id,
      },
    ],
  });

  console.log("📅 Events created");

  const allEvents = await prisma.event.findMany();


  //  CREATE GUESTS
  const guestsData = [];

  allUsers.forEach((user, index) => {
    guestsData.push(
      {
        name: `Guest A${index + 1}`,
        email: `guestA${index + 1}@mail.com`,
        phone: "08123456789",
        status: "CONFIRMED",
        createdById: user.id,
      },
      {
        name: `Guest B${index + 1}`,
        email: `guestB${index + 1}@mail.com`,
        phone: "08987654321",
        status: "INVITED",
        createdById: user.id,
      }
    );
  });

  await prisma.guest.createMany({ data: guestsData });

  console.log("🎟 Guests created");

  const allGuests = await prisma.guest.findMany();


  //  EVENT <-> GUEST RELATION
  for (const event of allEvents) {
    for (const guest of allGuests.slice(0, 4)) {
      await prisma.eventGuest.create({
        data: {
          eventId: event.id,
          guestId: guest.id,
        },
      });
    }
  }

  console.log("🔗 Event-Guest relations created");

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
