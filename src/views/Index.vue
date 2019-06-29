<template>
  <div class="index" ref="index">
    <scroll class="index-content" ref="scroll" :data="playList">
      <div>
        <m-swipe class="swipe" v-if="banner.length">
          <div v-for="item in banner" :key="item.id">
            <a :href="item.url">
              <img @load="loadImage" :src="item.picUrl">
            </a>
          </div>
        </m-swipe>
        <div class="components-list">
          <h1 class="title">热门推荐</h1>
          <ul>
            <li class="item" v-for="item in playList" :key="item.id">
              <div class="icon">
                <div class="gradients"></div>
                <img v-lazy="item.picUrl">
              </div>
              <div>
                <p class="play-count">{{Math.floor(item.playCount / 10000) }}万</p>
              </div>
              <div class="text">
                <p class="name">{{item.name}}</p>
              </div>
            </li>
          </ul>
        </div>
        <!-- <div class="recommend-song">
          <h1 class="title">热门歌曲</h1>
          <ul>
            <li class="item" v-for="item in recommendMusic" :key="item.id">
              <div class="icon">
                <img v-lozy="item.image">
              </div>
              <p class="text">{{item.name}}</p>
              <p class="singer">{{item.singer}}</p>
            </li>
          </ul>
        </div>-->
      </div>
      <div class="loading-container" v-show="!playList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import loading from "../components/loading/loading";
import Scroll from "../components/scroll/scroll";
import Swipe from "../components/swipe/slider";
import {
  getBanner,
  getRecommendList,
  getRecommendMusic,
  ERR_OK
} from "../api/recommend.js";
import Header from "../components/m-header/Header.vue";
import Tab from "../components/tab/tab.vue";
export default {
  name: "Index",
  data() {
    return {
      banner: [],
      playList: [],
      recommendMusic: []
    };
  },
  components: {
    "m-swipe": Swipe,
    Scroll,
    loading
  },
  created() {
    // this.getBanner();
    // this.getRecommend();
    // this.getrecommendMusic();

    this.banner = JSON.parse(localStorage.getItem("Banner"));

    this.playList = JSON.parse(localStorage.getItem("playList"));

    this.recommendMusic = JSON.parse(localStorage.getItem("recommendMusic"));
  },
  methods: {
    getBanner() {
      this.$http
        .get("http://120.79.162.149:3000/banner")
        .then(res => {
          let list = res.data.banners;

          this.banner = list.splice(4);
          localStorage.setItem("Banner", JSON.stringify(list));
        })
        .then(err => {
          console.log(err);
        });
      getBanner().then(res => {
        let list = res.data.banners;

        this.banner = list.splice(4);
        localStorage.setItem("Banner", JSON.stringify(list));
      });
    },
    getRecommend() {
      getRecommendList().then(res => {
        if (res.status === ERR_OK) {
          this.playList = res.data.result;
          localStorage.setItem("playList", JSON.stringify(this.playList));
        } else {
          console.log("getRecommend 获取失败");
        }
      });

      this.$http
        .get("http://120.79.162.149:3000/personalized")
        .then(res => {
          this.playList = res.data.result;
          localStorage.setItem("playList", JSON.stringify(this.playList));
        })
        .then(err => {
          console.error("getRecommendList 获取失败");
        });
    },
    getrecommendMusic() {
      getRecommendMusic().then(res => {
        if (res.status === ERR_OK) {
          let list = res.data.result;
          list.splice(9);
          this.recommendMusic = list;
          localStorage.setItem("recommendMusic", JSON.stringify(list));
        } else {
          console.log("getRecommendMusic 获取失败");
        }
      });
      this.$http
        .get("http://120.79.162.149:3000/personalized/newsong")
        .then(res => {
          var list = res.data.result;
          list.splice(9);
          this.recommendMusic = list;

          localStorage.setItem("recommendMusic", JSON.stringify(list));
        })
        .then(err => {
          console.log("getRecommendList 获取失败");
        });
    },
    loadImage() {
      if (this.checkloaded) {
        this.checkloaded = false;
        this.$refs.scroll.refresh();
      }
    },
    handlePlaylist(playlist) {
      console.log("111");
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.index.style.bottom = bottom;
      this.$refs.scroll.refresh();
    }
  }
};
</script>

<style lang="less" >
.index {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  z-index: 100;
  .index-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .swipe {
      margin: 0 auto;
      overflow: hidden;
    }
    .components-list {
      position: relative;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: 16px;
        font-weight: bold;
        color: #2e3030;
        margin: 0;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          .gradients {
            position: absolute;
            top: 0;
            width: 100%;
            height: 35px;
            border-radius: 3px;
            background: linear-gradient(
              rgba(109, 109, 109, 0.4),
              rgba(255, 255, 255, 0)
            );
          }
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .play-count {
          position: absolute;
          top: 5px;
          right: 10px;
          font-size: 11px;
          color: rgb(241, 241, 241);
        }
        .text {
          float: left;
          line-height: 16px;
          text-align: left;
          height: 40px;
          line-height: 16px;
          overflow: hidden;
          margin-bottom: 10px;
          font-size: 11px;
          text-overflow: ellipsis;
          color: #2e3030;
        }
      }
    }
    .recommend-song {
      margin-top: -20px;
      box-sizing: border-box;
      width: 100%;
      text-align: center;
      .title {
        height: 65px;
        line-height: 65px;
        padding-left: 1.5%;
        text-align: left;
        font-size: 14px;
        font-weight: bold;
        color: #2e3030;
      }
      .item {
        display: inline-block;
        position: relative;
        box-sizing: border-box;
        width: 33%;
        padding: 0 1%;
        .icon {
          position: relative;
          display: inline-block;
          width: 100%;
          margin-bottom: 5px;
          img {
            width: 100%;
            height: 100%;
            border-radius: 3px;
          }
        }
        .text {
          line-height: 16px;
          text-align: left;
          height: 16px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 11px;
        }
        .singer {
          line-height: 16px;
          margin-bottom: 10px;
          text-align: left;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 11px;
          color: rgb(219, 219, 219);
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
}
</style>

