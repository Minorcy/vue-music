<template>
  <div class="header">
    <h1 class="h-text">MINORCY</h1>
    <router-link to="/user" class="h-mine" tag="div">
      <i class="iconfont icon-mulu"></i>
    </router-link>
    <router-link to="/search" class="h-search" tag="div">
      <i class="iconfont icon-sousuo"></i>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.header {
  position: relative;
  height: 44px;
  width: 100%;
  text-align: center;
  background-color: rgb(212, 68, 57);
  .h-text {
    font-weight: 700;
    font-size: 26px;
    line-height: 44px;
    color: rgb(241, 241, 241);
    letter-spacing: 3px;
    margin: 0;
  }
  .h-mine {
    position: absolute;
    top: -1.5px;
    left: 0;
    .iconfont {
      display: block;
      padding: 11px;
      font-size: 22px;
      color: rgb(241, 241, 241);
    }
  }
  .h-search {
    position: absolute;
    top: 0;
    right: 2px;
    .iconfont {
      display: block;
      padding: 10px;
      font-size: 24px;
      color: rgb(241, 241, 241);
    }
  }
}
</style>

