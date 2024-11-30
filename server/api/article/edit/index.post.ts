import { prisma } from "~/database/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, content, title, coverImg, tags } = body;

  const data = await prisma.articlesData
    .update({
      where: {
        id: Number(id),
      },
      data: {
        coverImg: coverImg,
        title: title,
        content: content,
        tags: tags,
      },
    })
    .catch((err: any) => {
      console.error(err);
      return { status: 500, body: err.message };
    });

  return { status: 200, body: JSON.stringify(data) };
});
