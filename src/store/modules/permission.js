import { asyncRoutes, constantRoutes } from '@/router'

const state = {
  routes: [],
  addRoutes: []
}
const actions = {
  setRoutes({ commit }, data) {
    commit('SET_ROUTES', ...data)
  },
  resetRoutes({ commit }) {
    commit('RESET_PERMISSION')
  },
  generateRoutes({ commit }, menus) {
    return new Promise(resolve => {
      const originRoutes = [...asyncRoutes]
      let routes = []
      originRoutes.map(route => {
        if (route.children) {
          const list = [...route.children]
          routes = [...routes, ...list]
        }
        routes.push({ ...route })
      })
      const accessedRoutes = filterAsyncRoutes(routes, menus)
      // const arr = accessedRoutes.filter(i => !i.children || i.children.length > 0)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = [...constantRoutes, ...routes]
  }
}

export function filterAsyncRoutes(routes, menus) {
  const res = []
  menus.forEach(menu => {
    const tmp = setRoute(routes, { ...menu })
    if (tmp) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(routes, [...tmp.children])
      }
      res.push(tmp)
    }
  })
  res.sort((a, b) => a.meta.sort - b.meta.sort)
  return res
}
function setRoute(routes, menu) {
  const targetRoute = routes.filter(item => menu.key === item.meta.key)[0]
  if (targetRoute) {
    const menuInfo = {
      path: targetRoute.path,
      component: targetRoute.component,
      name: targetRoute.name,
      redirect: targetRoute.redirect,
      meta: { title: menu.title, icon: targetRoute.meta.icon, sort: menu.sort },
      children: menu.list
    }
    for (const key in menuInfo) {
      if (!menuInfo[key]) {
        delete menuInfo[key]
      }
    }
    return menuInfo
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
