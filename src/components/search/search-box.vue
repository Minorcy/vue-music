<template>
  <div class="search-box">
    <input ref="input" type="text" class="box" :placeholder="placeholder" v-model="query">
    <i class="iconfont icon-Delete" v-show="query" @click="clear"></i>
  </div>
</template>

<script>
import { debounce } from "../../common/js/unit";
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  created() {
    this.$watch(
      "query",
      debounce(newQuery => {
        this.$emit("query", newQuery);
      }, 400)
    );
  },
  methods: {
    clear() {
      this.query = "";
    },
    setQuery(query) {
      this.query = query;
    },
    blur() {
      this.$refs.input.blur();
    }
  }
};
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 25px;
  border-bottom: 1px solid rgb(235, 235, 235);
  .box {
    flex: 1;
    line-height: 25px;
    background: rgb(212, 68, 57);
    color: #fff;
    font-size: 15px;
    border: none;
    outline: medium;
    &::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .iconfont {
    position: absolute;
    right: 12px;
    font-size: 20px;
    color: #fff;
    border: none;
  }
  .search {
    padding: 0 5px;
    font-size: 14px;
    color: #2e3030;
  }
}
</style>
