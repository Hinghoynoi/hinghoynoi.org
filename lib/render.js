import sanitizeHtml from "sanitize-html";
import markdownit from "markdown-it";

export const render = (md) => sanitizeHtml(markdownit("commonmark").render(md));
