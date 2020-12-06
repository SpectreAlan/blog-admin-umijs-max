import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/layout'

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'chart', affix: true, key: 'dashboard' }
      }
    ]
  },
  {
    path: '/admin',
    component: Layout,
    redirect: '/admin/users',
    name: 'Admin',
    meta: {
      title: '系统管理',
      icon: 'administrator'
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/admin/users'),
        name: 'Users',
        meta: {
          title: 'Users',
          key: 'users'
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/admin/menu/index'),
        name: 'Menu',
        meta: {
          title: 'Menus',
          key: 'menu'
        }
      },
      {
        path: 'role',
        component: () => import('@/views/admin/role'),
        name: 'Role',
        meta: {
          title: 'Roles',
          key: 'role'
        }
      }
    ]
  },
  {
    path: '/settings',
    component: Layout,
    redirect: '/settings/basic',
    name: 'Settings',
    meta: {
      title: '系统设置',
      icon: 'setting'
    },
    children: [
      {
        path: 'basic',
        component: () => import('@/views/settings/basic'),
        name: 'Basic',
        meta: {
          title: 'BasicSetting',
          key: 'basic'
        }
      },
      {
        path: 'images',
        component: () => import('@/views/settings/images'),
        name: 'Images',
        meta: {
          title: '图片管理',
          key: 'images'
        }
      }
    ]
  },
  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/article',
    name: 'Blog',
    meta: {
      title: '博客系统',
      icon: 'write'
    },
    children: [
      {
        path: 'article',
        component: () => import('@/views/blog/article'),
        name: 'Article',
        meta: {
          title: 'Article',
          key: 'article'
        }
      },
      {
        path: 'write',
        component: () => import('@/views/blog/write'),
        name: 'Write',
        meta: {
          title: 'Write',
          key: 'write'
        }
      },
      {
        path: 'tags',
        component: () => import('@/views/blog/tags'),
        name: 'Tags',
        meta: {
          title: 'Tags',
          key: 'tags'
        }
      },
      {
        path: 'category',
        component: () => import('@/views/blog/category'),
        name: 'Category',
        meta: {
          title: 'Category',
          key: 'category'
        }
      },
      {
        path: 'comment',
        component: () => import('@/views/blog/comment'),
        name: 'Comment',
        meta: {
          title: 'Comment',
          key: 'comment'
        }
      },
      {
        path: 'gallery',
        component: () => import('@/views/blog/gallery'),
        name: 'Gallery',
        meta: {
          title: 'Gallery',
          key: 'gallery'
        }
      },
      {
        path: 'poem',
        component: () => import('@/views/blog/poem'),
        name: 'Poem',
        meta: {
          title: '一言',
          key: 'poem'
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
