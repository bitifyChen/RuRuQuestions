export const path = () =>[
    {
        name:'Excel檢查功能',
        path:'/excelCheck'
    }
]

export const getMenuName = (routerPath) => path().find(item => item.path === routerPath)?.name