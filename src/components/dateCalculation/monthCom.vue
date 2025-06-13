<script setup>
import dayjs from 'dayjs'
import { computed } from 'vue'

const props = defineProps({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  startDate: {
    type: String,
    default: null,
  },
  workDays: {
    type: Number,
    default: 0,
  },
  yearHolidayArray: {
    type: Array,
    default: () => [],
  },
})
const year = computed(() => props.year)
const month = computed(() => props.month)
const startDate = computed(() => props.startDate)
const workDays = computed(() => props.workDays)
//月歷生成
const header = computed(() => ['日', '一', '二', '三', '四', '五', '六'])
const daysInMonth = computed(() =>
  dayjs(`${year.value}-${month.value}`).daysInMonth()
)
const firstDayOfWeek = computed(() =>
  dayjs(`${year.value}-${month.value}`).startOf('month').day()
)
const daysArray = computed(() => [
  ...Array(firstDayOfWeek.value),
  ...Array(daysInMonth.value)
    .keys()
    .map(i => i + 1),
])
//本月假日
const yearHolidayArray = computed(() => props.yearHolidayArray)

//計算工作日
const calcDaysArray = computed(() => {
  const workDaysArr = []
  const holidayArr = []
  const _startDate = dayjs(startDate.value)
  let _workDays = workDays.value
  for (let i = 0; i < _workDays; i++) {
    const _date = _startDate.add(i, 'day').format('YYYY-MM-DD')
    if (yearHolidayArray.value.includes(_date)) {
      holidayArr.push(_date)
      _workDays++
    } else {
      workDaysArr.push(_date)
    }
  }
  return { workDaysArr, holidayArr }
})
const workDaysArray = computed(() => calcDaysArray.value.workDaysArr)
const holidayInWorkDaysArray = computed(() => calcDaysArray.value.holidayArr)
</script>


<template>
  <div class="card" :key="year">
    <div class="month">{{ month }}月</div>
    <div class="days">
      <div class="header">
        <div class="day" v-for="day in header" :key="day">{{ day }}</div>
      </div>
      <div class="body">
        <DayCom
          v-for="(day, index) in daysArray"
          :key="index"
          :year="year"
          :month="month"
          :day="day"
          :workDaysArray="workDaysArray"
          :holidayInWorkDaysArray="holidayInWorkDaysArray"
          :yearHolidayArray="yearHolidayArray"
        />
      </div>
    </div>
  </div>
</template>


<style lang="scss" scoped>
.card {
  padding: 10px;
  .month {
    font-weight: 700;
    text-align: center;
    color: #4e5255;
  }
  .days {
    .header {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-column-gap: 2px;
      grid-row-gap: 2px;
      margin-bottom: 5px;
      color: #70757a;
      font-size: 12px;
    }
    .body {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      grid-column-gap: 2px;
      grid-row-gap: 2px;
    }
    .day {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 24px;
      width: 24px;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 700;
      color: #70757a;
    }
  }
}
</style>