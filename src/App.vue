<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    const o = JSON.parse(sessionStorage.getItem('o'))
    for (const i in o) {
      o[i] = JSON.parse(o[i])
    }
    this.$store.replaceState(Object.assign({}, this.$store.state, o))
  },
  mounted() {
    const event = ['iPad', 'iPhone', 'iPod'].includes(navigator.platform) ? 'pagehide' : 'beforeunload'
    window.addEventListener(event, () => {
      const state = this.$store.state
      const o = {}
      for (const i in state) {
        o[i] = JSON.stringify(state[i])
      }
      sessionStorage.setItem('o', JSON.stringify(o))
    })
  }
}
</script>
