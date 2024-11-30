<script setup>
const { tag } = useRoute().params;
const { body } = await $fetch("/api/article/tag", {
  params: {
    tag,
  },
  method: "GET",
});

const supabase = useSupabaseClient();
let articles = JSON.parse(body);
</script>

<template>
  <div
    class="flex w-full flex-col items-center justify-center gap-8 p-8 lg:px-32 lg:py-16"
  >
    <h1 class="text-6xl">บทความ "{{ tag }}"</h1>
    <div
      class="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:px-0"
      v-if="articles"
      v-for="article in articles"
    >
      <div class="card card-side max-w-lg rounded-lg bg-base-100 shadow-xl">
        <figure>
          <img
            class="h-full w-full"
            :src="'/api/article/image?id=' + article.coverImg"
            alt=""
          />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ article.title }}</h2>
          <p>{{ article.content.substr(0, 100) + "..." }}</p>
          <div class="card-actions justify-end">
            <button
              class="btn btn-primary"
              @click="navigateTo('/articles/' + article.id)"
            >
              {{ $t("article.read") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
