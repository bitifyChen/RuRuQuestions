<script setup>
import { AlignRight } from 'lucide-vue-next'
import { ref, computed } from 'vue'
import { path } from '@/router/menu'

const allPaths = computed(() => path())

const isOpen = ref(false)
const toggleOverlay = () => {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <!-- Menu Button -->
    <AlignRight
      @click="toggleOverlay"
      class="w-[40px] h-[40px] opacity-80 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
    />

    <!-- Overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-black backdrop-blur-lg  h-[100vh] bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4"
      @click.self="toggleOverlay"
    >
      <!-- Content Box -->
      <div
        class=" p-6 w-full max-w-[1220px] max-h-[90vh] overflow-auto "
      >
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <router-link
            v-for="(item, i) in allPaths"
            :key="i"
            :to="item.path"
            class="rounded-full block text-center px-4 py-2 border border-white border-opacity-30 text-white bg-white bg-opacity-10 hover:bg-opacity-20 transition duration-200"
            @click="toggleOverlay"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 如有需要可以加動畫過場樣式在這邊 */
</style>