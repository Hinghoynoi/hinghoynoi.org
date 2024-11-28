import { prisma } from "~/database/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  const data = await prisma.commentsData.findMany({
    where: {
      article_id: {
        equals: parseInt(id),
      },
    },
  });

  return { status: 200, body: JSON.stringify(data) };
});
