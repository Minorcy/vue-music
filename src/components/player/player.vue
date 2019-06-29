<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <div class="filter"></div>
          <img :src="currentSong.image" width="100%" height="100%">
        </div>
        <div class="top">
          <div>
            <div class="back" @click="back">
              <i class="iconfont icon-down"></i>
            </div>
            <h1 class="title" v-html="currentSong.name"></h1>
            <h2 class="subtitle" v-html="currentSong.singer"></h2>
          </div>
        </div>
        <div class="middle" @click="changeMiddle">
          <transition name="middleL">
            <div class="middle-l" v-show="currentShow === 'cd'">
              <div class="cd-wrapper">
                <div class="cd" :class="cdCls">
                  <img :src="currentSong.image" class="image">
                </div>
              </div>
            </div>
          </transition>
          <transition name="middleR">
            <scroll
              class="middle-r"
              ref="lyricList"
              v-show="currentShow === 'lyric'"
              :data="currentLyric && currentLyric.lines"
            >
              <div class="lyric-wrapper">
                <div class="currentLyric" v-if="currentLyric">
                  <p
                    ref="lyricLine"
                    class="text"
                    :class="{'current': currentLineNum === index}"
                    v-for="(line, index) in currentLyric.lines"
                    :key="line.key"
                  >{{line.txt}}</p>
                </div>
                <p class="no-lyric" v-if="currentLyric === null">{{upDatecurrentLyric}}</p>
              </div>
            </scroll>
          </transition>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChangeEnd="onPercentChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i class="iconfont" :class="playMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="iconfont icon-shangyiqu" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i class="iconfont" @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="iconfont icon-xiayiqu" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i
                class="iconfont"
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img :src="currentSong.image" width="40" height="40" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <div class="desc" v-html="currentSong.singer"></div>
        </div>
        <div class="control">
          <i class="iconfont" :class="miniIcon" @click.stop="togglePlaying"></i>
        </div>
        <div class="control" @click.stop="showPlaylist">
          <i class="iconfont icon-caidan"></i>
        </div>
      </div>
    </transition>
    <playlist ref="playlist" @stopMusic="stopMusic"></playlist>
    <audio
      id="music-audio"
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>


