<template>
  <div class="loading">
    <img src="./loading.gif" width="24" height="24">
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "????..."
    }
  }
};
</script>

<style lang="less" scoped>
.loading {
  width: 100%;
  height: 40px;
  text-align: center;
  img {
    margin-top: 10px;
  }
}
</style>
