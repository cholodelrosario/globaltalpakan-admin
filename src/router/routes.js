
const routes = [
  {
    path: '/dashboard',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Dashboard.vue') },
      { path: '/events', component: () => import('pages/Events.vue') },
      { path: '/bets', component: () => import('pages/Bets.vue') },
      { path: '/agents', component: () => import('pages/Agents.vue') },
      { path: '/create-masteragent', component: () => import('pages/MasterAgentAccounts') },
      { path: '/agent-ranking', component: () => import('pages/AgentRanking.vue') },
      { path: '/commisions', component: () => import('pages/Commisions.vue') },
      { path: '/transactions', component: () => import('pages/Transactions.vue') },
      { path: '/total-sales', component: () => import('pages/TotalSales.vue') },
      { path: '/settings', component: () => import('pages/Settings.vue') },
      { path: '/logs', component: () => import('pages/Logs.vue') },
      { path: '/games', component: () => import('pages/Games.vue') },
      { path: '/useraccounts', component: () => import('pages/UserAccounts.vue') },
      { path: '/betsopt', component: () => import('pages/Betsopt.vue') },
      { path: '/schedule', component: () => import('pages/Schedule.vue') },
      { path: '/credits', component: () => import('pages/Credits.vue') },
      { path: '/gcashbank', component: () => import('pages/GcashBank.vue') },
      { path: '/withdrawal', component: () => import('pages/Withdrawal.vue') },
      { path: '/team', component: () => import('pages/Team.vue') },
      { path: '/backup', component: () => import('pages/Backup.vue') },

    ]
  },
  {
    path: '/',
    component: () => import('layouts/NoLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
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
