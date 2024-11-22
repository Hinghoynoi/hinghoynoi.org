<script setup lang="ts">
const { data, showProfileButtons, handleLogout } = defineProps([
  "data",
  "showProfileButtons",
  "handleLogout",
]);
import { render } from "~/lib/render";
</script>

<template>
  <div class="flex flex-col gap-4 px-4 py-2 md:px-12 md:py-6">
    <div class="page-container">
      <div class="profile-container">
        <img :src="data.avatarURL" alt="avatar" class="icon" />
        <h1 class="full_name">{{ data.full_name }}</h1>
        <h1 class="handle">
          @{{ data.handle }}
          {{ data.location && " • " + data.location }}
        </h1>
        <div class="flex gap-2" v-if="showProfileButtons">
          <button class="btn btn-primary" @click="navigateTo('/profile/edit')">
            {{ $t("user.profile.edit") }}
          </button>
          <button class="btn btn-error" @click="handleLogout">
            {{ $t("user.profile.logout") }}
          </button>
        </div>
      </div>
      <div class="side-info-container">
        <div class="items-container h-full rounded-2xl bg-[#FFB005] p-8">
          <h1 class="text-center">{{ $t("user.profile.bio.title") }}</h1>
          <p class="text-justify text-xl">
            {{ data.bio?.length > 0 ? data.bio : $t("user.profile.bio.empty") }}
          </p>
        </div>
      </div>
    </div>
    <!--    <div class="divider">-->
    <!--      <h1>{{ $t("user.profile.introduction.title") }}</h1>-->
    <!--    </div>-->
    <div
      class="introduction bg-base-100"
      v-html="render(data.introduction || '')"
    ></div>
  </div>
</template>

<style scoped>
h1 {
  @apply text-2xl font-bold;
}

.page-container {
  @apply grid w-full grid-cols-1 gap-4 lg:grid-cols-2;
}

.profile-container {
  @apply flex flex-col items-center justify-center gap-2 rounded-2xl bg-emerald-800 p-8 text-white;
}

.profile-container .icon {
  @apply rounded-2xl;
  height: 128px;
  width: 128px;
}

.profile-container .full_name {
  @apply text-3xl font-bold;
}

.profile-container .handle {
  @apply text-xl text-neutral-300;
}

.side-info-container {
  @apply flex flex-col gap-4;
}

.side-info-container .items-container {
  @apply flex flex-col gap-2;
}

.side-info-container .items-wrapper {
  @apply flex flex-row justify-center gap-2;
}

.introduction {
  @apply min-h-[50vh] rounded-2xl bg-white p-8;
}

.introduction p {
  @apply text-sm;
}

.acc-container {
  @apply flex flex-col gap-4 rounded-2xl;
}
</style>
