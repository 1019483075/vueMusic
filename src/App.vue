<template>
  <div id="app">
    <m-header></m-header>
    <m-tab></m-tab>
    <keep-alive><!--将dom信息缓存到内存中 不会因为每切换一次就加载一次信息-->
    <router-view></router-view>
    </keep-alive>
    <m-player></m-player>
  </div>
</template>

<script>
import MHeader from './components/m-header/m-header'
import Tab from './components/tab/tab'
import Player from '../src/components/player/player'
export default {
  name: 'app',
  data() { return {} },
  components: {
    'm-header': MHeader,
    'm-tab': Tab,
    'm-player': Player
  }
}
</script>

<style scoped="scoped" lang="stylus" style="stylesheet/stylus">

</style> 
