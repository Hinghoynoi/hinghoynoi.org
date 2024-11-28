import { prisma } from "~/database/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  const data = await prisma.articlesData.findFirst({
    where: {
      id: parseInt(id),
    },
  });

  if (!data) return { status: 500, body: "Article not found" };

  return { status: 200, body: JSON.stringify(data) };
});
