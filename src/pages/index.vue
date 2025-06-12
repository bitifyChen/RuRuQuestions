<template>
  <section class="space-y-6">
    <div class="flex space-x-[10px]">
      <!-- 上傳表單 -->
      <div
        class="p-6 rounded-lg bg-white/10 backdrop-blur-md border border-white/30 shadow-md flex-1"
      >
        <label
          for="file-upload"
          class="block mb-3 text-lg font-semibold text-indigo-400 cursor-pointer select-none text-center"
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
          class="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-purple-600 hover:to-indigo-500 transition-colors duration-300"
        >
          選擇檔案
        </button>
        <p v-if="fileName" class="mt-4 text-green-400 text-center select-text">
          已選擇檔案：<span class="font-medium">{{ fileName }}</span>
        </p>
      </div>
      <div
        v-if="jsonData.length"
        class="p-6 flex justify-center items-center rounded-lg bg-white/10 backdrop-blur-md border border-white/30 shadow-md flex-1"
      >
        <div class="flex flex-col items-center">
          <div class="h-[40px]">
            <div class="flex space-x-1 items-center">
              <AlertTriangle class="w-4 h-4 text-red-400" />
              <span class="font-bold text-red-400">錯誤欄位總數</span>
            </div>
          </div>
          <div class="text-6xl font-extrabold">
            {{ Object.keys(errors).length }}
          </div>
        </div>
      </div>
    </div>

    <!-- 資料表格 -->
    <div
      v-if="jsonData.length"
      class="overflow-auto h-full border border-white/20 rounded-md bg-white/10"
    >
      <table class="min-w-full border-collapse text-gray-100">
        <thead class="bg-indigo-900/50 sticky top-0">
          <tr>
            <th class="border border-white/20 px-4 py-2 text-left">#</th>
            <th class="border border-white/20 px-4 py-2 text-left">五通號</th>
            <th class="border border-white/20 px-4 py-2 text-left">錯誤原因</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in jsonData" :key="index" class="even:bg-white/5 odd:bg-white/10">
            <td class="border border-white/20 px-4 py-2">{{ index + 2 }}</td>
            <td
              class="border border-white/20 px-4 py-2"
              :class="{ 'border-red-500 bg-red-900/30': errors[index] }"
              :title="errors[index]"
            >
              {{ row['五通號'] || '' }}
            </td>
            <td
              class="border border-white/20 px-4 py-2 text-red-400 font-medium"
              v-if="errors[index]"
            >
              {{ errors[index] }}
            </td>
            <td v-else class="border border-white/20 px-4 py-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next'
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const fileName = ref('')
const jsonData = ref([])
const errors = ref({})

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
  if (idx !== 18) return '「~」前必須有18個字'
  if (str.length - idx - 1 !== 4) return '「~」後必須有4個字'
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
}
</script>

<style scoped>
td.border-red-500 {
  position: relative;
  cursor: help;
}
</style>
