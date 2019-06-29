<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{'active' : currentPageIndex  === index}"
      ></span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
import { addClass } from "../../common/js/dom.js";
export default {
  name: "slider",
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  props: {
    // 循环轮播
    loop: {
      type: Boolean,
      default: true
    },
    // 自动轮播
    autoPlay: {
      type: Boolean,
      default: true
    },
    // 间隔
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      // this._onScrollEnd();
      if (this.autoPlay) {
        this._play();
      }
    }, 20);
    window.addEventListener("resize", () => {
      if (!this.slider) {
        return;
      }
      this._setSliderWidth(true);
      this.slider.refresh();
    });
  },

  methods: {
    _setSliderWidth(isResize) {
      this.children = this.$refs.sliderGroup.children;
      // console.log(this.children.length);
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        const child = this.children[i];
        addClass(child, "slider-item");
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }

      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        snap: true,
        snapLoop: this.loop,
        snapThreshold: 0.3,
        snapSpeed: 400,
        click: true
      });
      this.slider.on("scrollEnd", () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        if (this.loop) {
          pageIndex -= 1;
        }
        this.currentPageIndex = pageIndex;
        if (this.autoPlay) {
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    // this.currentPageIndex = pageIndex - 1;
    // if (this.autoPlay) {
    //   this._play();
    // }

    _play() {
      let pageIndex = this.currentPageIndex + 1;
      if (this.loop) {
        pageIndex += 1;
      }
      this.timer = setTimeout(() => {
        this.slider.goToPage(pageIndex, 0, 400);
      }, this.interval);
      // clearTimeout(this.timer);
      // this.timer = setTimeout(() => {
      //   this.slider.goToPage(pageIndex, 0, 400);
      // }, this.interval);
    },
    _initDots() {
      this.dots = new Array(this.children.length);
    }
  },
  destroyed() {
    clearTimeout(this.timer);
  }
};
</script>
<style lang="less" scoped>
.slider {
  min-width: 1px;
  position: relative;
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
      float: left;
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      img {
        display: blick;
        width: 100%;
      }
    }
  }
  .dots {
    position: absolute;
    right: 0;
    left: 0;
    text-align: center;
    bottom: 12px;
    .dot {
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: rgb(241, 241, 241);
      &.active {
        border-radius: 5px;
        background: rgb(253, 108, 98);
      }
    }
  }
}
</style>