<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getSong, getLyric } from "../../api/song";
import ProgressBar from "../progress-bar/progress-bar";
import { playMode } from "../../common/js/config";
import { shuffle } from "../../common/js/unit";
import Scroll from "../scroll/scroll";
import Lyric from "lyric-parser";
import Playlist from "../playlist/playlist";
export default {
  data() {
    return {
      Song: "",
      url: "",
      duration: 0,
      currentLineNum: 0,
      songRead: false,
      currentTime: 0,
      currentShow: "cd",
      currentLyric: null,
      noLyric: false,
      percent: 0
    };
  },
  components: {
    ProgressBar,
    Scroll,
    Playlist
  },
  computed: {
    playMode() {
      if (this.mode == playMode.sequence) {
        return "icon-cycle";
      } else if (this.mode == playMode.loop) {
        return "icon-danquxunhuan1";
      } else if (this.mode == playMode.random) {
        return "icon-suiji";
      }
    },
    cdCls() {
      return this.playing ? "play" : "play.pause";
    },
    playIcon() {
      return this.playing ? "icon-zanting" : "icon-bofang";
    },
    miniIcon() {
      return this.playing ? "icon-zanting" : "icon-bofang";
    },
    disableCls() {
      return this.songRead ? "" : "disab";
    },

    upDatecurrentLyric() {
      if (this.noLyric) {
        return "暂无歌词";
      }
      if (!this.noLyric) {
        return "歌词加载中";
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
  created() {},
  mounted() {},
  methods: {
    song(id) {
      return `https://music.163.com/song/media/outer/url?id=${id}.mp3`;
    },
    _getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentLyric = null;
      }
      this.noLyric = false;
      getLyric(id)
        .then(res => {
          this.currentLyric = new Lyric(res.data.lrc.lyric, this.handlerLyric);
          if (this.playing) {
            this.currentLyric.play();
            this.currentLineNum = 0;
            this.$refs.lyricList.scrollTo(0, 0, 1000);
          }
          // console.log("lyric===>", this.currentLyric);
        })
        .catch(() => {
          this.currentLyric = null;
          this.noLyric = true;
          this.currentLineNum = 0;
        });
    },
    handlerLyric({ lineNum, txt }) {
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];

        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    },
    changeMiddle() {
      if (this.currentShow === "cd") {
        this.currentShow = "lyric";
      } else {
        this.currentShow = "cd";
      }
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },
    togglePlaying() {
      const audio = this.$refs.audio;
      this.setPlayingState(!this.playing);
      this.playing ? audio.play() : audio.pause();
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    next() {
      if (!this.songRead) {
        return;
      }
      let index = this.currentIndex + 1;
      if (index === this.playlist.length) {
        index = 0;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songRead = false;
    },
    prev() {
      if (!this.songRead) {
        return;
      }
      let index = this.currentIndex - 1;
      if (index === -1) {
        index = this.playlist.length - 1;
      }
      this.setCurrentIndex(index);
      if (!this.playing) {
        this.togglePlaying();
      }
      this.songRead = false;
    },
    end() {
      if (this.mode == playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek();
      }
    },
    ready() {
      this.songRead = true;
      this.savePlayHistory(this.currentSong);
      // let stop = setInterval(() => {
      //   this.duration = this.$refs.audio.duration;
      //   if (this.duration) {
      //     clearInterval(stop);
      //   }
      // }, 150);
    },
    error() {
      this.songRead = true;
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return "icon-shoucang1";
      }
      return "icon-shoucang2";
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex(item => {
        return item.id === song.id;
      });
      return index > -1;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
      this.duration = e.target.duration;
    },
    format(interval) {
      interval = interval | 0;
      let minute = (interval / 60) | 0;
      let second = interval % 60 | 0;
      if (second < 10) {
        second = "0" + second;
      }
      return minute + ":" + second;
    },
    onPercentChange(percent) {
      const currentTime = this.duration * percent;
      this.$refs.audio.currentTime = currentTime;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    _getSong(id) {
      getSong(id).then(res => {
        this.url = res.data.data[0].url;
      });
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode == playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    showPlaylist() {
      this.$refs.playlist.show();
    },
    stopMusic() {
      console.log("停止播放");
      this.$refs.audio.pause();
    },

    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions(["saveFavoriteList", "deleteFavoriteList", "savePlayHistory"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!newSong.id) {
        return;
      }
      if (newSong.id === oldSong.id) {
        return;
      }
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentLineNum = 0;
      }
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$refs.audio.play();
        this._getLyric(this.currentSong.id);
      }, 1000);
    },

    playing(newPlaying) {
      const audio = this.$refs.audio;
      newPlaying ? audio.play() : audio.pause();
    },
    currentTime() {
      let time = this.$refs.audio;
      this.percent = time.currentTime / time.duration;
    }
  }
};
</script>
<style lang="less" scoped>
.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: #f2f3f4;
    .background {
      position: absolute;
      left: -50%;
      top: -50%;
      width: 300%;
      height: 300%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(30px);
      .filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0.6;
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
        .icon-down {
          display: block;
          padding: 5px 9px;
          font-size: 35px;
          color: rgb(241, 241, 241);
        }
      }
      .title {
        width: 70%;
        margin: 0 auto;
        padding-top: 10px;
        line-height: 20px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 18px;
        font-weight: bold;
        color: rgb(241, 241, 241);
      }
      .subtitle {
        width: 70%;
        margin: 0 auto;
        line-height: 20px;
        text-align: center;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 12px;
        color: rgb(241, 241, 241);
      }
    }
    .middle {
      display: flex;
      align-items: center;
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        &.middleL-enter-active,
        &.middleL-leave-active {
          transition: all 0.3s;
        }
        &.middleL-enter,
        &.middleL-leave-to {
          opacity: 0;
        }
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;
          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 15px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            &.play {
              animation: rotate 20s linear infinite;
            }
            &.pause {
              animation-play-state: paused;
            }
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }
      }

      .middle-r {
        display: inline-block;
        position: absolute;
        top: 0;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        &.middleR-enter-active,
        &.middleR-leave-active {
          transition: all 0.2s;
        }
        &.middleR-enter,
        &.middleR-leave-to {
          opacity: 0;
        }
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 40px;
            color: #c7c7c7;
            font-size: 14px;
            &.current {
              color: #fff;
            }
          }
          .no-lyric {
            line-height: 40px;
            margin-top: 60%;
            color: #c7c7c7;
            font-size: 14px;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: rgb(241, 241, 241);
          font-size: 11px;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
            color: rgb(219, 219, 219);
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: rgb(212, 68, 57);
          &.disable {
            color: rgb(212, 68, 57);
          }
          i {
            font-size: 30px;
          }
          .mode {
            font-size: 25px;
          }
          &.i-left {
            text-align: right;
          }
          &.i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          &.i-right {
            text-align: left;
          }
          .icon-like {
            color: rgb(240, 116, 107);
          }
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.4s;
      .top,
      .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }
    &.normal-enter,
    &.normal-leave-to {
      opacity: 0;
    }
  }
  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 200;
    width: 100%;
    height: 60px;
    background: rgba(255, 255, 255, 0.85);
    &.mini-enter-active,
    &.mini-leave-active {
      transition: all 0.4s;
    }
    &.mini-enter,
    &.mini-leave-to {
      opacity: 0;
    }
    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;
      img {
        border-radius: 50%;
        &.play {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      overflow: hidden;
      .name {
        margin-bottom: 2px;
        line-height: 14px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        color: #2e3030;
      }
      .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 11px;
        color: #2e3030;
      }
    }
    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-play-mini,
      .icon-pause-mini,
      .icon-playlist,
      .iconfont {
        font-size: 30px;
        color: rgba(19, 19, 19, 0.6);
      }
      .iconfont {
        position: relative;
        left: -5px;
        top: -3px;
      }
      .fa-play {
        color: rgba(19, 19, 19, 0.6);
        font-size: 14px;
        position: absolute;
        left: 12px;
        top: 8.5px;
      }
      .fa-stop {
        color: rgba(19, 19, 19, 0.6);
        font-size: 12px;
        position: absolute;
        left: 11px;
        top: 10px;
      }
    }
  }
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>


