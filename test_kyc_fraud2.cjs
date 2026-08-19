const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db"
    }
  }
});

async function run() {
  const users = await prisma.user.findMany({ take: 1 });
  console.log("Users:", users.length);
}
run().catch(console.error);
