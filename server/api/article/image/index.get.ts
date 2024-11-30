import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  const supabase = await serverSupabaseClient(event);

  if (!id) return { status: 400, body: "ID is required" };

  // get raw image data
  const { data: imgdata, error: imgerr } = await supabase.storage
    .from("coverImg")
    .download(id as string);

  if (imgerr) {
    return { status: 500, body: JSON.stringify(imgerr) };
  }

  return imgdata;
});
