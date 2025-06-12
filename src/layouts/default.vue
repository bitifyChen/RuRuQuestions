<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="h-screen w-screen bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white flex">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->
      <header class="h-16 flex items-center justify-between px-6 
                     bg-white/10 backdrop-blur-sm border-b border-white/10">
        <h1 class="text-lg font-semibold text-blue-300 tracking-wide">
          Excel 檢查功能
        </h1>
      </header>

      <!-- Main View Area -->
      <main class="flex-1 p-6 overflow-auto">
        <div class="bg-white/5 backdrop-blur-md rounded-lg border border-white/10 p-6 min-h-[300px]">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
