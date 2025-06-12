<script setup>
import { AlertTriangle } from 'lucide-vue-next'
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const fileName = ref('')
const jsonData = ref([])
const errors = ref({})

// 用 computed 合併成一個渲染用陣列
const tableRows = computed(() => {
  return jsonData.value.map((row, idx) => ({
    originalIndex: idx, // 原始陣列的 index (若未排序時同 idx)
    displayIndex: idx + 2, // 你表格裡顯示的行號（從 2 開始）
    ...row,
    error: errors.value[idx] || ''
  }))
})

function fillMergedCells(worksheet) {
  if (!worksheet['!merges']) return

  worksheet['!merges'].forEach(({ s, e }) => {
    const startCell = XLSX.utils.encode_cell(s)
    const startValue = worksheet[startCell]?.v ?? ''

    for (let R = s.r; R <= e.r; ++R) {
      for (let C = s.c; C <= e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
        if (!worksheet[cellRef]) {
          worksheet[cellRef] = { t: 's', v: startValue }
        }
      }
    }
  })
}

// 根據規則驗證五通號欄位
function validateWuTong(value) {
  if (!value || value.toString().trim() === '') return '五通號欄位不可為空'
  const str = value.toString()
  const idx = str.indexOf('~')
  if (idx === -1) return '必須包含「~」字元'
  if (idx !== 18) return '「~」前必須符合18個字'
  if (str.length - idx - 1 !== 4) return '「~」後必須符合4個字'
  return ''
}

function validateAllRows(data) {
  const errs = {}
  data.forEach((row, idx) => {
    const val = row['五通號']
    const errMsg = validateWuTong(val)
    if (errMsg) errs[idx] = errMsg
  })
  return errs
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })
    const firstSheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[firstSheetName]

    fillMergedCells(worksheet)

    const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' })

    jsonData.value = json
    errors.value = validateAllRows(json)
  }

  reader.readAsArrayBuffer(file)

  // ⭐ 清空 input 的值，解決再次上傳相同檔案時不觸發問題
  event.target.value = ''
}
</script>

<template>
  <section class="space-y-6">
    <div class="flex space-x-4">
      <!-- 上傳表單 -->
      <div
        class="p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-lg flex-1 transition-transform hover:scale-[1.01]"
      >
        <label
          for="file-upload"
          class="block mb-4 text-xl font-bold text-gray-700 text-center select-none"
        >
          選擇 Excel 檔案 (.xlsx, .xls)
        </label>
        <input
          ref="fileInput"
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          @change="handleFileUpload"
          class="hidden"
        />
        <button
          @click="$refs.fileInput.click()"
          class="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-semibold shadow hover:from-purple-500 hover:to-indigo-400 transition-all duration-300"
        >
          選擇檔案
        </button>
        <p v-if="fileName" class="mt-4 text-gray-700 text-center text-sm tracking-wide select-text">
          已選擇：<span class="font-semibold">{{ fileName }}</span>
        </p>
      </div>

      <!-- 錯誤統計 -->
      <div
        v-if="jsonData.length"
        class="p-6 rounded-2xl bg-white/30 backdrop-blur-md border border-white/40 shadow-lg flex-1 flex items-center justify-center hover:scale-[1.01]"
      >
        <div class="text-center space-y-2">
          <div class="flex items-center justify-center space-x-2 text-red-500">
            <AlertTriangle class="w-6 h-6 opacity-80" />
            <span class="text-xl font-semibold">錯誤欄位總數</span>
          </div>
          <div class="text-5xl font-extrabold text-red-700">
            {{ Object.keys(errors).length }}
          </div>
        </div>
      </div>
    </div>

    <!-- 資料表格 -->
    <div
      v-if="jsonData.length"
      class="overflow-auto border border-white/40 rounded-2xl bg-white/30 backdrop-blur-md shadow-lg"
    >
      <table class="min-w-full border-collapse text-gray-800">
        <thead class="bg-purple-200/50 sticky top-0 text-gray-800 text-sm">
          <tr>
            <th class="border border-white/20 px-4 py-2 text-left">#</th>
            <th class="border border-white/20 px-4 py-2 text-left">五通號</th>
            <th class="border border-white/20 px-4 py-2 text-left">錯誤原因</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, index) in tableRows"
            :key="index"
            class="even:bg-white/20 odd:bg-white/10 transition-all hover:bg-white/40"
          >
            <td
              class="border border-white/20 px-4 py-2 font-black"
              :class="{ 'border-red-500 text-red-700 font-black': row.error }"
            >
              {{ row.displayIndex }}
            </td>
            <td
              class="border border-white/20 px-4 py-2"
              :class="{ 'border-red-500 bg-red-200/30 text-red-700 font-black': row.error }"
              :title="row.error"
            >
              {{ row['五通號'] || '' }}
            </td>
            <td class="border border-white/20 px-4 py-2 text-red-600 font-black" v-if="row.error">
              {{ row.error }}
            </td>
            <td v-else class="border border-white/20 px-4 py-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped></style>
