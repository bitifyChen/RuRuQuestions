<script setup>
import dayjs from 'dayjs'
import { computed } from 'vue'
import twHoliday from '@/components/dateCalculation/twHoliday.json'
import cnHoliday from '@/components/dateCalculation/cnHoliday.json'
const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  day: {
    required: true,
  },
  workDaysArray: {
    type: Array,
    default: () => [],
  },
  holidayInWorkDaysArray: {
    type: Array,
    default: () => [],
  },
  yearHolidayArray: {
    type: Array,
    default: () => [],
  },
})
const year = computed(() => props.year)
const month = computed(() => props.month)
const day = computed(() => props.day)
const thisDay = computed(() =>
  dayjs(`${year.value}-${month.value}-${day.value}`).format('YYYY-MM-DD')
)
const workDaysArray = computed(() => props.workDaysArray)
const isWorkDay = computed(() => workDaysArray.value.includes(thisDay.value))
const holidayInWorkDaysArray = computed(() => props.holidayInWorkDaysArray)
const isHolidayInWorkDay = computed(() =>
  holidayInWorkDaysArray.value.includes(thisDay.value)
)

//定義的假日
const yearHolidayArray = computed(() => props.yearHolidayArray)
const isHoliday = computed(() => yearHolidayArray.value.includes(thisDay.value))

const tippyNote = computed(() => {
  let html = ``
  if (isHoliday.value) {
    const twYearHoliday = twHoliday[year.value] ?? null
    const cnYearHoliday = cnHoliday[year.value] ?? null
    if (twYearHoliday && Object.keys(twYearHoliday).includes(thisDay.value)) {
      html += `<div style="display:flex;align-items:center"><span style="background:#68BE8D ; margin-right:5px;width: 10px;height: 10px;border-radius: 50%;"></span>台灣：${
        twYearHoliday[thisDay.value]
      }</div>`
    }
    if (cnYearHoliday && Object.keys(cnYearHoliday).includes(thisDay.value)) {
      html += `<div style="display:flex;align-items:center"><span style="background:#ED1C24 ; margin-right:5px;width: 10px;height: 10px;border-radius: 50%;"></span>中國：${
        cnYearHoliday[thisDay.value]
      }</div>`
    }
    if (html === ``) {
      html += `<div style="display:flex;align-items:center"><span style="background:rgb(245, 133, 133) ; margin-right:5px;width: 10px;height: 10px;border-radius: 50%;"></span>周末：假日</div>`
    }
  }
  return html
})
</script>


<template>
  <div
    v-tippy="tippyNote"
    class="day"
    :class="{
      workDays: isWorkDay,
      holiday: isHoliday,
      holidayInWorkDays: isHolidayInWorkDay,
    }"
  >
    {{ day }}
  </div>
</template>



<style lang="scss" scoped>
.card .days .day {
  &.holiday {
    color: rgb(245, 133, 133);
    cursor: pointer;
  }
  &.workDays {
    background-color: rgb(57, 82, 224);
    color: white;
    cursor: pointer;
  }
  &.holidayInWorkDays {
    background-color: rgb(245, 133, 133);
    color: white;
    cursor: pointer;
  }
}
</style>