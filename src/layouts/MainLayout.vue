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
            <q-item-label class="text-h6">NAME</q-item-label>
            <q-item-label overline class="text-white">09654767706</q-item-label>
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
        <q-item clickable v-ripple to="/events" active-class="text-black bg-primary">
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
        </q-item>
        <q-separator inset  />
        <q-item-label
          header
          class="text-grey-8"
        >
          Agents
        </q-item-label>
        <q-item clickable v-ripple to="/create-agent" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="account_box" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Create Agent Accounts</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/commisions" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="money" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">MA Comms.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/agents" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="people" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Agent Comms.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/agents-ranking" active-class="text-black bg-primary">
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
        <q-item clickable v-ripple to="/maccount" active-class="text-black bg-primary">
          <q-item-section avatar>
            <q-avatar color="grey-1" text-color="dark" icon="payment" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-weight-bold">Create M/A Account</q-item-label>
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
        <q-item clickable v-ripple to="/enter" active-class="text-black bg-primary">
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
      <q-page-sticky position="bottom-right" :offset="[90, 19]" v-show="$route.path == '/event'">
        <q-btn fab color="primary" class="text-black" icon="play_arrow" @click="dialog = true"></q-btn>
      </q-page-sticky>
      <q-dialog
        v-model="dialog"
        persistent
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <q-card class="text-white bg-dark">
        <div class="flex text-center bg-dark q-pa-md q-py-lg">
          <div class="q-py-xl q-mb-xl">
          <h5 class="text-center full-width text-primary text-weight-bolder q-ma-none">SELECT GAME</h5>
          <div class="text-center full-width text-secondary q-ma-none q-mb-md text-weight-light text-italic">SCROLL FOR MORE GAMES & EVENTS</div>
          <div class="container flex row flex-center" :class="$q.platform.is.desktop ? 'q-pa-md' : ''">
            <div class="q-ma-sm" :class="$q.platform.is.desktop ? 'col-4'  :'col-6 ' " v-for="n in 8" :key="n" :style="$q.platform.is.desktop ? 'width:25vw;' : 'width:40vw'">
              <!-- <q-card class="cursor-pointer bg-dark my-card">
              <q-img
                src="https://cdn.quasar.dev/img/parallax2.jpg"
                contain
                ratio="1"
              >
              </q-img>
              </q-card> -->
              <q-btn round  @click="$router.push('/event')">
                <q-avatar :size="$q.platform.is.desktop ? '15vw' : '      '">
                  <img src="https://picsum.photos/200/300">
                </q-avatar>
              </q-btn>
              <div class="text-white q-mt-sm">GAME {{n}}</div>
            </div>
          </div>
          <q-btn class="text-black q-mt-md" fab color="primary" icon="close" @click="dialog = false"></q-btn>
          </div>
          
        </div>
        </q-card>
      </q-dialog>
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
  }
}
</script>
