import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client/web";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

const url = process.env.TURSO_DATABASE_URL || "file:./local.db";

if (url.startsWith("libsql://") || url.startsWith("https://")) {
  const libsql = createClient({ url });
  const adapter = new PrismaLibSQL(libsql);
  prisma = global.prisma || new PrismaClient({ adapter });
} else {
  // Fallback for local sqlite connection
  prisma = global.prisma || new PrismaClient({
    datasources: { db: { url } }
  });
}

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export { prisma };
