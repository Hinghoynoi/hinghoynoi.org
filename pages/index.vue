<template>
  <div class="relative min-h-screen w-screen bg-blue-900">
    <img
      src="/landing.png"
      alt="landing"
      class="h-screen w-full object-cover"
    />
    <div
      class="absolute left-0 top-0 flex h-screen w-full items-center justify-center bg-gradient-to-b from-transparent via-black/40 to-blue-900"
    >
      <div class="flex h-1/2 flex-col gap-12 text-center">
        <h1 class="glow text-7xl font-bold text-white lg:text-9xl">
          หิ้งห้อยน้อย
        </h1>
        <p class="max-w-sm text-xl text-white lg:max-w-3xl lg:text-3xl">
          ที่รวมตัวของแสงสว่างดวงเล็ก ๆ คลับของเด็กที่อบอุ่นและเป็นกันเอง คิด
          ตั้งคำถาม เปล่งประกาย และไขความลับที่นี่ได้อย่างอิสระ
          หรือตอนที่อยากเล่าเรื่องในใจให้ใครสักคนฟัง
        </p>
      </div>
    </div>
    <!--    <div class="flex flex-col items-center justify-center p-12">-->
    <!--      <h1 class="text-4xl">มีอะไรใหม่</h1>-->
    <!--      <h1 class="text-4xl">มีอะไรใหม่</h1>-->
    <!--      <h1 class="text-4xl">มีอะไรใหม่</h1>-->
    <!--      <h1 class="text-4xl">มีอะไรใหม่</h1>-->
    <!--      <h1 class="text-4xl">มีอะไรใหม่</h1>-->
    <!--      <h1 class="text-4xl">มีอะไรใหม่</h1>-->
    <!--      <h1 class="text-4xl">มีอะไรใหม่</h1>-->
    <!--    </div>-->
  </div>
</template>

<style scoped>
.glow {
  color: #fff;
  animation: glow 1s cubic-bezier(0.23, 0.5, 0.76, 0.29) infinite alternate;
}

@keyframes glow {
  from {
    text-shadow:
      0 0 30px #e6d300,
      0 0 40px #e6db00;
  }

  to {
    text-shadow:
      0 0 10px #f9f5c1,
      0 0 30px #e6d300,
      0 0 40px #e6db00,
      0 0 50px #e6d300,
      0 0 60px #e6a900,
      0 0 70px #e68600,
      0 0 80px #ffc44d;
  }
}
</style>
<script setup lang="ts"></script>
