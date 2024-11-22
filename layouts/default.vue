<template>
  <LazyNuxtLoadingIndicator color="#f28c18" class="p-1" />
  <div class="page-layouts">
    <div class="drawer">
      <input id="my-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content">
        <NavBar />
        <slot />
      </div>
      <div class="drawer-side">
        <label
          for="my-drawer"
          aria-label="close sidebar"
          class="drawer-overlay"
        ></label>
        <ul
          class="menu min-h-full w-64 gap-y-4 border-r border-white/25 bg-black p-4 font-bold text-white"
        >
          <center>
            <img src="/logo.png" alt="Logo" width="48" height="auto" />
          </center>
          <li>
            <NuxtLink to="/">
              <font-awesome icon="house" />
              {{ $t("navigation.home") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/notifications">
              <font-awesome icon="newspaper" />
              {{ $t("navigation.newshouse") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/media" @mouseenter="toggleAccordion('media')">
              <font-awesome icon="video" />
              {{ $t("navigation.media.title") }}
              <font-awesome
                :icon="['fas', 'caret-up']"
                class="caret"
                :class="{ open: activeAccordion === 'media' }"
              />
            </NuxtLink>
            <transition name="fade">
              <ul
                v-if="activeAccordion === 'media'"
                class="gap-y-2"
                @mouseleave="toggleAccordion('media')"
              >
                <li>
                  <NuxtLink to="/media/songs">
                    {{ $t("navigation.media.songs") }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/media/animations">
                    {{ $t("navigation.media.animations") }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/media/gallery">
                    {{ $t("navigation.media.gallery") }}
                  </NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/media/ebooks">
                    {{ $t("navigation.media.ebooks") }}
                  </NuxtLink>
                </li>
              </ul>
            </transition>
          </li>
          <li>
            <NuxtLink to="/forum">
              <font-awesome icon="comment" />
              {{ $t("navigation.glittering-yard") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/club">
              <font-awesome icon="flag" />
              {{ $t("navigation.club") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/support">
              <font-awesome icon="handshake-angle" />
              {{ $t("navigation.support") }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/help">
              <font-awesome icon="book" />
              {{ $t("navigation.user-manual") }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.drawer-side {
  z-index: 2;
}

a img {
  @apply invert hover:invert-0;
}

a {
  @apply rounded-lg p-2 hover:bg-black/80 hover:text-white;
  position: relative;
}

.caret {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%) rotate(180deg);
  transition: transform 0.2s;
}

.open {
  transform: translateY(-50%) rotate(0deg);
}

.icon {
  @apply h-auto w-4;
}
</style>

<script>
export default {
  data() {
    return {
      activeAccordion: null, // Initialize activeAccordion as null
    };
  },
  methods: {
    toggleAccordion(section) {
      //#11101D
      if (this.activeAccordion === section) {
        this.activeAccordion = null; // Close the accordion if it's already open
      } else {
        this.activeAccordion = section; // Open the accordion
      }
    },
  },
};
//        <ulclass="menu gap-y-4 min-h-full w-64 border-r border-white/25 bg-black p-4 font-bold text-white">
//darkmode
//<div class="divider"></div>
</script>
