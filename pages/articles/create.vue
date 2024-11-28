<script setup>
definePageMeta({
  middleware: ["auth"],
});
import { nanoid } from "nanoid";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const i18n = useI18n();
let fileUploading = ref(false);
let isFileUploaded = ref(false);
let error = ref("");
let success = ref(false);
let articleId = ref("");

const { body } = await $fetch("/api/user", {
  body: {
    id: user.value?.id,
    email: user.value?.email,
  },
  method: "POST",
});

const userData = JSON.parse(body);

let article = reactive({
  title: "",
  coverImg: "",
  content: "",
});

async function fileInput(e) {
  let genid = nanoid();
  if (isFileUploaded.value && article.coverImg?.length > 0) {
    const { error: delErr } = await supabase.storage
      .from("coverImg")
      .remove([article.coverImg.split("/").pop().split("?")[0]]);
    if (delErr) {
      error.value = i18n.t("article.edit.coverImg.error");
      return;
    }
  }
  fileUploading.value = true;
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 1024 * 1024 * 24) {
    error.value = i18n.t("article.edit.coverImg.size");
    return;
  }

  if (
    !["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)
  ) {
    error.value = i18n.t("article.edit.coverImg.type");
    return;
  }

  const { data, error: err } = await supabase.storage
    .from("coverImg")
    .upload(`${genid}`, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (err) {
    error.value = i18n.t("article.edit.coverImg.error");
    return;
  }

  article.coverImg = genid;
  fileUploading.value = false;
  isFileUploaded.value = true;
}

function submit() {
  if (article.title.length === 0) {
    error.value = i18n.t("article.title.required");
    return;
  }

  if (article.content.length === 0) {
    error.value = i18n.t("article.content.required");
    return;
  }

  $fetch("/api/article", {
    method: "PUT",
    body: {
      id: userData.id,
      handle: userData.handle,
      email: userData.email,
      title: article.title,
      coverImg: article.coverImg,
      content: article.content,
    },
  }).then((res) => {
    if (res.status === 200) {
      success.value = true;
      articleId.value = JSON.parse(res.body).id;
    } else {
      error.value = i18n.t("article.submit.error");
    }
  });
}

function closeErrorDialog() {
  error.value = "";
}
</script>

<template>
  <Modal
    :show="error?.length > 0"
    :title="$t('modal.title.error')"
    :description="error"
    end="ok"
    :handle-on-close="closeErrorDialog"
  />
  <Modal
    :show="success"
    :title="$t('modal.title.success')"
    :description="$t('article.success')"
    end="ok"
    :handle-on-close="() => navigateTo('/articles/' + articleId)"
  />
  <div class="flex flex-col gap-8 py-12 lg:px-24">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl">{{ $t("article.title") }}</h1>
      <input type="text" class="input input-primary" v-model="article.title" />
    </div>
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl">{{ $t("article.coverImg") }}</h1>
      <input type="file" @input="(e) => fileInput(e)" />
    </div>
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl">{{ $t("article.content") }}</h1>
      <textarea class="input input-primary h-96" v-model="article.content" />
    </div>
    <div class="flex justify-end gap-4">
      <button
        class="btn btn-primary"
        :disabled="
          fileUploading ||
          article.title.length === 0 ||
          article.content.length === 0 ||
          error.length > 0 ||
          !isFileUploaded
        "
        @click="submit"
      >
        {{ $t("article.submit") }}
      </button>
      <button class="btn btn-secondary">{{ $t("article.cancel") }}</button>
    </div>
  </div>
</template>

<style scoped></style>
