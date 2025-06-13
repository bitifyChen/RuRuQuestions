<script setup>
</script>
<template>
  <el-scrollbar height="100dvh" class="bg-gradient-to-t from-[#70BBCB] via-[#A3B5E3] to-[#2347A4]"> 
    <router-view class="base-wrap" />
  </el-scrollbar>
</template>

<style scoped>
.base-wrap {
  position: relative;
  z-index: 1;
}
</style>
