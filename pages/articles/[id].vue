<script setup>
const { id } = useRoute().params;
import { getGravatarUrl } from "~/lib/avatar";
import { render } from "~/lib/render";

let comment = ref("");
let success = ref(false);
let error = ref("");
const i18n = useI18n();

const res = await $fetch("/api/article", {
  body: {
    id,
  },
  method: "POST",
});
const data = res.status === 200 ? JSON.parse(res?.body) : null;

if (!data) {
  throw createError({
    statusCode: 404,
    message: i18n.t("article.notfound"),
  });
}

if (res?.status !== 200) {
  error.value = res?.body;
}

const authorRes = await $fetch("/api/user", {
  body: {
    id: data?.author_id,
  },
  method: "POST",
});

if (authorRes?.status !== 200) {
  error.value = authorRes?.body;
}

const authorData = JSON.parse(authorRes?.body);

const user = useSupabaseUser();
const supabase = useSupabaseClient();

function submit() {
  if (!user.value) {
    error.value = i18n.t("user.comment.needlogin");
    return;
  }

  if (comment.value.length === 0) return;

  if (comment.value.length > 512) {
    error.value = i18n.t("user.comment.maxLength");
    return;
  }

  $fetch("/api/comment", {
    method: "PUT",
    body: {
      user_id: user.value.id,
      article_id: id,
      comment: comment.value,
    },
  }).then((res) => {
    if (res.status === 200) {
      success.value = true;
    } else {
      if (res.errMsg.length) return (error.value = i18n.t(res.errMsg));
      error.value = res.body.toString();
    }
  });
}

const isUserAuthor = user.value?.id === data?.author_id;
const isUserAdmin = user.value?.role === "admin";

let comments = ref([]);

const commentRes = await $fetch("/api/comment", {
  body: {
    id: id,
  },
  method: "POST",
});

comments.value = JSON.parse(commentRes?.body ?? []);

const authorMap = new Map();
for (const c of comments.value) {
  if (!authorMap.has(c.author_id)) {
    const authorRes = await $fetch("/api/user", {
      body: {
        id: c.author_id,
      },
      method: "POST",
    });

    if (authorRes?.status !== 200) {
      error.value = authorRes?.body;
    }

    authorMap.set(c.author_id, JSON.parse(authorRes?.body ?? {}));
  }
}

function closeErrorDialog() {
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
      :description="$t('user.comment.success')"
      end="ok"
      :handle-on-close="() => null"
    />
    <div
      class="flex w-full flex-col items-center justify-center gap-8 p-8 lg:px-32 lg:py-16"
    >
      <!-- Title -->
      <div class="flex flex-col items-center gap-4">
        <h1 class="text-center text-4xl font-bold lg:text-5xl">
          {{ data?.title }}
        </h1>
        <p class="text-lg font-bold uppercase text-gray-500 lg:text-2xl">
          {{
            new Intl.DateTimeFormat("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }).format(new Date(data?.publishedAt))
          }}
        </p>
        <span
          v-if="isUserAdmin || isUserAuthor"
          class="btn btn-primary"
          @click="navigateTo('/articles/edit/' + data?.id)"
        >
          แก้ไขบทความ
        </span>
      </div>

      <!-- Image -->
      <img
        :src="'/api/article/image?id=' + data?.coverImg"
        class="w-full rounded-xl lg:w-2/3"
        alt=""
      />

      <!-- Author & Tags -->
      <div class="flex w-full flex-col justify-evenly rounded-lg md:flex-row">
        <div
          class="flex w-full cursor-pointer items-center justify-center gap-4"
          @click="navigateTo('/user/' + authorData.handle)"
        >
          <img
            :src="getGravatarUrl(authorData.email)"
            class="w-[64px] rounded-lg"
            alt=""
          />
          <div class="flex flex-col">
            <h1 class="text-xl font-bold lg:text-2xl">
              {{ authorData.full_name }}
            </h1>
            <h1 class="text-base text-gray-500 lg:text-xl">
              @{{ authorData.handle }}
            </h1>
          </div>
        </div>
        <div class="flex w-full flex-col items-center justify-center gap-2">
          <p class="font-bold">Tags</p>
          <div class="flex flex-row gap-2">
            <span
              v-for="tag in data?.tags"
              class="tag cursor-pointer"
              @click="navigateTo('/articles/tags/' + tag)"
              >{{ tag }}</span
            >
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Content -->
      <div class="markdown-body" v-html="render(data?.content)"></div>

      <div class="divider"></div>

      <!-- Comments -->
      <div class="flex w-full flex-col gap-8">
        <h1 class="text-2xl font-bold lg:text-3xl">Comments</h1>
        <!-- Write Comment -->
        <div class="flex w-full flex-col gap-4">
          <textarea
            class="h-[128px] w-full rounded-lg border border-gray-300 p-4 text-lg"
            placeholder="Write your comment here..."
            v-model="comment"
          ></textarea>
          <span>{{ 512 - comment.length }} {{ $t("user.edit.charLeft") }}</span>
          <button
            class="w-full rounded-lg bg-gray-800 py-2 text-lg font-bold text-white"
            @click="submit"
          >
            Post Comment
          </button>
        </div>
        <!-- Comments List -->
        <div class="flex flex-col gap-16" v-for="c in comments" :key="c.id">
          <div class="flex flex-col justify-center gap-4">
            <div
              class="flex cursor-pointer flex-row gap-4"
              @click="navigateTo('/user/' + authorMap.get(c.author_id).handle)"
            >
              <img
                :src="getGravatarUrl(authorMap.get(c.author_id).email)"
                class="rounded-lg"
                alt=""
              />
              <div class="flex flex-col justify-center gap-0">
                <h1 class="text-lg font-bold lg:text-xl">
                  {{ authorMap.get(c.author_id).full_name }}
                </h1>
                <p class="text-sm text-gray-500 lg:text-base">
                  @{{ authorMap.get(c.author_id).handle }} •
                  {{
                    new Intl.DateTimeFormat("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      minute: "2-digit",
                      hour: "2-digit",
                    }).format(new Date(c.createdAt))
                  }}
                </p>
              </div>
            </div>

            <div>
              {{ c.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
ul {
  list-style-type: disc;
}

ol {
  list-style-type: decimal;
}

.tag {
  @apply rounded-full bg-gray-800 px-4 py-2 text-white;
}
</style>
<script setup lang="ts"></script>
