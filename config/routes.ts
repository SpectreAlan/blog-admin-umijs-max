const routes = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        name: '首页',
        path: '/home',
        component: './Home',
    },
    {
        name: '用户管理',
        path: '/user',
        component: './User',
    },
    {
        name: '一言管理',
        path: '/poem',
        component: './Poem',
    },
    {
        name: '标签管理',
        path: '/tag',
        component: './Tag',
    },
    {
        name: '分类管理',
        path: '/category',
        component: './Category',
    },
    {
        name: 'Login',
        path: '/login',
        component: './login',
        layout: false,
    },
]

export default routes