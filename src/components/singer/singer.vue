<template>
  <div class="singer" ref="singer">
    <listview :data="this.singers" @select="selectSinger" ref="list"></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import Singer from "../../common/js/singer.js";
import { getSingers } from "../../api/singer.js";
import { playlistMixin } from "../../common/js/mixin";
import Listview from "../listview/listview";
import { mapMutations } from "vuex";
const pinyin = require("pinyin");
const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";
export default {
  mixins: [playlistMixin],
  name: "singer",
  data() {
    return {
      list: [],
      singers: []
    };
  },
  created() {
    this._getSingerList();
    // this.singers = JSON.parse(localStorage.getItem("list"));
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingers().then(res => {
        let s = res.data.artists;
        s.map(item => {
          let py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          });
          item.initial = py[0][0].toUpperCase();
        });
        this.singers = this._normalizeSinger(s);
        // console.log(this.singers);
        localStorage.setItem("list", JSON.stringify(this.singers));
      });
    },
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              id: item.id,
              name: item.name,
              avatar: item.img1v1Url,
              aliaName: item.alias.join(" / ")
            })
          );
        }

        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            id: item.id,
            name: item.name,
            avatar: item.img1v1Url,
            aliaName: item.alias[0]
          })
        );
      });
      let hot = [];
      let ret = [];
      for (const key in map) {
        let val = map[key];
        if (val.title.match(/[A-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  },
  components: {
    listview: Listview
  }
};
</script>
<style lang="less" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>

