import { prisma } from "~/database/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { article_id, comment, user_id } = body;

  const data = await prisma.commentsData
    .create({
      data: {
        article: {
          connect: {
            id: parseInt(article_id),
          },
        },
        author: {
          connect: {
            id: user_id,
          },
        },
        content: comment,
      },
    })
    .catch((err: any) => {
      console.error(err);
      return { status: 500, body: err.message };
    });

  return { status: 200, body: JSON.stringify(data) };
});
