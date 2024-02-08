const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        name: '首页',
        path: '/home',
        component: './Home',
    },
    {
        name: '博客管理',
        path: '/blog',
        routes: [
            {
                name: '文章管理',
                path: '/blog/article',
                component: './Article',
            },
            {
                name: '标签管理',
                path: '/blog/tag',
                component: './Tag',
            },
            {
                name: '分类管理',
                path: '/blog/category',
                component: './Category',
            },
            {
                name: '评论管理',
                path: '/blog/comment',
                component: './Comment',
            },
        ]
    },
    {
        name: '一言管理',
        path: '/poem',
        component: './Poem',
    },
    {
        name: '文件管理',
        path: '/file',
        component: './File',
    },
    {
        name: '访客管理',
        path: '/visitor',
        component: './Visitor',
    },
    {
        name: '错误日志',
        path: '/log',
        component: './Log',
    },
    {
        name: '系统管理',
        path: '/system',
        routes: [
            {
                name: '系统设置',
                path: '/system/setting',
                component: './Setting',
            },
            {
                name: '用户管理',
                path: '/system/user',
                component: './User',
            }
        ],
    },

    {
        name: 'Login',
        path: '/login',
        component: './login',
        layout: false,
    },
]

export default routes