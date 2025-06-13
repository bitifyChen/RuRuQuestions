export const path = () => [
  {
    name: 'Excel檢查功能',
    path: '/excelCheck'
  },
  {
    name: 'Excel檢查功能(工廠版本)',
    path: '/excelCheck2'
  },
  {
    name: '日期間距計算功能',
    path: '/dateCalculation'
  }
]

export const getMenuName = (routerPath) => path().find((item) => item.path === routerPath)?.name
