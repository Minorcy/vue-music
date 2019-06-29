<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag" @click="hide">
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="iconfont" :class="iconMode" @click="changeMode"></i>
            <span class="text">
              {{ modeText }}
              (
              <span class="count">{{playlist.length}}</span>)
            </span>
            <span class="clear" @click="showConfirm">
              <i class="iconfont icon-icons-"></i>
            </span>
          </h1>
        </div>
        <scroll
          ref="listContent"
          class="list-content"
          :data="sequenceList"
          :refreshDelay="refreshDelay"
        >
          <transition-group name="list" tag="ul">
            <li
              class="item"
              ref="listItem"
              @click="selectItem(item, index)"
              v-for="(item, index) in sequenceList"
              :key="item.id"
            >
              <i class="current fa iconfont" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="delete" @click.stop="deletOne(item)">
                <i class="iconfont icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
    </div>
  </transition>
</template>

<script>
import Scroll from "../scroll/scroll";
import Confirm from "../confirm/confirm";
import { mapActions, mapGetters, mapMutations } from "vuex";
import { playMode } from "../../common/js/config";
import { shuffle } from "../../common/js/unit";

export default {
  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    };
  },
  computed: {
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random
        ? "随机播放"
        : "单曲循环";
    },
    iconMode() {
      if (this.mode === playMode.sequence) {
        return "icon-cycle";
      } else if (this.mode === playMode.loop) {
        return "icon-danquxunhuan1";
      } else {
        return "icon-suiji";
      }
    },
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      "favoriteList"
    ])
  },
  methods: {
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
      this.$emit("stopMusic");
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "icon-laba";
      }
      return " ";
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        // 找到需要播放的歌曲在播放顺序里面的索引
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      if (!this.playing) {
        this.setPlayingState(true);
      }
      this.setCurrentIndex(index);
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      console.log(this.mode);
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        // 返回 index
        return item.id === this.currentSong.id;
      });
      console.log("index", index);
      this.setCurrentIndex(index);
    },
    deletOne(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
        this.$emit("stopMusic");
      }
    },
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300);
    },
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions(["deleteSong", "deleteSongList"])
  },
  components: {
    Scroll,
    Confirm
  }
};
</script>

<style lang="less" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.3);
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-radius: 8px;
    background-color: #f2f3f4;
    .list-header {
      position: relative;
      padding: 20px 20px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .iconfont {
          margin-right: 10px;
          font-size: 20px;
          color: #757575;
        }
        .text {
          flex: 1;
          font-size: 14px;
          color: #2e3030;
          .count {
            position: relative;
            top: 1px;
          }
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
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        &.list-enter-active,
        &.list-leave-active {
          transition: all 0.1s;
        }
        &.list-enter,
        &.list-leave-to {
          height: 0;
        }
        .icon-laba {
          color: rgb(212, 68, 57);
          margin-right: 5px;
        }
        .text {
          flex: 1;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          line-height: 20px;
          font-size: 14px;
          color: #2e3030;
        }
        .delete {
          position: relative;
          &:before {
            content: "";
            position: absolute;
            top: -10px;
            left: -10px;
            right: -10px;
            bottom: -10px;
          }
          font-size: 11px;
          color: rgb(212, 68, 57);
        }
      }
    }
    .list-close {
      text-align: center;
      line-height: 50px;
      background: #f2f3f4;
      font-size: 16px;
      color: #2e3030;
    }
  }
}
</style>
