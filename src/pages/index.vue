<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { path } from '@/router/menu' // 依你實際路徑調整

const router = useRouter()
const state1 = ref('')
const allPaths = path()

// 自動提示資料
const querySearch = (queryString, cb) => {
  const results = queryString
    ? allPaths.filter((item) => item.name.toLowerCase().includes(queryString.toLowerCase()))
    : allPaths

  cb(
    results.map((item) => ({
      value: item.name,
      path: item.path
    }))
  )
}

// 點選建議項目時跳轉
const handleSelect = (item) => {
  router.push(item.path)
}
</script>

<template>
  <section class="text-center space-y-6 max-w-[1220px] mx-auto">
    <h2 class="text-4xl font-bold tracking-wide logo">Ruru’s 30 Questions</h2>
    <div class="ruru-input">
      <el-autocomplete
        v-model="state1"
        :fetch-suggestions="querySearch"
        clearable
        placeholder="你今天有甚麼煩惱呢?"
        @select="handleSelect"
        class="w-80 mx-auto"
      />
    </div>
  </section>
</template>

<route>
  {
    meta: {
      layout: "empty"
    }
  }
</route>

<style scoped lang="scss">
.ruru-input {
  width: 200px;
  margin: 0 auto;
  transition: width 0.3s ease;

  &:focus-within {
    width: 400px;
    max-width: calc(100% - 20px);
  }

  :deep(.el-input__wrapper) {
    background: transparent;
    border: none;
    border-bottom: 2px solid white;
    box-shadow: none;
    color: white;
    border-radius: 0;
    padding: 10px 4px;
  }

  :deep(.el-input__inner) {
    padding: 10px;
    color: white;
    text-align: center; /* placeholder + 輸入文字置中 */
  }

  :deep(.el-input__inner::placeholder) {
    color: white;
    text-align: center;
  }
}

</style>