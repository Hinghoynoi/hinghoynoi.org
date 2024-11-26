<script setup>
let comment = ref("");
let success = ref(false);
let error = ref("");
const i18n = useI18n();

const user = useSupabaseUser();

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
      article_id: 1,
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
        My story of activism for girls' rights in Peru
      </h1>
      <p class="text-lg font-bold uppercase text-gray-500 lg:text-2xl">
        November 10, 2008
      </p>
    </div>

    <!-- Image -->
    <img
      src="https://www.voicesofyouth.org/sites/voy/files/images/2023-11/comunalia.jpg"
      class="w-full rounded-xl lg:w-2/3"
      alt=""
    />

    <!-- Author & Tags -->
    <div class="flex w-full flex-col justify-evenly rounded-lg md:flex-row">
      <div class="flex w-full items-center justify-center gap-4">
        <img
          src="https://www.gravatar.com/avatar/697d2d75142f766171b62ba4a19d58b1?d=retro&size=128"
          class="w-[64px] rounded-lg"
          alt=""
        />
        <div class="flex flex-col">
          <h1 class="text-xl font-bold lg:text-2xl">Tinnaphat Somsang</h1>
          <h1 class="text-base text-gray-500 lg:text-xl">@tinarskii</h1>
        </div>
      </div>
      <div class="flex w-full flex-col items-center justify-center gap-2">
        <p class="font-bold">Tags</p>
        <div class="flex flex-row gap-2">
          <span class="tag">Activism</span>
          <span class="tag">Feminism</span>
          <span class="tag">Peru</span>
        </div>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Content -->
    <div class="flex flex-col gap-8 lg:mx-12">
      <p>
        During the Covid-19 pandemic, browsing social media while I was at my
        sewing job, I found the Commission of Adolescent Women Leaders of
        Metropolitan Lima (known in Spanish as COMULIA), in my city in Peru. The
        group, together with allied organizations, was inviting girls and
        adolescents for art workshops, such as photography, creative writing and
        theater. I still have the flyer from the call - it is part of the
        memories from the great beginning of my life. Like any other curious
        teenager, I signed up, and soon the workshops began. They taught me
        about gender violence and the myths of romantic love. During this
        learning there were moments that, to this day, I cannot forget. One of
        them was the participation of Dayana, a 15-year-old classmate, younger
        than me, who guided us and encouraged us to raise our voices. My mind
        told me “If she can do it, I can too.”
      </p>
      <p>
        I had never heard the word activism or feminism before, but from that
        moment all the experiences that I disliked in everyday life suddenly
        made sense. My mother was the only example of empowerment I had; she
        tried to break the cycle of violence that she experienced in her family.
        She taught me to confront those who hurt me since she couldn't take care
        of myself at all times, as my mother had assumed the role of economic
        provider in our house.
      </p>
      <p>
        COMULIA invited me to be part of their collective. I am happy to know
        that, like them, there are currently more organizations that promote the
        agency of girls and adolescents. Many of us are survivors - not victims
        - of a nation that fails to protect its people. We have known how to
        stand out from violence in its different variables. Through information
        I can find “that meaning” that now leads me to seek that the girls in my
        town also discover their inner power, discover that their problems are
        important, that despite the fact that we were taught that we should
        remain silent when adults speak, we also have the right to be heard.
      </p>
      <p>
        My voice now has a non-negotiable value, I have much more strength and
        courage. COMULIA and the spaces for participation in dialogue tables,
        forums, intergenerational work, among others, have contributed to the
        development of my approach in promoting the rights of girls and
        adolescents. I try to apply this in my workplace, a well-known radio
        station that, due to its editorial line, refuses to use terms that come
        from activism.
      </p>
    </div>

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
      <div class="flex flex-col gap-16">
        <div class="flex flex-col justify-center gap-4">
          <a href="/user/webmaster">
            <div class="flex cursor-pointer flex-row gap-4">
              <img
                src="https://www.gravatar.com/avatar/697d2d75142f766171b62ba4a19d58b1?d=retro&size=64"
                class="rounded-lg"
                alt=""
              />
              <div class="flex flex-col justify-center gap-0">
                <h1 class="text-lg font-bold lg:text-xl">Tinnaphat Somsang</h1>
                <p class="text-sm text-gray-500 lg:text-base">
                  November 10, 2008
                </p>
              </div>
            </div>
          </a>
          <p>
            I am happy to know that, like them, there are currently more
            organizations that promote the agency
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
