<template>
  <q-page class=" bg-dark">
      <div>
          <div full-width>
              <q-tabs v-model="gameCategory" inline-label class="bg-secondary text-white shadow-2 col-12" >
                    <div class="row">
                        <q-tab name="ALL" label="ALL" />
                        <q-tab :name="i.games" :label="i.games" v-for="(i, index) in GamesCategory" :key="index" />
                    </div>        
            </q-tabs>
           
            <div class="q-pa-sm">
                <q-table grid :data="asc" :columns="columns" :filter="filter" class="full-width align-center text-white " dark row-key=".key" :pagination="initialPagination">
                    <template v-slot:top-right>
                        <q-input dark bordered dense outlined debounce="300" v-model="filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                        </q-input>
                    </template>
                    <template v-slot:item="props">
                        
                        <div class="q-pa-md col-md-3 grid-style-transition">
                            <q-card class="my-card bg-secondary text-white">
                                <q-video :ratio="4/2" :src="props.row.videoLink" disabled/>

                                <q-card-section>
                                    <div class="text-h6 ellipsis">
                                         GAME #{{props.row.gameNumber}}
                                         
                                    </div>
                                    <span class="text-grey text-caption"> {{$moment(props.row.scheduledTime.from).calendar()}}</span>

                                </q-card-section>

                                <q-card-section class="q-pt-none">
                                    <div class="text-subtitle1">
                                    <span class="text-blue text-weight-bold">{{props.row.teamBlue.team}}</span> 
                                    VS 
                                    <span class="text-red text-weight-bold">{{props.row.teamRed.team}}</span>
                                    </div>
                                    <div class="text-caption text-grey">
                                    {{props.row.gameCategory}}
                                    </div>
                                </q-card-section>

                                <q-separator />

                                <q-card-actions v-show="gameCategory !== 'ALL'" class="flex flex-center">
                                    <q-btn icon="edit" flat color="grey" size="sm" @click="storeSelectedGame">
                                        view Full End Game Details
                                    </q-btn>
                                </q-card-actions>
                                </q-card>
                        </div>
                    </template>
                </q-table>
            </div>
            <br><br><br><br>
          </div>
      </div>
        <q-dialog v-model="betOptionsDialog" persistent>
            <q-card style="min-width: 350px" dark>
                <q-card-section>
                <div class="text-h6">BetOptions</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                   <q-list bordered>
                       <q-item clickable v-ripple v-show="viewBetOptions.length > 0" v-for="(betopt,n) in viewBetOptions" :key="betopt['.key']">
                           <q-item-section top avatar>
                               <q-avatar > {{n+1}} </q-avatar>
                           </q-item-section>
                           <q-item-section>{{betopt.name}}</q-item-section>
                       </q-item>
                   </q-list>
                </q-card-section>
                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Close" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
    methods:{
        async storeSelectedGame(){
            let endGame = {...this.asc}
            delete endGame['.key']
            await this.$store.commit('gameNotifications/setSelectedGame', endGame)
            this.$router.push(`/live-games/${endGame.gameKey}/${endGame.scheduleKey}`)
        }
    },
    computed:{
        asc(){
            if(this.gameCategory == 'ALL'){
                let all = this.$lodash.orderBy(this.EndGames, ['dateEnded'], ['asc']);
                
                return all
            }else{
                let optionss = this.$lodash.filter(this.EndGames, m => {
                    return m.gameCategory == this.gameCategory
                })
                let orderBy = this.$lodash.orderBy(optionss, ['dateEnded'], ['asc']);
                console.log(optionss, 'opoopst')
                return orderBy
            }
        },
    },
    data(){
        return {
            initialPagination: {
                sortBy: 'showedLive',
                descending: false,
                page: 1,
                rowsPerPage: 10
                // rowsNumber: xx if getting data from a server
            },
            columns: [
                { name: 'gameCategory', required: true, label: 'Game Category', align: 'left', field: 'gameCategory', sortable: true },
                { name: 'image', required: true, label: 'Image', align: 'left', field: 'image', sortable: true },
                { name: 'action', label: 'Action' }
            ],
            filter: '',
            gameNo: 0,
            gameCategory: 'ALL',
            splitterModel: 20,
            Options: [],
            betOpt: '',
            optDialog: false,
            selectGame: '',
            GamesCategory: [],
            BetOptions: [],
            Team: [],
            ScheduledGames: [],
            selectTeamTwo: '',
            selectTeamOne: '',
            viewBetOptions: [],
            EndGames: [],
            betOptionsDialog: false
        }
    },
    mounted () {
       this.$binding('GamesCategory', this.$db.collection('GamesCategory'))
        .then(GamesCategory => {
          console.log(GamesCategory, 'GamesCategory')
        })
       this.$binding('Team', this.$db.collection('Team'))
        .then(Team => {
          console.log(Team, 'Team')
        })
        this.$binding('BetOptions', this.$db.collection('BetOptions'))
        .then(BetOptions => {
          console.log(BetOptions, 'BetOptions')
        })
        this.$binding('ScheduledGames', this.$db.collection('ScheduledGames'))
        .then(ScheduledGames => {
          console.log(ScheduledGames, 'ScheduledGames')
        })
        this.$binding('EndGames', this.$db.collection('EndGames').where("status","==",'PROCESSED'))
        .then(EndGames => {
          console.log(EndGames, 'EndGames')
        })
    },
}
</script>
