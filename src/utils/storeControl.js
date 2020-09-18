export function userInfo() {
  const session = sessionStorage.getItem('store')
  if (!session) { return }
  const store = JSON.parse(session)
  return store.user ? JSON.parse(store.user) : null
}
export function dispathUserInfo(response, commit, reject, resolve) {
  if (!response || response.length <= 0) {
    reject('getInfo: roles must be a non-null array!')
  }
  console.log(response)
  commit('SET_ROLES', response)
  resolve(response)
}

export function backupStore() {
  const state = this.$store.state
  const store = {}
  for (const i in state) {
    try {
      store[i] = JSON.stringify(state[i])
    } catch (error) {
      localStorage.setItem('error', i)
    }
  }
  sessionStorage.setItem('store', JSON.stringify(store))
}

export function restoreStore() {
  const state = JSON.parse(sessionStorage.getItem('store'))
  for (const i in state) {
    state[i] = JSON.parse(state[i])
  }
  this.$store.replaceState(Object.assign({}, this.$store.state, state))
}
