<template>
  <div id="app">
    <mheader></mheader>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>
<script>
import Mheader from "./components/m-header/Header.vue";
import Tab from "./components/tab/tab.vue";
import Player from "./components/player/player.vue";
export default {
  components: {
    Mheader,
    Tab,
    Player
  }
};
</script>

<style lang="less">
@import "./common/css/reset.css";
#app {
  position: fixed;
  top: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
