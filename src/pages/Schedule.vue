<template>
  <q-page class="flex flex-center bg-white">
      <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn fab icon="add" color="accent" @click="schedDialog = true" />
                <q-tooltip>
                    Schedule Games
                </q-tooltip>
        </q-page-sticky>
        <!-- Schedule Dialog -->
        <q-dialog v-model="schedDialog">
            <q-card class="column full-height" style="width: 700px">  
                <q-card-section>
                    <div class="text-h6">New Games</div>
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
                    <q-separator  />
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
                                        <q-item-label class="q-pt-xs text-h5">{{i.betsopt}}</q-item-label>
                                    </div>
                            </div>
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
                        </q-list>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Schedule Game" v-close-popup />
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
export default {
    methods:{
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
                title: 'Add Player',
                message: 'Add This Player?',
                ok: 'Yes',
            }).onOk(() => { 
                this.Options.push(OptionBet)
                this.$q.notify({
                        message: 'Team Added!',
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
            Options: [],
            betOpt: '',
            optDialog: false,
            selectGame: '',
            videoUrl: 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0',
            GamesCategory: [],
            BetOptions: [],
            Team: [],
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
    },
}
</script>
