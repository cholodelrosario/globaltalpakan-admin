<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-dark">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          
        </q-toolbar-title>

        <!-- <div class="text-white">₱ 0.00 <q-icon name="account_balance_wallet"  size="sm"/></div> -->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item class="text-white bg-dark q-pt-xl">
          <q-item-section>
           <q-item-label class="text-h6">{{returnUser.displayName}}</q-item-label>
            <q-item-label overline class="text-white">{{returnUser.phone}}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/dashboard" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="dashboard" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Dashboard</q-item-label>
          </q-item-section>
        </q-item>
        <!-- <q-item clickable v-ripple to="/events" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Event Management</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/bets" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Bets Management</q-item-label>
          </q-item-section>
        </q-item> -->

        <q-item clickable v-ripple to="/end-game-history" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Ended Game History</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/bet-option-history" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="help" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Ended Bet Option History</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset  />
        <q-item-label
          header
          class="text-grey-8"
        >
          Agents
        </q-item-label>
        <q-item clickable v-ripple to="/create-masteragent" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="account_box" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Master Agent Accounts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/commisions" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">MA Status.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/agents" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Agent Status.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/agent-ranking" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="assessment" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">MA/Agent Ranking</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset  />
        <q-item-label
          header
          class="text-grey-8"
        >
          Reports
        </q-item-label>
        <q-item clickable v-ripple to="/transactions" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="payment" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Transactions</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/total-sales" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="request_page" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Total Sales</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset  />
        <q-item-label
          header
          class="text-grey-8"
        >
          Request
        </q-item-label>
        <q-item clickable v-ripple to="/credits" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Send Credits</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/withdrawal" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="request_page" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Withdrawal Request</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/convertion-request" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="request_page" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Convertion Request</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset  />
        <q-item-label
          header
          class="text-grey-8"
        >
          File Maintenance
        </q-item-label>
        
        <q-item clickable v-ripple to="/games" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Add Games (SUGALAN)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/team" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Add Team</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/betsopt" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Add Betting Option</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/schedule" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Schedule Event</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/live-games" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Live Games</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/useraccounts" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="account_circle" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">User Accounts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/gcashbank" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="request_page" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">G-Cash And Bank Account</q-item-label>
          </q-item-section>
        </q-item>
        <q-separator inset  />
        <q-item-label
          header
          class="text-grey-8"
        >
          Account
        </q-item-label>
        <q-item clickable v-ripple to="/settings" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Settings</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="logoutUser" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="logout" />
          </q-item-section>  
          <q-item-section>
            <q-item-label class="text-weight-bold">Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
// var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
//   (function(){
//   var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
//   s1.async=true;
//   s1.src='https://embed.tawk.to/6058aab7067c2605c0bb0d86/1f1d5lnue';
//   s1.charset='UTF-8';
//   s1.setAttribute('crossorigin','*');
//   s0.parentNode.insertBefore(s1,s0);
//   })();

//NOT SURE IF NEEDED

import EssentialLink from 'components/EssentialLink.vue'

const linksData = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
  }
];

export default {
  name: 'MainLayout',
  components: { EssentialLink },
  data () {
    return {

      dialog: false,
      leftDrawerOpen: false,
      essentialLinks: linksData
    }
  },
  computed:{
    returnUser(){
      let user = this.$store.getters['useraccount/isAuthenticated']
      return user
    },
  },
  methods:{
    logoutUser(){
      console.log('clicked')
        this.$store.dispatch('useraccount/logoutUser')
    }
  }
}
</script>
