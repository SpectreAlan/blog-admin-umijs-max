<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { backupStore, restoreStore } from '@/utils/storeControl'
export default {
  name: 'App',
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
