<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/index">
      <span>推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank">
      <span>排行</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer">
      <span>歌手</span>
    </router-link>
  </div>
</template>


<script>
export default {};
</script>
<style lang="less" scope>
.tab {
  background-color: rgb(212, 68, 57);
  display: flex;
  line-height: 44px;
  height: 44px;
  width: 100%;
  font-size: 14px;
  .tab-item {
    flex: 1;
    color: #e4e4e4;
    text-align: center;
  }
  span {
    padding-bottom: 3px;
  }
  .router-link-active {
    span {
      font-weight: bold;
      color: rgb(228, 228, 228);
      border-bottom: 2px solid rgb(228, 228, 228);
    }
  }
}
</style>
