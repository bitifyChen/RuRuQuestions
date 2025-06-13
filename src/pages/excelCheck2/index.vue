<script setup>
import { AlertTriangle } from 'lucide-vue-next'
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const fileName = ref('')
const jsonData = ref([])


// 用 computed 合併成一個渲染用陣列
const showOnlyErrors = ref(false)
const tableRows = computed(() => {
  return jsonData.value.map((row, idx) => ({
    originalIndex: idx, // 原始陣列的 index (若未排序時同 idx)
    displayIndex: idx + 2, // 你表格裡顯示的行號（從 2 開始）
    ...row,
  })).filter(row => !showOnlyErrors.value || row.error)
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
  if (str.length !== 18) return '五通號欄位長度必須為 18'
  return ''
}

// 建立欄位對應欄位順序的 Map
function getHeaderMap(worksheet) {
  const headers = {}
  const range = XLSX.utils.decode_range(worksheet['!ref'])

  const firstRow = range.s.r // 一般是 0
  for (let col = range.s.c; col <= range.e.c; ++col) {
    const cellAddress = XLSX.utils.encode_cell({ r: firstRow, c: col })
    const cell = worksheet[cellAddress]
    if (cell && cell.v) {
      headers[cell.v] = col // key 為欄位名稱，value 為欄位 index
    }
  }
  return headers
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  fileName.value = file.name

  const reader = new FileReader()
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result)
    const workbook = XLSX.read(data, { type: 'array' })

    const allRows = []

    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName]
      fillMergedCells(worksheet)
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' })
      const headerMap = getHeaderMap(worksheet) // 對應欄位順序
      
      json.forEach((row, rowIdx) => {
        const rowData = {
          sheet: sheetName,
          originalIndex: rowIdx,
          displayIndex: rowIdx + 2, // Excel 預設從第2列開始
          ...row
        }

        Object.entries(row).forEach(([key, value]) => {
          if (key.includes('五通號')) {
            const err = validateWuTong(value)
            if(value)allRows.push({
                sheet: sheetName,
                rowIndex: rowIdx + 2, // 真實 Excel 行數
                value: value,
                message: '1212',
                error:validateWuTong(value)
              })
          }
        })
      })
    })

    jsonData.value = allRows
  }

  reader.readAsArrayBuffer(file)
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
            {{ jsonData.filter((item) => item.error).length }}
          </div>
        </div>
      </div>
    </div>
  
    <!-- 資料表格 -->
    <div class=""   v-if="jsonData.length">
      <el-button type="danger" round @click="showOnlyErrors = !showOnlyErrors" v-show="!showOnlyErrors">只顯示錯誤</el-button>
      <el-button type="primary" round @click="showOnlyErrors = !showOnlyErrors" v-show="showOnlyErrors">顯示所有</el-button>
    </div>
    <div
      v-if="jsonData.length"
      class="overflow-auto border border-white/40 rounded-2xl bg-white/30 backdrop-blur-md shadow-lg"
    >
      <table class="min-w-full border-collapse text-gray-800">
        <thead class="bg-purple-200/50 sticky top-0 text-gray-800 text-sm">
          <tr>
            <th class="border border-white/20 px-4 py-2 text-left">分頁</th>
            <th class="border border-white/20 px-4 py-2 text-left">位置</th>
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
              {{ row.sheet }}
            </td>
            <td  class="border border-white/20 px-4 py-2 font-black"
              :class="{ 'border-red-500 text-red-700 font-black': row.error }">{{ row.rowIndex }}</td>
            <td
              class="border border-white/20 px-4 py-2"
              :class="{ 'border-red-500 bg-red-200/30 text-red-700 font-black': row.error }"
              :title="row.error"
            >
              {{ row.value || '' }}
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
