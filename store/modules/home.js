const state = () => ({
  menu: [],
  hotPlace: []
})

const mutations = {
  setMenu(state, val) {
    state.menu = val
  },
  setHotPlace(state, val) {
    state.hotPlace = val
  }
}

const actions = {
  setMenu: ({ commit }, val) => {
    console.log('setMenu')
    commit('setMenu', val)
  },
  setHotPlace({ commit }, val) {
    commit('setHotPlace', val)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
