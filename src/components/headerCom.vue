<script setup></script>

<template>
  <div class="mx-auto top-0 left-0 right-0 fixed z-50">
    <div class="max-w-[1240px] p-[10px] mx-auto flex justify-between items-center">
      <div
        class="text-[20px] xl:text-[30px] font-semibold tracking-wide drop-shadow-md select-none logo mr-auto cursor-pointer"
        @click="$router.push('/')"
      >
        Ruru’s 30 Questions
      </div>
      <menuCom />
    </div>
  </div>
</template>

<style scoped></style>
