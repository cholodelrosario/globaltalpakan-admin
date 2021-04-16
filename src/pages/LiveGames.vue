<template>
  <q-page class="bg-white">
      <div>
          <div full-width>
                <q-tabs v-model="gameCategory" inline-label class="bg-yellow shadow-2 col-12" >
                    <div class="row">
                        <q-tab name="ALL" label="ALL" />
                        <q-tab :name="i.games" :label="i.games" v-for="(i, index) in GamesCategory" :key="index" />
                    </div>        
                </q-tabs>
            <div class="q-pa-md">
                <q-card >
                    <div class="col-12">
                        <q-card-section>
                            <div class="q-pl-sm q-pr-sm text-overline flex flex-center">
                                <b>Current Live For : <b class="text-h6">{{this.gameCategory == 'ALL' ? 'Please Select Games' : this.gameCategory}}</b></b>
                            </div>
                        </q-card-section>
                    </div>
                    <div v-for="(l, liveIndex) in live" :key="liveIndex" class="row">
                        <div class="col-5 q-pr-sm q-pb-sm q-pl-sm">
                            <template>
                                <q-video :ratio="8/4" :src="l.videoLink"/>
                            </template>
                        </div>
                        <div class="col">
                            <div align="center" class="flex flex-center row q-gutter-md">
                                <div class="col-5 bg-red text-overline column justify-between">
                                    <q-item-label class="q-pt-xs">{{l.teamRed.team}}</q-item-label>
                                </div>
                                <div class="col-5 bg-blue text-overline column justify-between">
                                    <q-item-label class="q-pt-xs q-ml-sx">{{l.teamBlue.team}}</q-item-label>
                                </div>
                            </div>
                            <div v-show="l.betOptions.length != 0" class="q-pt-md q-pl-md q-pr-md q-pb-sm flex flex-center"><b>BET OPTIONS:</b></div>
                            <div v-for="(c, indexxx) in l.betOptions" :key="indexxx" class="flex flex-center">
                                    <div v-show="l.betOptions != null" class="q-pa-sm flex flex-center col column justify-between">
                                        <q-badge color="orange" text-color="black">
                                            <q-item-label class="text-h6 flex flex-center">{{c.name}}</q-item-label>
                                        </q-badge>
                                    </div>
                            </div>
                            <div class="q-pa-sm row items-start q-gutter-md flex flex-center">
                                <div class="col-6 q-pl-xl text-overline">Betting Status: <q-badge outline :color="l.bettingStatus == true ? 'green' : 'black' " :label="l.status" /> <q-toggle @input="activate(l)" v-model="l.bettingStatus" color="green"/> </div>
                                <div class="col text-overline">Game Status: <q-badge outline :color="l.gameStatus == true ? 'green' : 'black' " :label="l.gameStatus == true ? 'On Going' : 'Cancelled' " /> <q-toggle v-show="l.bettingStatus == false" @input="gameStats(l)" :disable="l.gameStatus == false" v-model="l.gameStatus" color="green"/> </div>
                                <div v-show="l.gameStatus == false" class="text-overline">Go to Bet Management For Cancelled Games Refund</div>
                            </div>
                        </div>
                    </div>
                    <div v-show="live.length == 0" class="q-pr-md q-pl-md q-pb-lg">
                        <div align="center" class="flex flex-center row q-gutter-md">
                            <div class="col-5 bg-red text-overline column justify-between">
                                <q-item-label class="text-h6">NO LIVE DATA AVAILABLE</q-item-label>
                            </div>
                        </div>    
                    </div>
                     <!-- <q-card-actions v-show="live.length != 0" align="right" class="text-dark">
                        <q-btn flat label="Cancel this Game" v-close-popup />
                    </q-card-actions> -->
                </q-card>
            </div>
            <q-separator />
            <div class="q-pa-sm">
                <q-table title="Scheduled Games" grid :data="asc" :columns="columns" :filter="filter" class="full-width align-center " row-key=".key">
                    <template v-slot:top-right>
                        <q-input bordered dense outlined debounce="300" v-model="filter" placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                        </q-input>
                    </template>
                    <template v-slot:item="props">
                        
                        <div class="q-pa-xs col-md-6 grid-style-transition">
                            <q-card class="my-card" >
                                <div class="col-12">
                                    <q-card-section>
                                        <div class="q-pb-sm q-pr-sm q-pl-sm row items-start q-gutter-md">
                                            <div class="col-8 row">
                                                <q-item-label class="text-h6 flex flex-center">No:</q-item-label>
                                                <q-chip padding="none" color="orange" text-color="white" icon-right="star">
                                                    {{props.row.gameNumber}}
                                                </q-chip>
                                            </div>
                                            <div class="col" v-show="gameCategory != 'ALL'">
                                                <q-btn icon="send" dense label="Go Live" @click="updateLive(props.row)" flat color="accent" >
                                                    <q-tooltip>Live this Event</q-tooltip>
                                                </q-btn>
                                            </div>
                                        </div>
                                        <div class="q-pb-sm q-pl-sm q-pr-sm text-h6 flex flex-center">
                                            <b>{{props.row.gameCategory}}</b>
                                        </div>
                                        <div align="center" class="flex flex-center row q-gutter-md">
                                                <div class="col-5 bg-red text-overline column justify-between">
                                                    <q-item-label class="q-pt-xs">{{props.row.teamRed.team}}</q-item-label>
                                                </div>
                                                <div class="col-5 bg-blue text-overline column justify-between">
                                                    <q-item-label class="q-pt-xs q-ml-sx">{{props.row.teamBlue.team}}</q-item-label>
                                                </div>
                                        </div>
                                        <div v-show="props.row.betOptions.length != 0" class="q-pt-md q-pl-md q-pr-md q-pb-sm flex flex-center"><b>BET OPTIONS:</b></div>
                                        <div v-for="(b, indexx) in props.row.betOptions" :key="indexx" class="flex flex-center">
                                                <div v-show="props.row.betOptions != null" class="q-pa-sm flex flex-center col column justify-between">
                                                    <q-badge color="orange" text-color="black">
                                                        <q-item-label class="text-h6 flex flex-center">{{b.name}}</q-item-label>
                                                    </q-badge>
                                                </div>
                                        </div>
                                    </q-card-section>
                                </div>
                            </q-card>
                        </div>
                    </template>
                </q-table>
            </div>
            
          </div>
      </div>
        <q-dialog v-model="schedDialog">
            <q-card class="column full-height" style="width: 700px">  
                <q-card-section>
                    <div class="row items-start q-gutter-md">
                        <div class="text-h6 col-7">New Games</div>
                        <div class="col">
                            <q-input outlined v-model="gameNo" label="Enter Game Number"/>
                        </div>
                    </div>
                </q-card-section>

                <q-card-section class="col q-pt-none scroll">
                    <template>
                        <q-video :ratio="14/7" :src="videoUrl"/>
                    </template>
                    <div class="q-pt-sm q-pb-sm row items-start q-gutter-md">
                        <div class="col-4">
                            <q-select outlined v-model="selectGame" :options="gamesOption" emit-value map-options label="Select Game" />
                        </div>
                        <div class="col column">
                            <q-input outlined v-model="videoUrl" label="Enter Video Url."/>
                        </div>
                    </div>
                    <q-separator/>
                    <div class="q-pt-sm q-pb-sm row items-start q-gutter-md">
                        <div class="col column" >
                            <q-input hint="Start of Event" outlined v-model="dateFrom">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-date v-model="dateFrom" mask="YYYY-MM-DD HH:mm">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Ok" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>

                            <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-time v-model="dateFrom" mask="YYYY-MM-DD HH:mm" format24h>
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Ok" color="primary" flat />
                                    </div>
                                    </q-time>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                            </q-input>
                        </div>
                        <q-separator vertical inset />
                        <div class="col column" >
                            <q-input hint="End of Event" outlined v-model="dateTo">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-date v-model="dateTo" mask="YYYY-MM-DD HH:mm">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Ok" color="primary" flat />
                                    </div>
                                    </q-date>
                                </q-popup-proxy>
                                </q-icon>
                            </template>

                            <template v-slot:append>
                                <q-icon name="access_time" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-time v-model="dateTo" mask="YYYY-MM-DD HH:mm" format24h>
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Ok" color="primary" flat />
                                    </div>
                                    </q-time>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                            </q-input>
                        </div>
                    </div>
                    <q-separator/>
                    <div class="q-pt-sm q-pb-sm row items-start q-gutter-md">
                        <div class="col column bg-red text-white">
                            <div class="text-h6 text-center">
                                <q-select class="col column justify-between" emit-value map-options v-model="selectTeamOne" outlined :options="teamOptionOne" label="Select Team" />
                            </div>
                        </div>
                        <q-separator vertical inset />
                        <div class="col column bg-blue text-white">
                            <div class="text-h6">
                                <q-select class="col column justify-between" emit-value map-options v-model="selectTeamTwo" outlined :options="teamOptionTwo" label="Select Team" />
                            </div>
                        </div>
                    </div>
                    <q-separator  />
                    <div class="row q-gutter-md">
                        <div class="col column justify-between text-overline q-pa-sm">ADD ANOTHER BET OPTIONS</div>
                        <div class="column q-pa-sm">
                            <q-btn @click="optDialog = true" class="col column justify-between" label="Add Options" padding="none" style="width: 150px" color="accent" icon="add">
                                <q-tooltip> Add Bet Options </q-tooltip>
                            </q-btn>
                        </div>
                    </div>
                    <q-separator  />
                    <div>
                        <q-list v-for="(i, index) in this.Options" :key="index" dense>
                            <div class="q-pl-sm row q-gutter-md">
                                    <div class="col column justify-between">
                                        <q-badge color="orange" text-color="black">
                                            <q-item-label class="q-pa-lg text-h6">{{i.betsopt}}</q-item-label>
                                        </q-badge>
                                    </div>
                            </div>
                            <q-separator/>
                            <q-separator/>
                            <q-separator/>
                        </q-list>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Schedule Game" @click="schedEvents()" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="optDialog" persistent>
            <q-card style="min-width: 350px">
                <q-card-section>
                <div class="text-h6">Select Bet Options</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-select class="col column justify-between" emit-value map-options v-model="betOpt" outlined :options="betOptions" label="Select Team" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Add Options" @click="addOptions()" v-close-popup />
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
                return liveG
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
            gameCategory: 'ALL',
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
