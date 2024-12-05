<script setup>
const { body } = await $fetch("/api/article", {
  method: "GET",
});

const supabase = useSupabaseClient();
let articles = JSON.parse(body);
</script>

<template>
  <div class="relative min-h-screen w-screen bg-blue-900">
    <NuxtImg
      src="/treehouse.png"
      alt="treehouse"
      class="h-screen w-full object-cover"
    />
    <div
      class="absolute left-0 top-0 flex h-screen w-full items-center justify-center bg-gradient-to-b from-transparent via-black/40 to-[#fbf24f] lg:justify-end"
    >
      <div
        class="flex h-1/2 flex-col gap-12 text-center lg:pr-16 lg:text-right"
      >
        <p class="w-full text-xl text-white lg:text-3xl">
          ศูนย์การะจายเรื่องราว ข่าวสาร <br />
          จุดความคิดและจินตนการ <br />
          ให้กับชาวหิ่งห้อยน้อย
        </p>
        <h1 class="glow text-7xl font-bold text-white lg:text-9xl">
          หอประกายข่าว
        </h1>
        <div class="w-full">
          <span class="btn btn-primary" @click="navigateTo('/articles/create')">
            เขียนบทความใหม่
          </span>
        </div>
      </div>
    </div>
    <div
      class="flex h-full w-full flex-col items-center justify-center gap-8 bg-[#fbf24f] pb-12"
    >
      <h1 class="text-6xl">บทความ</h1>
      <div
        class="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:px-0"
        v-if="articles"
      >
        <div
          class="card max-w-lg rounded-lg bg-base-100 shadow-xl xl:card-side"
          v-for="article in articles"
        >
          <figure class="h-1/2 xl:h-full xl:w-1/2">
            <img
              class="h-full w-full rounded-t-lg object-cover"
              :src="'/api/article/image?id=' + article.coverImg"
              alt=""
            />
          </figure>
          <div class="card-body h-1/2 xl:h-full xl:w-1/2">
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
  </div>
</template>
