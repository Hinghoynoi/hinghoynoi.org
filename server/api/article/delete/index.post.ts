import { prisma } from "~/database/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  const data = await prisma.articlesData.delete({
    where: {
      id: Number(id),
    },
  });

  return { status: 200, body: JSON.stringify(data) };
});
