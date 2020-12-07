<template>
  <div id="app">
    <router-view />
    <back-top />
  </div>
</template>

<script>
import { backupStore, restoreStore } from '@/utils/storeControl'
import BackTop from '@/components/BackToTop/index'
export default {
  name: 'App',
  components: { BackTop },
  created() {
    this.restoreStore()
  },
  mounted() {
    const event = ['iPad', 'iPhone', 'iPod'].includes(navigator.platform) ? 'pagehide' : 'beforeunload'
    window.addEventListener(event, () => {
      this.backupStore()
    })
  },
  methods: { backupStore, restoreStore }
}
</script>
