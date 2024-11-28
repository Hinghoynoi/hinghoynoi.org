<script setup lang="ts">
import { md5 } from "~/lib/md5";
const user = useSupabaseUser();

const avatar = `https://www.gravatar.com/avatar/${md5(
  user.value?.email ?? "",
)}?d=mp&s=48`;
</script>

<template>
  <nav class="navbar-container">
    <div class="navbar-items">
      <div class="navbar-start">
        <label for="my-drawer">
          <svg
            width="24"
            height="24"
            viewBox="0 0 36 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2H34"
              stroke="#ffffff"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M2 13.8033H34"
              stroke="#ffffff"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M2 26H34"
              stroke="#ffffff"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </label>
      </div>
      <div class="navbar-center">
        <div
          class="logo-container navbar-center flex cursor-pointer items-center justify-center gap-4"
          @click="navigateTo('/')"
        >
          <img src="/logo.png" alt="Logo" />
        </div>
      </div>
      <div class="navbar-end flex">
        <div>
          <NuxtLink to="/profile">
            <img class="rounded-box" :src="avatar" alt="Account" v-if="user" />
            <font-awesome v-else icon="user" class="invert" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
nav {
  @apply navbar bg-blend-normal;
}

.navbar-container {
  @apply z-[2] bg-gradient-to-b from-blue-950 to-blue-900;
}

.navbar-items {
  @apply flex w-full flex-row justify-between px-6 py-2 md:px-12;
}

.logo-container {
  @apply navbar-center justify-center md:flex;
}

.logo-container img {
  height: 64px;
}

.logo-container h1 {
  @apply text-xl font-bold md:text-2xl;
}

.hamburger {
  @apply flex cursor-pointer flex-col items-center justify-center gap-1;
}

.line-1,
.line-2,
.line-3 {
  cursor: pointer;
  height: 3px;
  width: 24px;
  background: #000;
  position: relative;
  display: block;
  content: "";
  transition: all 0.3s;
}
</style>
