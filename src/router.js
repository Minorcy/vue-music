import Vue from "vue";
import Router from "vue-router";


// import Index from "./components/recommend/Index.vue"
// import Singer from './components/singer/singer.vue'
// import SingerDetail from './components/singer/singer-detail.vue'
// import MusicList from './components/music-list/music-list'
// import Rank from './components/rank/rank'
// import RankDetail from './components/rank/rank-detail'
// import Search from './components/search/search'
// import User from './components/user/user'

Vue.use(Router);

const Index = (resolve => {
  import("./components/recommend/Index.vue").then((module) => {
    resolve(module)
  })
})

const Singer = (resolve => {
  import('./components/singer/singer.vue').then((module) => {
    resolve(module)
  })
})

const SingerDetail = (resolve => {
  import('./components/singer/singer-detail.vue').then((module) => {
    resolve(module)
  })
})

const MusicList = (resolve => {
  import('./components/music-list/music-list').then((module) => {
    resolve(module)
  })
})

const Rank = (resolve => {
  import('./components/rank/rank').then((module) => {
    resolve(module)
  })
})

const RankDetail = (resolve => {
  import('./components/rank/rank-detail').then((module) => {
    resolve(module)
  })
})

const Search = (resolve => {
  import('./components/search/search').then((module) => {
    resolve(module)
  })
})

const User = (resolve => {
  import('./components/user/user').then((module) => {
    resolve(module)
  })
})



export default new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      component: Index,
      children: [{
        path: ":id",
        component: MusicList
      }]
    },
    {
      path: '/rank',
      component: Rank,
      children: [{
        path: ':id',
        component: RankDetail
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children: [{
        path: ":id",
        component: SingerDetail
      }]
    }, {
      path: '/search',
      component: Search,
      children: [{
          path: "singer/:id",
          component: SingerDetail
        },
        {
          path: 'list/:id',
          component: MusicList
        }
      ]
    }, {
      path: '/user',
      component: User
    }
  ]
});