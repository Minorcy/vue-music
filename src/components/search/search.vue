<template>
  <transition name="search">
    <div class="search" ref="searchWrapper">
      <div class="search-box-wrapper">
        <i class="iconfont icon-fanhui" @click="back"></i>
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
      <scroll
        class="search-scroll-wrapper"
        ref="scroll"
        :pullup="pullup"
        :beforeScroll="beforeScroll"
        @scrollToEnd="searchMore"
        @beforeScroll="listScroll"
      >
        <div ref="search">
          <div class="search-hots" v-show="!query">
            <p class="title">热门搜索</p>
            <span
              v-for="(item,index) in searchHot"
              class="search-hots-item"
              @click="addQuery(item.first)"
            >{{item.first}}</span>
          </div>
          <div class="shortcut-wrapper" v-show="!query">
            <div class="search-history" v-show="searchHistory.length">
              <h1 class="title">
                <p class="text">搜索历史</p>
                <span class="clear" @click="showConfirm">
                  <i class="iconfont icon-icons-"></i>
                </span>
              </h1>
              <search-list
                :searches="searchHistory"
                @select="addQuery"
                @delete="deleteSearchHistory"
              ></search-list>
            </div>
          </div>
          <div class="search-result">
            <suggest :query="query" ref="suggest" @refresh="refresh" @select="saveSearch"></suggest>
          </div>
        </div>
      </scroll>
      <confirm ref="confirm" text="是否清空全部历史记录?" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import SearchBox from "./search-box";
import Scroll from "../scroll/scroll";
import Suggest from "../suggest/suggest";
import SearchList from "./search-list";
import Confirm from "../confirm/confirm";
import { getSearchHot } from "../../api/search.js";
import { mapActions, mapGetters } from "vuex";
import { playlistMixin } from "../../common/js/mixin";
export default {
  mixins: [playlistMixin],
  data() {
    return {
      searchHot: [],
      query: "",
      pullup: true,
      beforeScroll: true
    };
  },
  created() {
    this._getSearchHot();
  },
  computed: {
    ...mapGetters(["searchHistory"])
  },
  methods: {
    back() {
      this.$router.back();
      this.$refs.searchBox.clear();
    },
    _getSearchHot() {
      getSearchHot().then(res => {
        this.searchHot = res.data.result.hots;
        // console.log(this.searchHot);
      });
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    onQueryChange(query) {
      this.query = query;
    },
    searchMore() {
      this.$refs.suggest.searchMore();
    },
    refresh() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);
    },
    listScroll() {
      this.$refs.searchBox.blur();
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    deleteSearchHistory() {
      this.deleteSearchHistory(item);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    clearSearchHistory() {
      this.clearSearchHistory();
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.searchWrapper.style.bottom = bottom;
      this.refresh();
    },
    refresh() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);
    },
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory",
      "clearSearchHistory"
    ])
  },
  components: {
    SearchBox,
    Scroll,
    Suggest,
    SearchList,
    Confirm
  }
};
</script>

<style lang="less" scoped>
.search-enter-active,
.search-leave-active {
  transition: all 0.3s;
}
.search-enter,
.search-leave-to {
  transform: translate3d(50%, 0, 0);
  opacity: 0;
}
.search {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  z-index: 100;
  background: #f2f3f4;
  .search-box-wrapper {
    padding: 10px 40px 10px 43px;
    background: rgb(212, 68, 57);
    .iconfont {
      position: absolute;
      left: 0px;
      top: 7px;
      padding: 3px 10px;
      font-size: 20px;
      color: #fff;
    }
  }
  .search-scroll-wrapper {
    height: 100%;
    overflow: hidden;
    .search-hots {
      margin: 0 20px;
      .title {
        padding: 15px 5px 0 5px;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: #757575;
      }
      span {
        display: inline-block;
        padding: 3px 5px;
        margin: 4px 4px;
        border: 0.8px solid #c7c7c7;
        border-radius: 5px;
        line-height: 20px;
        color: #2e3030;
        font-size: 14px;
      }
    }
    .shortcut-wrapper {
      position: relative;
      // top: 178px
      // bottom: 0
      // width: 90%
      margin: 0 auto;
      .shortcut {
        height: 100%;
        overflow: hidden;
        .hot-key {
          margin: 0 20px 20px 20px;
          .title {
            margin-bottom: 20px;
            font-size: 14px;
            color: #2e3030;
          }
          .item {
            display: inline-block;
            padding: 5px 10px;
            margin: 0 20px 10px 0;
            border-radius: 6px;
            background: rgb(253, 108, 98);
            font-size: 14px;
            color: #2e3030;
          }
        }
      }
      .search-history {
        position: relative;
        margin: 10px 25px;
        .title {
          display: flex;
          align-items: center;
          height: 30px;
          font-size: 12px;
          color: #757575;
          .text {
            // font-size: 13px;
            flex: 1;
          }
          .clear {
            position: relative;
            &:before {
              content: "";
              position: absolute;
              top: -10px;
              left: -10px;
              right: -10px;
              bottom: -10px;
            }
            .iconfont {
              font-size: 18px;
              color: #2e3030;
            }
          }
        }
      }
    }
    .search-result {
      position: relative;
      width: 100%;
      top: 10px;
      bottom: 0;
    }
  }
}
</style>
