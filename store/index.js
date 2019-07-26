import Vue from 'vue'
import Vuex from 'vuex'
import geo from './modules/geo'
import home from './modules/home'
Vue.use(Vuex)

const store = () => {
  // 这种写法才正确，原版的是错误的
  return new Vuex.Store({
    modules: {
      geo,
      home
    },
    actions: {
      // 这里能过做到前后端数据同步
      async nuxtServerInit({ commit }, { req, app }) {
        console.log('xxxxx')
        const { status, data: { province, city } } = await app.$axios.get('/geo/getPosition')
        console.log(status)
        commit('geo/setPosition', status === 200 ? { province, city } : { province: '', city: '' })

        const { status: mStatus, data: { menu } } = await app.$axios.get('/geo/menu')
        console.log(mStatus)
        commit('home/setMenu', mStatus === 200 ? menu : [])
        const { status: status3, data: { result } } = await app.$axios.get('/search/hotPlace', {
          params: {
            city: app.store.state.geo.position.city.replace('市', '')
          }
        })
        console.log(status3)
        commit('home/setHotPlace', status3 === 200 ? result : [])
      }
    }
  })
}

export default store
