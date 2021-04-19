<template>
  <q-page class="bg-dark text-white">
      <div>
          <div full-width>
            <q-tabs v-model="gameCategory" inline-label class="bg-secondary text-white shadow-2 col-12" >
                <div class="row">
                    <q-tab :name="i.games" :label="i.games" v-for="(i, index) in GamesCategory" :key="index" />
                </div>        
            </q-tabs>
            <div class="q-pa-md">
                <q-card class="bg-secondary">
                    <q-card-section class="text-center">
                        <b>Current Live For : <b class="text-h6">{{this.gameCategory == 'ALL' ? 'Please Select Games' : this.gameCategory}}</b></b>
                    </q-card-section>
                     <div v-show="live.length == 0" class="q-pr-md q-pl-md q-pb-lg">
                        <div align="center" class="flex flex-center row q-gutter-md">
                            <div class="col-5 bg-red text-overline column justify-between">
                                <q-item-label class="text-h6">NO LIVE DATA AVAILABLE</q-item-label>
                            </div>
                        </div>    
                    </div>
                    <q-card-section class="text-center">
                       <div class="text-h2" v-show="live.length !== 0">
                            <span class="text-blue text-weight-bold" v-if="live.teamBlue">{{live.teamBlue.team}}</span> 
                            VS 
                            <span class="text-red text-weight-bold" v-if="live.teamRed">{{live.teamRed.team}}</span>
                        </div> 
                        <q-chip v-show="live.length !== 0" :color="returnColorStatus(live.status)"  text-color="white" :label="live.status" />
                        <!-- <div class="q-pa-sm row items-start q-gutter-md flex flex-center" v-show="live.length !== 0">
                            <div class="col-6 q-pl-xl text-overline">Betting Status: <q-badge outline :color="live.bettingStatus == true ? 'green' : 'black' " :label="live.status" /> <q-toggle @input="activate(l)" v-model="live.bettingStatus" color="green"/> </div>
                            <div class="col text-overline">Game Status: <q-badge outline :color="live.gameStatus == true ? 'green' : 'black' " :label="live.gameStatus == true ? 'On Going' : 'Cancelled' " /> <q-toggle v-show="live.bettingStatus == false" @input="gameStats(l)" :disable="live.gameStatus == false" v-model="live.gameStatus" color="green"/> </div>
                            <div v-show="live.gameStatus == false" class="text-overline">Go to Bet Management For Cancelled Games Refund</div>
                        </div> -->
                    </q-card-section>
                    <q-separator  dark />
                    <q-card-actions align="center" v-show="live.length !== 0">
                        <q-btn flat class="full-width" label="view Full Live Details" color="grey" @click="$router.push(`/live-games/${live.gameKey}/${live.scheduleKey}`)"/>
                    </q-card-actions>
                </q-card>
            </div>
            <q-separator />
            <div class="q-pa-sm">
            <q-table title="Scheduled Games" grid :data="asc" :columns="columns" :filter="filter" class="full-width align-center text-white " dark row-key=".key">
                    <template v-slot:top-right>
                        <q-input dark bordered dense outlined debounce="300" v-model="filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                        </q-input>
                    </template>
                    <template v-slot:item="props">
                        
                        <div class="q-pa-md col-md-4 grid-style-transition">
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
                                    <q-btn outline class="full-width q-mt-sm" color="grey" size="sm" v-show="props.row.betOptions.length > 0" @click="viewBetOptionsDialog(props.row.betOptions)">
                                    view bet options list ({{props.row.betOptions.length}})
                                    </q-btn>
                                </q-card-section>

                                <q-separator />

                                <q-card-actions align="right">
                                    <q-btn flat icon-right="play_arrow" label="GO LIVE" color="primary" @click="updateLive(props.row)"/>

                                </q-card-actions>
                                </q-card>
                        </div>
                    </template>
                </q-table>
            </div>
            
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
        gameStats(data) {
            this.$q.dialog({
                title: data.gameStatus == false ? `Cancel This Game ??` : `Open This Game ??`,
                type: 'accent',
                color: 'accent',
                textColor: 'white',
                persistent: true,
                icon: 'warning',
                ok: 'Ok'
            }).onOk(()=> {
            var status = data.gameStatus
			console.log(data, 'data')
			let key = data['.key']
            let update = {...data}
            delete update['.key']
                this.$db.collection(`LiveGames`).doc(key).set(update)
                this.$db.collection('CancelledGames').add(data)
				.then(() => {  
                        this.$q.notify({
                        message: status ? `${'Game'} is On Going`: `${'Game'} has been Cancelled`,
                        type: 'positive',
                        color: 'positive',
                        textColor: 'white',
                        icon: 'info'
                    })
				})
				.catch((err) => {
					this.$q.notify({
                    message: `An error occured`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
                })
					console.log(err)
                })
            })
		},
        activate(data) {
            this.$q.dialog({
                title: data.bettingStatus == false ? `Close Betting ??` : `Open Betting ??`,
                type: 'accent',
                color: 'accent',
                textColor: 'white',
                persistent: true,
                icon: 'warning',
                ok: 'Ok'
            }).onOk(()=> {
            var status = data.bettingStatus
            data.status = data.bettingStatus == true ? 'OPEN' : 'CLOSE'
			console.log(data, 'data')
			let key = data['.key']
            let update = {...data}
            delete update['.key']
            this.$db.collection(`LiveGames`).doc(key).set(update)
				.then(() => {
			this.$q.notify({
            message: status ? `${'Betting'} has been OPEN`: `${'Betting'} has been CLOSE`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
				})
				.catch((err) => {
					this.$q.notify({
                    message: `An error occured`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
                })
					console.log(err)
                })
            })
		},
        updateLive (task) {
			this.$q.dialog({
				title: 'Confirm',
                message: 'Do you want to update Live?',
                ok: 'Update',
                cancel: 'Cancel'
			})
            .onOk(() => {
			let data = {...task}
			var key = data['.key']
            data.scheduleKey = key
			delete data.__index
			delete data['.key']
            console.log('user', data)
                this.$db.collection('LiveGames').doc(data.gameKey).set(data)
                this.$q.notify({
                    message: `Live Game has been updated`,
                    type: 'positive',
                    color: 'positive',
                    textColor: 'white',
                    icon: 'info'
                })  
            })
        },
        viewBetOptionsDialog(array){
            this.viewBetOptions = array
            this.betOptionsDialog = true
            console.log('code co true')
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Events',
            message: 'Delete This Events?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('ScheduledGames').doc(id).delete()
                this.$q.notify({
                        message: 'Events Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        schedEvents(){
            var newEvents = {
                gameCategory: this.selectGame.games,
                gameKey: this.selectGame['.key'],
                betOptions: this.Options,
                gameNumber: this.gameNo,
                scheduledTime: {
                    from: date.formatDate(this.dateFrom, 'YYYY-MM-DD HH:mm'),
                    to: date.formatDate(this.dateTo, 'YYYY-MM-DD HH:mm'),
                },
                status: 'OPEN',
                tag: 'MIRROR',
                teamBlue: this.selectTeamOne.team,
                teamBlueKey: this.selectTeamOne['.key'],
                teamRed: this.selectTeamTwo.team,
                teamRedKey: this.selectTeamTwo['.key'],
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
                trends: [],
                videoLink: this.videoUrl,
            }
            if(this.selectGame === '' || this.selectTeamOne === '' || this.selectTeamTwo === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
            })
            }else
                this.$q.dialog({
                title: 'Scheduled Events',
                message: 'Scheduled This Events?',
                ok: 'Yes',
            }).onOk(() => { 
                this.$db.collection('ScheduledGames').add(newEvents)
                this.$q.notify({
                        message: 'Events Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.selectGame = ''
                    this.Options = []
                    this.selectTeamOne = ''
                    this.selectTeamOne = ''
                    this.dateFrom = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
                    this.dateTo = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
                    this.videoUrl = 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0'
            })
        },
        addOptions(){
            var OptionBet  = {
                betsopt: this.betOpt.betsopt,
            }
            if(this.betOpt === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
            })
            }else
                this.$q.dialog({
                title: 'Add Options',
                message: 'Add This Options?',
                ok: 'Yes',
            }).onOk(() => { 
                this.Options.push(OptionBet)
                this.$q.notify({
                        message: 'Option Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.betOpt = ''
            })
            console.log(this.Options, 'options')
        },
        returnColorStatus(status){
            if(status == 'CLOSED'){
                return 'grey'
            } else if (status == 'CANCELLED') {
                return 'red'
            } else if (status == 'ENDGAME') { 
                return 'black'
            } else {
                return 'green'
            }          
        }
    },
    computed:{
        live(){
            if(this.gameCategory == 'ALL'){
                return []
            }else{
                let liveG = this.$lodash.filter(this.LiveGames, m => {
                    return m.gameCategory == this.gameCategory
                })
                console.log(liveG, 'live')
                return liveG[0] == undefined ? [] : liveG[0]
            }
        },
        asc(){
            if(this.gameCategory == 'ALL'){
                let all = this.$lodash.orderBy(this.ScheduledGames, ['gameNumber'], ['asc']);
                return all
            }else{
                let optionss = this.$lodash.filter(this.ScheduledGames, m => {
                return m.gameCategory == this.gameCategory
                })
                console.log(optionss, 'laman')
                let orderBy = this.$lodash.orderBy(optionss, ['gameNumber'], ['asc']);
                console.log(optionss, 'opoopst')
                return orderBy
            }
        },
        gamesOption(){
            let optionss = this.GamesCategory.map(GamesCategory => {
                return {
                    label: GamesCategory.games,
                    value: GamesCategory
                }
            })
            console.log(optionss, 'optionss')
            return optionss
        },
        betOptions(){
            let betsopts = this.$lodash.filter(this.BetOptions, m => {
                if(m.games === this.selectGame.games){
                    return m.betsopt
                }
            })
            let newBetsOpt = betsopts.map(betsopts => {
                return {
                    label: betsopts.betsopt,
                    value: betsopts
                }
            }) 
                return newBetsOpt
        },
        teamOptionOne(){
            let teams = this.$lodash.filter(this.Team, m => {
                if(m.game === this.selectGame.games){
                    return m.team
                }
            })
            let optionss = teams.map(teams => {
                return {
                    label: teams.team,
                    value: teams
                }
            })
            console.log(optionss, 'opt')
            return optionss
        },
        teamOptionTwo(){
            let teams = this.$lodash.filter(this.Team, m => {
                if(m.game === this.selectGame.games){
                    return m.team
                }
            })
            let optionss = teams.map(teams => {
                return {
                    label: teams.team,
                    value: teams
                }
            })
            console.log(optionss, 'opt')
            return optionss
        },
    },
    data(){
        return {
            LiveGames: [],
            columns: [
                { name: 'gameCategory', required: true, label: 'Game Category', align: 'left', field: 'gameCategory', sortable: true },
                { name: 'image', required: true, label: 'Image', align: 'left', field: 'image', sortable: true },
                { name: 'action', label: 'Action' }
            ],
            filter: '',
            gameNo: 0,
            gameCategory: 'Sabong',
            splitterModel: 20,
            dateTo: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            dateFrom: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            Options: [],
            betOpt: '',
            optDialog: false,
            selectGame: '',
            videoUrl: 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0',
            GamesCategory: [],
            BetOptions: [],
            Team: [],
            ScheduledGames: [],
            selectTeamTwo: '',
            selectTeamOne: '',
            schedDialog: false,
            betOptionsDialog: false,
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
        this.$binding('LiveGames', this.$db.collection('LiveGames'))
        .then(LiveGames => {
          console.log(LiveGames, 'LiveGames')
        })
    },
}
</script>
