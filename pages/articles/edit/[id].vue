<script setup lang="ts">
definePageMeta({
  middleware: ["auth"],
});

import imageCompression from "browser-image-compression";
import { nanoid } from "nanoid";
import { render } from "~/lib/render";

const id = useRoute().params.id;
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const i18n = useI18n();
let error = ref("");
let success = ref(false);
let file = ref(null);
let isSubmitting = ref(false);

const { body: articleBody } = await $fetch("/api/article", {
  body: {
    id,
  },
  method: "POST",
});

const articleData = JSON.parse(articleBody);

if (articleData.author_id !== user.value?.id && user.value?.role !== "admin") {
  throw createError({
    statusCode: 403,
    message: i18n.t("user.permission"),
  });
}

const { body } = await $fetch("/api/user", {
  body: {
    id: user.value?.id,
    email: user.value?.email,
  },
  method: "POST",
});

const userData = JSON.parse(body);

if (userData.role !== "admin") {
  throw createError({
    statusCode: 403,
    message: i18n.t("user.permission"),
  });
}

let article = reactive({
  title: articleData.title,
  coverImg: articleData.coverImg,
  content: articleData.content,
  tags: articleData.tags.join(" "),
});

function fileInput(e) {
  file.value = e.target.files[0];
}

async function uploadFile() {
  let genid = nanoid();

  if (!file.value) return i18n.t("article.edit.coverImg.required");

  if (
    ![
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ].includes(file.value.type)
  ) {
    return i18n.t("article.edit.coverImg.type");
  }

  const compressedFile = await imageCompression(file.value, {
    maxSizeMB: 2,
  });

  const { data, error: err } = await supabase.storage
    .from("coverImg")
    .upload(`${genid}`, compressedFile, {
      cacheControl: "3600",
      upsert: false,
    });
  if (err) {
    return i18n.t("article.edit.coverImg.error");
  }

  article.coverImg = genid;
}

async function submit() {
  if (isSubmitting.value) {
    error.value = i18n.t("article.submit.submitting");
    return;
  }
  isSubmitting.value = true;
  if (article.title.length === 0) {
    error.value = i18n.t("article.title.required");
    return;
  }

  if (article.content.length === 0) {
    error.value = i18n.t("article.content.required");
    return;
  }

  if (article.tags.length === 0) {
    error.value = i18n.t("article.tags.required");
    return;
  }

  if (file.value) {
    let errUpload = await uploadFile();
    if (errUpload) {
      error.value = errUpload;
      return;
    }
    return;
  }

  $fetch("/api/article/edit", {
    method: "POST",
    body: {
      id: id,
      title: article.title,
      coverImg: article.coverImg,
      content: article.content,
      tags: article.tags.split(" ").map((tag) => tag.trim()),
    },
  }).then((res) => {
    if (res.status === 200) {
      success.value = true;
    } else {
      error.value = i18n.t("article.submit.error");
    }
  });
}

function deleteArticle() {
  if (isSubmitting.value) {
    error.value = i18n.t("article.submit.submitting");
    return;
  }
  isSubmitting.value = true;
  $fetch("/api/article/delete", {
    method: "POST",
    body: {
      id: id,
    },
  }).then((res) => {
    if (res.status === 200) {
      success.value = true;
    } else {
      error.value = i18n.t("article.submit.error");
    }
  });
}

function closeErrorDialog() {
  isSubmitting.value = false;
  error.value = "";
}
</script>

<template>
  <div>
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
      :handle-on-close="() => navigateTo('/articles/' + id)"
    />
    <div class="flex flex-col gap-8 px-2 py-12 lg:px-24">
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl">{{ $t("article.title.title") }}</h1>
        <input
          type="text"
          class="input input-primary"
          v-model="article.title"
        />
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl">{{ $t("article.tags.title") }}</h1>
        <input type="text" class="input input-primary" v-model="article.tags" />
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl">{{ $t("article.coverImg.title") }}</h1>
        <input type="file" @input="(e) => fileInput(e)" />
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl">{{ $t("article.content.title") }}</h1>
        <textarea class="input input-primary h-96" v-model="article.content" />
      </div>
      <div class="flex flex-col gap-2">
        <h1 class="text-2xl">{{ $t("article.content.preview") }}</h1>
        <div
          class="markdown-body rounded-lg border-2 border-black/40 p-2"
          v-html="render(article.content)"
        ></div>
      </div>
      <div class="flex justify-end gap-4">
        <button
          class="btn btn-primary"
          :disabled="
            article.title.length === 0 ||
            article.content.length === 0 ||
            error.length > 0 ||
            isSubmitting
          "
          @click="submit"
        >
          {{ $t("article.submit.title") }}
        </button>
        <button class="btn btn-secondary" @click="navigateTo('/articles')">
          {{ $t("article.cancel") }}
        </button>
        <button class="btn btn-warning" @click="deleteArticle">
          {{ $t("article.delete") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
