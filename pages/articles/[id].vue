<script setup>
const { id } = useRoute().params;
import { render } from "~/lib/render";
import { md5 } from "~/lib/md5.js";

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
  error.value = i18n.t("article.notFound");
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

const authorData = JSON.parse(authorRes?.body ?? {});

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const { data: urldata, error: urlerr } = await supabase.storage
  .from("coverImg")
  .createSignedUrl(data?.coverImg, 60, {
    type: "cache-control",
    action: "read",
  });

if (urlerr) {
  error.value = i18n.t("article.edit.coverImg.error");
}

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
    </div>

    <!-- Image -->
    <img :src="urldata.signedUrl" class="w-full rounded-xl lg:w-2/3" alt="" />

    <!-- Author & Tags -->
    <div class="flex w-full flex-col justify-evenly rounded-lg md:flex-row">
      <div class="flex w-full items-center justify-center gap-4">
        <img
          :src="
            'https://www.gravatar.com/avatar/' +
            md5(authorData.email) +
            '?d=retro&size=64'
          "
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
      <!--      <div class="flex w-full flex-col items-center justify-center gap-2">-->
      <!--        <p class="font-bold">Tags</p>-->
      <!--        <div class="flex flex-row gap-2">-->
      <!--          <span class="tag">Activism</span>-->
      <!--          <span class="tag">Feminism</span>-->
      <!--          <span class="tag">Peru</span>-->
      <!--        </div>-->
      <!--      </div>-->
    </div>

    <div class="divider"></div>

    <!-- Content -->
    <div
      class="flex flex-col gap-8 lg:mx-12"
      v-html="render(data?.content)"
    ></div>

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
      <!-- Comments -->
      <div class="flex flex-col gap-16" v-for="c in comments" :key="c.id">
        <div class="flex flex-col justify-center gap-4">
          <a href="/user/webmaster">
            <div class="flex cursor-pointer flex-row gap-4">
              <img
                src="https://www.gravatar.com/avatar/697d2d75142f766171b62ba4a19d58b1?d=retro&size=64"
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
          </a>
          <p>
            {{ c.content }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
p {
  @apply text-justify text-lg;
}

.tag {
  @apply rounded-full bg-gray-800 px-4 py-2 text-white;
}
</style>
<script setup lang="ts"></script>
