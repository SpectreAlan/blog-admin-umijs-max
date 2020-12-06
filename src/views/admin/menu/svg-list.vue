<template>
  <div class="svg">
    <svg-icon v-for="(k,i) in list" :key="i" :icon-class="k" @click="choose(k)" />
  </div>
</template>

<script>
export default {
  name: 'SvgList',
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    choose(name) {
      this.$emit('setIcon', name)
    }
  }
}
</script>

<style scoped lang="scss">
  .svg {
    background: #2b2f3a;
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    border-radius: 8px;
    .svg-icon {
      cursor: pointer;
      margin: 0 30px 30px 0;
      font-size: 30px;
      color: #fff;
    }
  }

</style>
