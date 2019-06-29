<template>
  <div class="rank" ref="rank">
    <scroll class="toplist" ref="scroll" :data="toplist">
      <ul>
        <li class="item" v-for="item in toplist" :key="item.id" @click="selectItem(item)">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.coverImgUrl">
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.top">
              <span>{{index +1 }}</span>
              <span>{{song.name}}-{{song.ar[0].name}}</span>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>

    <div v-show="!toplist.length" class="loading-container">
      <loading></loading>
    </div>
    <router-view></router-view>
  </div>
</template>
 

<script>
import { getToplist } from "../../api/rank.js";
import { playlistMixin } from "../../common/js/mixin";
import Scroll from "../scroll/scroll";
import Loading from "../loading/loading";
import { mapMutations } from "vuex";

const MINORCY_TOP = [0, 1, 2, 3, 4, 5, 6, 17, 18, 22, 23];
export default {
  mixins: [playlistMixin],
  data() {
    return {
      toplist: []
    };
  },
  created() {
    this._getToplist();
  },
  methods: {
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.rank.style.bottom = bottom;
      this.$refs.scroll.refresh();
    },
    _getToplist() {
      for (var i = 0; i < MINORCY_TOP.length; i++) {
        var id = MINORCY_TOP[i];
        getToplist(id).then(res => {
          let list = res.data.playlist;
          list.top = res.data.playlist.tracks.slice(0, 3);
          this.toplist.push(list);
        });
      }
    },
    selectItem(item) {
      this.$router.push({
        path: `/rank/:${item.id}`
      });
      this.setTopList(item);
    },
    ...mapMutations({ setTopList: "SET_TOP_LIST" })
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="less" scoped>
.rank {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist {
    height: 100%;
    overflow: hidden;
    padding-top: 5px;
    .item {
      display: flex;
      margin: 0 10px;
      padding: 3px 0;
      height: 100px;
      border-bottom: 1px solid rgb(228, 228, 228);
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0, 0, 100px;
        width: 100px;
        height: 100px;
        img {
          border-radius: 3px;
        }
      }
      .songlist {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        color: #2e3030;
        font-size: 12px;
        .song {
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          line-height: 30px;
        }
      }
    }
    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .loading-content {
    position: fixed;
    width: 100%;
    top: 70%;
    transform: translateY(-50%);
  }
}
</style>

