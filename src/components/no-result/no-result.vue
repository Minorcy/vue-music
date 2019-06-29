<template>
  <div class="no-result">
    <div class="no-result-icon">
      <i class="iconfont icon-wangyiyunyinle1"></i>
    </div>
    <p class="no-result-text">{{title}}</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped lang="less" >
.no-result {
  text-align: center;
  .no-result-icon {
    .icon-wangyiyunyinle1 {
      color: #d44439;
      font-size: 50px;
    }
  }
  .no-result-text {
    margin-top: 30px;
    font-size: 16px;
    color: #2e3030;
  }
}
</style>
