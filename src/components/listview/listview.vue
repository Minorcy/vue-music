<template>
  <scroll
    class="listview"
    :data="data"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li v-for="group in data" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li @click="selectItem(item)" v-for="item in group.items" class="list-group-item">
            <img class="avater" v-lazy="item.avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="list-shortcut"
      @touchstart="onShortcutStart"
      @touchmove.stop.prevent="onShortcutMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          class="item"
          :data-index="index"
          :key="item.id"
          :class="{'current': currentIndex === index}"
        >{{ item }}</li>
      </ul>
    </div>
  </scroll>
</template>

<script>
import { getData } from "../../common/js/dom.js";
import Srcoll from "../scroll/scroll";

const ANCHOR_HEIGHT = 20;

export default {
  data() {
    return {
      scrollY: -1,
      currentIndex: 0
    };
  },
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  methods: {
    refresh() {
      this.$refs.listview.refresh();
    },
    selectItem(item) {
      this.$emit("select", item);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    onShortcutStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutMove(e) {
      let firshTouch = e.touches[0];
      this.touch.y2 = firshTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      if (!index && index !== 0) {
        return;
      }
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      // console.log(newY)
      const listHeight = this.listHeight;
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          return;
        }
      }
      this.currentIndex = listHeight.length - 2;
    }
  },

  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    }
  },
  components: {
    scroll: Srcoll
  }
};
</script>

<style lang="less" scoped>
.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f2f3f4;

  .list-group {
    .list-group-title {
      height: 20px;
      line-height: 20px;
      padding-left: 12px;
      margin-bottom: 10px;
      font-size: 12px;
      color: #fff;
      background: rgba(0, 0, 0, 0.1);
      font-weight: 400;
    }
    .list-group-item {
      display: flex;
      align-items: center;
      padding: 5px 0;
      margin: 0 5px;
      border-bottom: 1px solid rgba(228, 228, 228);
      &:last-child {
        border: none;
        margin-bottom: 10px;
      }
      .avater {
        width: 50px;
        height: 50px;
        border-radius: 3px;
      }
      .name {
        margin-left: 20px;
        color: #2e3030;
        font-size: 14px;
      }
    }
  }
  .list-shortcut {
    position: absolute;
    z-index: 20;
    right: 3px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 200px 0;
    border-radius: 3px;
    text-align: center;
    font-family: Helvetica;
    .item {
      padding: 5px 5px;
      line-height: 1;
      color: #757575;
      font-size: 11px;
      font-weight: bold;
      &.current {
        color: rgb(240, 116, 107);
      }
    }
  }
}
</style>

