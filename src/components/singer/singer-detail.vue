<template>
  <transition name="slide">
    <div class="music-list">
      <div class="header" ref="header">
        <div class="back" @click="back">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <div class="text">
          <h1 class="title">{{headerTitle}}</h1>
        </div>
      </div>
      <scroll
        class="list"
        :probe-type="probeType"
        @scroll="scroll"
        :listen-scroll="listenScroll"
        :data="listDetail"
        ref="list"
      >
        <div class="music-list-wrapper" ref="music">
          <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="filter"></div>
            <div class="text">
              <h2 class="list-title">{{title}}</h2>
            </div>
          </div>
          <div class="song-list-wrapper">
            <div class="sequence-play" v-show="listDetail.length" @click="sequence">
              <i class="iconfont icon-bofang"></i>
              <span class="text">播放全部</span>
              <span class="count">（共{{listDetail.length}}首）</span>
            </div>
          </div>
          <song-list @select="selectItem" :songs="listDetail"></song-list>
        </div>
        <div class="loading-content">
          <loading></loading>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script>
import { getSingerDetail } from "../../api/singer.js";
import { createSong } from "../../common/js/song.js";
import Scroll from "../scroll/scroll";
import SongList from "../song-list/song-list";
import Loading from "../loading/loading";
import { mapGetters, mapActions } from "vuex";
import { playlistMixin } from "../../common/js/mixin";

const RESERVED_HEIGHT = 44;
export default {
  mixins: [playlistMixin],
  props: {
    songs: {
      type: Array
    }
  },
  data() {
    return {
      listDetail: [],
      scrollY: 0,
      node: null,
      headerTitle: "歌手"
    };
  },
  created() {
    this._getDetail();
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
  },
  computed: {
    headerTitleTouchDown() {
      let name = "";
      if (this.singer.aliaName) {
        name = this.singer.name + ` (${this.singer.aliaName})`;
      } else {
        name = this.singer.name;
      }
      return name;
    },
    bgStyle() {
      return `background-image: url(${this.singer.avatar})`;
    },
    title() {
      return this.headerTitleTouchDown;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;

      this.$refs.list.refresh();
    },
    sequence() {
      let list = this.listDetail;
      this.sequencePlay({
        list: list
      });
    },
    selectItem(item, index) {
      this.selectPlay({ list: this.listDetail, index });
    },
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
      }
      getSingerDetail(this.singer.id).then(res => {
        this.node = res.data.hotSongs;
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        ret.push(createSong(item));
      });
      return ret;
    },

    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    ...mapActions(["selectPlay", "sequencePlay"])
  },
  watch: {
    node(val) {
      this.listDetail = this._normalizeSongs(val);
    },
    scrollY(newY) {
      // let translateY = Math.max(this.minTranslateY, newY)
      const percent = Math.abs(newY / this.imageHeight);
      if (newY < this.minTranslateY + RESERVED_HEIGHT - 20) {
        this.headerTitle = this.headerTitleTouchDown;
      } else {
        this.headerTitle = "歌手";
      }
      if (newY < 1) {
        this.$refs.header.style.background = `rgba(212, 68, 57, ${percent})`;
      } else {
        this.$refs.header.style.background = `rgba(212, 68, 57, 0)`;
      }
      // console.log(this.minTranslateY + RESERVED_HEIGHT)
      // if (translateY )
      // console.log(translateY)
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
};
</script>

<style lang="less" scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter,
.slide-leave-to {
  transform: translate3d(50%, 0, 0);
  opacity: 0;
}
.loading-content {
  width: 100%;
  height: 100%;
}
.music-list {
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f2f3f4;
  .header {
    position: fixed;
    top: 0;
    width: 100%;
    height: 44px;
    color: #fff;
    z-index: 100;

    .back {
      position: absolute;
      top: 10px;
      left: 4px;
      .icon-fanhui {
        padding: 10px 10px;
        font-size: 20px;
      }
    }
    .text {
      position: absolute;
      left: 38px;
      line-height: 44px;
      font-size: 17px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #f2f3f4;
    .music-list-wrapper {
      .bg-image {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 75%;
        transform-origin: top;
        background-size: cover;
        background-position: 0 30%;
        .filter {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: black;
          opacity: 0.2;
        }
        .text {
          position: absolute;
          width: 80%;
          height: 40px;
          bottom: 40px;
          left: 20px;
          color: #fff;
          .list-title {
            position: absolute;
            bottom: 0;
            font-size: 17px;
            line-height: 18px;
            font-weight: bold;
            letter-spacing: 1px;
          }
        }
      }
      .song-list-wrapper {
        padding: 41px 0 0px 0;
        border-radius: 10px;
        position: relative;
        top: -20px;
        background: #f2f3f4;
        .sequence-play {
          position: absolute;
          // left: 8;
          top: 0px;
          display: flex;
          align-items: center;
          width: 100%;
          height: 40px;
          padding-left: 16px;
          border-bottom: 1px solid rgb(228, 228, 228);
          .iconfont {
            font-size: 18px;
            color: #2e3030;
            padding-right: 14px;
          }
          .text {
            font-size: 16px;
          }
          .count {
            font-size: 14px;
            color: #757575;
          }
        }
      }
    }
  }
}
</style>

