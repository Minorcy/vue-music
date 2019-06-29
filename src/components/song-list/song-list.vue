<template>
  <div class="song-list">
    <ul>
      <li @click="selectItem(song,index)" v-for="(song, index) in songs" class="item">
        <p class="count">{{index+1}}</p>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>


<script>
export default {
  props: {
    songs: {
      tyoe: Array
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index);
    },
    getDesc(song) {
      if (song.aliaName) {
        return `${song.singer} - ${song.aliaName}`;
      } else {
        return `${song.singer}`;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.song-list {
  .item {
    position: relative;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 60px;
    border-bottom: 1px solid rgb(228, 228, 228);
    top: 0px;
    .count {
      flex: 0 0 50px;
      width: 50px;
      text-align: center;
      color: #757575;
    }
    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        margin-top: 4px;
        width: 80%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #2e3030;
      }
      .desc {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        // margin-top: 3px;
        width: 80%;
        font-size: 12px;
        color: #757575;
      }
    }
  }
}
</style>
