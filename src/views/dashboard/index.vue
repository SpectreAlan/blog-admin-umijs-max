<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    this.currentRole = 'editorDashboard'
    for (let i = 0; i < this.roles.length; i++) {
      if (this.roles[i].key === 'dashboard') {
        this.currentRole = 'adminDashboard'
        break
      }
    }
  }
}
</script>
