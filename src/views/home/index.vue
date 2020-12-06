<template>
  <div class="welcome">
    <div class="container">
      <h1 class="effect1">{{ `欢迎使用${title}` }}</h1>
      <p class="text">have a nice day ☺</p>
    </div>

    <section>
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
      <div class="item" />
    </section>
  </div>
</template>
<script>
import anime from 'animejs'
import defaultSettings from '@/settings'
export default {
  name: 'Home',
  data() {
    return {
      siteName: sessionStorage.getItem('siteName'),
      title: defaultSettings.title
    }
  },
  beforeRouteEnter(to, from, next) {
    const view = {
      fullPath: '/home',
      hash: '',
      matched: Array(2),
      meta: {
        icon: 'dashboard',
        title: '首页'
      },
      name: '首页',
      params: Object,
      path: '/home',
      query: Object,
      redirectedFrom: '/',
      title: '首页'
    }
    next(vm => {
      // if (vm.$store.state.user.roles.Dashboard) {
      vm.$store.dispatch('tagsView/delView', view)
      // }
    })
  },
  mounted() {
    const tl = anime.timeline({
      easing: 'easeOutExpo',
      duration: 850
    })

    tl.add({
      targets: 'section .item',
      width: '100%',
      backgroundColor: '#fff',
      delay: anime.stagger(100)
    })

    tl.add({
      targets: 'section .item',
      delay: anime.stagger(70),
      width: '97%',
      backgroundColor: '#eee'
    })

    tl.add({
      targets: 'section .item',
      backgroundColor: '#FFFFFF',
      delay: anime.stagger(50, { from: 'center' })
    })

    tl.add(
      {
        targets: '.text',
        top: '40%',
        duration: 4500,
        opacity: 1
      },
      '-=1000'
    )
    var textWrapper = document.querySelector('.effect1')
    textWrapper.innerHTML = textWrapper.textContent.replace(
      /([^.\s]|\w)/g,
      "<span class='letter'>$&</span>"
    )

    anime.timeline().add(
      {
        targets: '.effect1 .letter',
        scale: [5, 1],
        opacity: [0, 1],
        translateZ: 0,
        easing: 'easeOutExpo',
        duration: 1350,
        delay: function(el, i) {
          return 70 * i
        }
      },
      1500
    )
  }
}
</script>
<style scoped lang="scss">
body {
  margin: 0;
  height: 80vh;
  overflow: hidden;
}
.container {
  width: 100%;
  display: flex;
  justify-content: center;
  text-align: center;
}

.effect1 {
  position: absolute;
  margin: 0;
  top: 30%;
  font-size: 2.3em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  z-index: 3;
  color: #304156;
  @media screen and (max-width: 1024px) {
    font-size: 1.5em;
  }
}

.text {
  position: absolute;
  font-size: 1.8em;
  text-transform: uppercase;
  letter-spacing: 5px;
  color: #304156;
  font-weight: 100;
  z-index: 3;
  opacity: 0;
  top: 50%;
  @media screen and (max-width: 1024px) {
    font-size: 1.3em;
  }
}

section {
  display: grid;
  grid-template-columns: repeat(10, auto);
}

.item {
  background-color: #2b2f3a;
  height: 90vh;
  z-index: 0;
}
</style>
