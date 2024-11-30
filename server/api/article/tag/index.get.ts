import { prisma } from "~/database/prisma";

export default defineEventHandler(async (event) => {
  const { tag } = getQuery(event);

  if (!tag) return { status: 400, body: "Tag is required" };

  const data = await prisma.articlesData.findMany({
    where: {
      tags: {
        has: tag,
      },
    },
  });

  return { status: 200, body: JSON.stringify(data) };
});
