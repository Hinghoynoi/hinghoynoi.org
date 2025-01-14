import { prisma } from "~/database/prisma";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, content, title, coverImg, tags, handle, email } = body;

  const data = await prisma.articlesData
    .create({
      data: {
        coverImg: coverImg,
        title: title,
        content: content,
        tags: tags,
        author: {
          connect: {
            id: id,
            handle: handle,
            email: email,
          },
        },
      },
    })
    .catch((err: any) => {
      console.error(err);
      return { status: 500, body: err.message };
    });

  return { status: 200, body: JSON.stringify(data) };
});
