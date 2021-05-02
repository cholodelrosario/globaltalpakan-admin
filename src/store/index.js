import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";
import sms from './sms'
import useraccount from './useraccount'
import gameNotifications from './gameNotifications'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

// export default function (/* { ssrContext } */) {
//   const Store = new Vuex.Store({
//     modules: {
//       // example
//       sms,
//       useraccount
//     },
//     plugins: [createPersistedState()],
//     // enable strict mode (adds overhead!)
//     // for dev mode only
//     strict: process.env.DEBUGGING
//   })

//   return Store
// }

const Store = new Vuex.Store({
  modules: {
    // example
    sms,
    useraccount,
    gameNotifications
  },
  plugins: [createPersistedState()],

  // enable strict mode (adds overhead!)
  // for dev mode only
  // strict: process.env.DEV
})

if (process.env.DEV && module.hot) {
  module.hot.accept(['./useraccount'], () => {
    const newuseraccount = require('./useraccount').default
    const newsms = require('./sms').default
    const newgamenotifs = require('./gameNotifications').default
    Store.hotUpdate({ 
      modules: { 
        notification: newsms,
        useraccount: newuseraccount,
        gameNotifications: newgamenotifs
       },
    })
  })
}

export default Store;