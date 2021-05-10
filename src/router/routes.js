import Store from 'src/store'

const ifAuthenticated = (to, from, next) => {
  if (Store.getters['useraccount/isAuthenticated'] === null) {
      next('/')
    }
    next()
    return
}

const ifNotAuthenticated = (to, from, next) => {
  if (Store.getters['useraccount/isAuthenticated'] === null) {
    next()
    return
  }
  next('/dashboard')
}


const routes = [
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: ifAuthenticated,
    children: [
      { path: '', component: () => import('pages/Dashboard.vue'), beforeEnter: ifAuthenticated},
      { path: '/events', component: () => import('pages/Events.vue'), beforeEnter: ifAuthenticated},
      { path: '/players', component: () => import('pages/Players.vue'), beforeEnter: ifAuthenticated},
      { path: '/end-game-history', component: () => import('pages/EndGameHistory.vue'), beforeEnter: ifAuthenticated},
      { path: '/bet-option-history', component: () => import('pages/BetOptionHistory.vue'), beforeEnter: ifAuthenticated},
      { path: '/bets', component: () => import('pages/Bets.vue'),beforeEnter: ifAuthenticated },
      { path: '/agents', component: () => import('pages/Agents.vue'), beforeEnter: ifAuthenticated},
      { path: '/create-masteragent', component: () => import('pages/MasterAgentAccounts'), beforeEnter: ifAuthenticated},
      { path: '/agent-ranking', component: () => import('pages/AgentRanking.vue'), beforeEnter: ifAuthenticated},
      { path: '/commisions', component: () => import('pages/Commisions.vue'),beforeEnter: ifAuthenticated },
      { path: '/transactions', component: () => import('pages/Transactions.vue'),beforeEnter: ifAuthenticated },
      { path: '/total-sales', component: () => import('pages/TotalSales.vue'),beforeEnter: ifAuthenticated },
      { path: '/settings', component: () => import('pages/Settings.vue'),beforeEnter: ifAuthenticated },
      { path: '/logs', component: () => import('pages/Logs.vue'),beforeEnter: ifAuthenticated },
      { path: '/games', component: () => import('pages/Games.vue'),beforeEnter: ifAuthenticated },
      { path: '/useraccounts', component: () => import('pages/UserAccounts.vue'),beforeEnter: ifAuthenticated },
      { path: '/betsopt', component: () => import('pages/Betsopt.vue'),beforeEnter: ifAuthenticated },
      { path: '/index', component: () => import('pages/Index.vue'),beforeEnter: ifAuthenticated },
      { path: '/schedule', component: () => import('pages/Schedule.vue'),beforeEnter: ifAuthenticated },
      { path: '/credits', component: () => import('pages/Credits.vue'),beforeEnter: ifAuthenticated },
      { path: '/gcashbank', component: () => import('pages/GcashBank.vue'),beforeEnter: ifAuthenticated },
      { path: '/withdrawal', component: () => import('pages/Withdrawal.vue'),beforeEnter: ifAuthenticated },
      { path: '/team', component: () => import('pages/Team.vue'),beforeEnter: ifAuthenticated },
      { path: '/convertion-request', component: () => import('pages/ConvertionRequest.vue'),beforeEnter: ifAuthenticated },
      { path: '/live-games', component: () => import('pages/LiveGames.vue'),beforeEnter: ifAuthenticated },
      { path: '/live-games/:code/:schedule', component: () => import('pages/LiveGameDetails.vue'),beforeEnter: ifAuthenticated },
      { path: '/bet-computations/:code/:schedule', component: () => import('pages/BetComputationDetails.vue'),beforeEnter: ifAuthenticated },
      { path: '/bet-cancellation/:code/:schedule', component: () => import('pages/BetCancellationDetails.vue'),beforeEnter: ifAuthenticated },
      { path: '/bet-options-computations/:code/:schedule/:options', component: () => import('pages/BetOptionsComputationDetails.vue'),beforeEnter: ifAuthenticated },
      { path: '/bet-options-cancellation/:code/:schedule/:options', component: () => import('pages/BetOptionsCancellationDetails.vue'),beforeEnter: ifAuthenticated },
      { path: '/backup', component: () => import('pages/Backup.vue'),beforeEnter: ifAuthenticated },

    ]
  },
  {
    path: '/',
    component: () => import('layouts/NoLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue'), beforeEnter: ifNotAuthenticated }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
