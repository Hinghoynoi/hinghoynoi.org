import { prisma } from "~/database/prisma";

export default defineEventHandler(async (event) => {
  const data = await prisma.articlesData.findMany();

  return { status: 200, body: JSON.stringify(data) };
});
