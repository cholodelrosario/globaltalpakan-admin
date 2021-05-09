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
                            <!-- <q-card class="my-card bg-secondary"> STYX CODE
                                <div class="col-12">
                                    <q-card-section>
                                        <div class="q-pb-sm q-pr-sm q-pl-sm row items-start q-gutter-md">
                                            <div class="col-9 row">
                                                <q-item-label class="text-h6 flex flex-center">No:</q-item-label>
                                                <q-chip padding="none" color="orange" text-color="white" icon-right="star">
                                                    {{props.row.gameNumber}}
                                                </q-chip>
                                            </div>
                                            <div class="col">
                                                <q-btn icon="delete" dense label="Delete" flat color="negative" @click="openDeleteDialog(props.row)">
                                                    <q-tooltip> Delete Event </q-tooltip>
                                                </q-btn>
                                            </div>
                                        </div>
                                        <div>
                                            <template>
                                                <q-video :ratio="10/5" :src="props.row.videoLink"/>
                                            </template>
                                        </div>
                                        <div class="q-pa-sm flex flex-center">
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
                                                    <q-badge class="flex flex-center" color="orange" text-color="black">
                                                        <q-item-label class="text-h6 q-pa-sm flex flex-center">{{b.name}}</q-item-label>
                                                    </q-badge>
                                                </div>
                                        </div>
                                    </q-card-section>
                                </div>
                            </q-card> -->
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

                                <q-card-actions v-show="props.row.showedLive !== true">
                                    <q-btn flat round icon="edit" @click="openEditDialog(props.row), openEditGames(props.row)" color="grey"/>
                                    <q-btn flat round icon="delete" color="grey" @click="openDeleteDialog(props.row)"/>
                                    <q-btn flat color="grey" size="sm" v-show="props.row.betOptions.length > 0" @click="viewBetOptionsDialog(props.row.betOptions)">
                                    view bet options list ({{props.row.betOptions.length}})
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
      <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn fab icon="add" color="primary" class="text-black" @click="schedDialog = true" />
                <q-tooltip>
                    Schedule Games
                </q-tooltip>
        </q-page-sticky>
        <!-- Schedule Dialog -->
        <q-dialog v-model="schedDialog">
            <q-card class="column full-height bg-dark text-white" style="width: 700px">  
                <q-card-section>
                    <div class="row items-start q-gutter-md">
                        <div class="text-h6 col-7">New Game Schedule</div>
                        <div class="col">
                            <q-input dark outlined filled dense v-model="gameNo" label="Enter Game Number"/>
                        </div>
                    </div>
                </q-card-section>

                <q-card-section class="col q-pt-none scroll q-gutter-md">
                    <template>
                        <q-video :ratio="14/7" :src="videoUrl"/>
                    </template>

                    <q-select dark outlined v-model="selectGame" :options="gamesOption" emit-value map-options label="Select Game" class="q-pt-md" />

                    <q-input dark outlined v-model="videoUrl" label="Enter Video Url."/>
    
                    <div class="row items-start">
                        <div class="col column q-mr-md" >
                            <q-input dark hint="Start of Event" outlined v-model="dateFrom">
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
                        <div class="col column" >
                            <q-input dark hint="End of Event" outlined v-model="dateTo">
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
                    <div class="row items-start">
                        <div class="col column bg-red text-white q-mr-md">
                            <div class="text-h6 text-center">
                                <q-select class="col column justify-between" emit-value map-options v-model="selectTeamOne" outlined :options="teamOptionOne" label="Select Team" />
                            </div>
                        </div>
                        <div class="col column bg-blue text-white">
                            <div class="text-h6">
                                <q-select class="col column justify-between" emit-value map-options v-model="selectTeamTwo" outlined :options="teamOptionTwo" label="Select Team" />
                            </div>
                        </div>
                    </div>

                    <div class="row q-gutter-md">
                        <div class="col column justify-between text-overline q-pa-sm">ADD ANOTHER BET OPTIONS</div>
                        <div class="column q-pa-sm">
                            <q-btn flat @click="optDialog = true" class="col column justify-between" label="Add Options" padding="none" style="width: 150px" color="grey" icon="add">
                                <q-tooltip> Add Bet Options </q-tooltip>
                            </q-btn>
                        </div>
                    </div>

                    <div>
                        <q-list v-for="(i, index) in this.Options" :key="index" bordered>
                            <q-item class="bg-secondary text-white ">
                                <q-item-section>
                                    <q-item-label class="text-h6 q-pa-sm">{{i.name}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-btn color="grey" flat size="sm"  icon="close" label="remove" @click="removeBetOptions(index)" />
                                </q-item-section>
                            </q-item>
                            <!-- <div class="q-pl-sm row q-gutter-md">
                                    <div class="col column justify-between">
                                        <q-badge color="secondary" text-color="white">
                                            <q-item-label class="q-pa-lg text-h6">{{i.name}}</q-item-label>
                                        </q-badge>

                                    </div>
                            </div> -->
                        </q-list>
                    </div>
                </q-card-section>
                <q-separator  />
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Schedule Game" @click="schedEvents()" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="updateScheduledGames" persistent>
            <q-card class="column full-height bg-dark text-white" style="width: 700px">
                <q-card-section>
                    <div class="row items-start q-gutter-md">
                        <div class="text-h6 col-7">Edit Game Schedule</div>
                        <div class="col">
                            <q-input dark outlined filled dense v-model="editGameNo" label="Enter Game Number"/>
                        </div>
                    </div>
                </q-card-section>

                <q-card-section class="col q-pt-none scroll q-gutter-md">
                    <template>
                        <q-video :ratio="14/7" :src="editVideoUrl"/>
                    </template>

                    <q-select dark outlined v-model="editSelectGame" @input="changeGames()" :options="gamesOption" emit-value map-options label="Select Game" class="q-pt-md" />

                    <q-input dark outlined v-model="videoUrl" label="Enter Video Url."/>
    
                    <div class="row items-start">
                        <div class="col column q-mr-md" >
                            <q-input dark hint="Start of Event" outlined v-model="editdateFrom">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-date v-model="editdateFrom" mask="YYYY-MM-DD HH:mm">
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
                                    <q-time v-model="editdateFrom" mask="YYYY-MM-DD HH:mm" format24h>
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Ok" color="primary" flat />
                                    </div>
                                    </q-time>
                                </q-popup-proxy>
                                </q-icon>
                            </template>
                            </q-input>
                        </div>
                        <div class="col column" >
                            <q-input dark hint="End of Event" outlined v-model="editdateTo">
                            <template v-slot:prepend>
                                <q-icon name="event" class="cursor-pointer">
                                <q-popup-proxy transition-show="scale" transition-hide="scale">
                                    <q-date v-model="editdateTo" mask="YYYY-MM-DD HH:mm">
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
                                    <q-time v-model="editdateTo" mask="YYYY-MM-DD HH:mm" format24h>
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
                    <div class="row items-start">
                        <div class="col column bg-red text-white q-mr-md">
                            <div class="text-h6 text-center">
                                <q-select class="col column justify-between" emit-value map-options v-model="selectTeamOne" outlined :options="teamOptionOne" label="Select Team" />
                            </div>
                        </div>
                        <div class="col column bg-blue text-white">
                            <div class="text-h6">
                                <q-select class="col column justify-between" emit-value map-options v-model="selectTeamTwo" outlined :options="teamOptionTwo" label="Select Team" />
                            </div>
                        </div>
                    </div>

                    <div class="row q-gutter-md">
                        <div class="col column justify-between text-overline q-pa-sm">ADD ANOTHER BET OPTIONS</div>
                        <div class="column q-pa-sm">
                            <q-btn flat @click="editOptDialog = true" class="col column justify-between" label="Add Options" padding="none" style="width: 150px" color="grey" icon="add">
                                <q-tooltip> Add Bet Options </q-tooltip>
                            </q-btn>
                        </div>
                    </div>

                    <div>
                        <q-list v-for="(i, index) in this.editOptions" :key="index" bordered>
                            <q-item class="bg-secondary text-white ">
                                <q-item-section>
                                    <q-item-label class="text-h6 q-pa-sm">{{i.name}}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-btn color="grey" flat size="sm"  icon="close" label="remove" @click="removeEditBetOptions(index)" />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </q-card-section>
                <q-separator  />
                <q-card-actions align="right">
                    <q-btn flat label="Cancel" @click="cancel()" v-close-popup />
                    <q-btn flat label="Update Scheduled Games" @click="updateSchedEvents()" v-close-popup />
                </q-card-actions>
            </q-card>    
        </q-dialog>
        <q-dialog v-model="editOptDialog" persistent>
            <q-card class="bg-secondary text-white" style="min-width: 350px">
                <q-card-section>
                <div class="text-h6">Select Bet Options</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-select dark class="col column justify-between" emit-value map-options v-model="editBetOpt" outlined :options="editBetOptions" label="Select Options" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Add Options" @click="addEditOptions()" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="optDialog" persistent>
            <q-card class="bg-secondary text-white" style="min-width: 350px">
                <q-card-section>
                <div class="text-h6">Select Bet Options</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <q-select dark class="col column justify-between" emit-value map-options v-model="betOpt" outlined :options="betOptions" label="Select Options" />
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Add Options" @click="addOptions()" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
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
        changeGames(){
            if(this.selectGameEdit !== this.editSelectGame.games){
                this.selectTeamOne = ''
                this.selectTeamTwo = ''
                this.editOptions = []
                this.selectGameEdit = this.editSelectGame.games
            }
        },
        openEditGames(task){
            this.selectGameEdit = task.gameCategory
        },
        updateSchedEvents(){
            var updateEvents = {
                bettingStatus: true,
                gameStatus: true,
                gameCategory: this.editSelectGame.games === undefined ? this.editSelectGame : this.editSelectGame.games,
                gameKey: this.editSelectGame.games === undefined ? this.editGameKey : this.editSelectGame['.key'],
                betOptions: this.editOptions,
                gameNumber: this.editGameNo,
                scheduledTime: {
                    from: date.formatDate(this.editdateFrom, 'YYYY-MM-DD HH:mm'),
                    to: date.formatDate(this.editdateTo, 'YYYY-MM-DD HH:mm'),
                },
                status: 'OPEN',
                tag: 'MIRROR',
                teamBlue: {
                    team: this.selectTeamOne.team === undefined ? this.selectTeamOne : this.selectTeamOne.team,
                },
                teamBlueKey: this.selectTeamOne.team === undefined ? this.teamOneKey : this.selectTeamOne['.key'],
                teamRed: {
                     team: this.selectTeamTwo.team === undefined ? this.selectTeamTwo : this.selectTeamTwo.team,
                },
                teamRedKey: this.selectTeamTwo.team === undefined ? this.teamTwoKey : this.selectTeamTwo['.key'],
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
                trends: this.editTrends,
                videoLink: this.editVideoUrl,
            }
            this.$q.dialog({
                title: 'Update This Events',
                message: 'Update This Events?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('ScheduledGames').doc(this.schedID).set(updateEvents)
                this.$q.notify({
                        message: 'Events! Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                })
                this.updateScheduledGames = false  
            })
        },
        cancel(){
            this.selectTeamOne = ''
            this.selectTeamTwo = ''
            this.updateScheduledGames = false
        },
        openEditDialog (task) {
            this.schedID = task['.key']
            this.editGameNo = task.gameNumber
            this.editVideoUrl = task.videoLink
            this.editSelectGame = task.gameCategory
            this.editGameKey = task.gameKey
            this.editdateFrom = task.scheduledTime.from
            this.editdateTo = task.scheduledTime.to
            this.selectTeamOne = task.teamBlue.team
            this.teamOneKey = task.teamBlueKey
            this.teamTwoKey = task.teamRedKey
            this.selectTeamTwo = task.teamRed.team
            this.editOptions = task.betOptions
            this.editTrends = task.trends
            this.updateScheduledGames = true
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Events',
            message: 'Delete This Events?',
            dark: true,
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
                bettingStatus: true,
                gameStatus: true,
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
                teamBlue: {
                    team: this.selectTeamOne.team,
                },
                teamBlueKey: this.selectTeamOne['.key'],
                teamRed: {
                     team: this.selectTeamTwo.team,
                },
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
                .then(async (doc)=>{
                    await this.$db.collection('MoneyBox').doc(doc.id).set({totalRed: 0,totalBlue:0})
                    await this.saveBetOptionsControl(newEvents.betOptions,newEvents.teamBlue,newEvents.teamRed,doc.id)
                })
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
                    this.selectTeamTwo = ''
                    this.dateFrom = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
                    this.dateTo = date.formatDate(new Date(), 'YYYY-MM-DD HH:mm')
                    this.videoUrl = 'https://www.youtube.com/embed/k3_tw44QsZQ?rel=0'
            })
        },
        async saveBetOptionsControl(array,blue,red,scheduleKey){
            await array.forEach(async a=>{
                console.log('code runs here a')
                await this.$db.collection('BetOptionsLiveControl').doc(`${scheduleKey}-${a.betOptionsKey}`).set({...a,dateCreated:new Date(),status: 'OPEN',teamBlue: blue,teamRed: red,scheduleKey: scheduleKey})
                .then(async ()=>{
                    await this.$db.collection('BetOptionsMoneyBox').doc(`${scheduleKey}-${a.betOptionsKey}`).set({totalRed:0,totalBlue:0,scheduleKey: scheduleKey})
                    console.log('code runs here b')
                })
            })
        },
        removeBetOptions(index){
            this.Options.splice(index,1)
        },
        removeEditBetOptions(index){
            this.editOptions.splice(index,1)
            console.log(this.editOptions, 'sadsadasdasdas')
        },
        addOptions(){
            var OptionBet  = {
                name: this.betOpt.betsopt,
                betOptionsKey: this.betOpt['.key']
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
        addEditOptions(){
            var OptionBet  = {
                name: this.editBetOpt.betsopt,
                betOptionsKey: this.editBetOpt['.key']
            }
            if(this.editBetOpt === '') {
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
                this.editOptions.push(OptionBet)
                this.$q.notify({
                        message: 'Option Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.editBetOpt = ''
            })
            console.log(this.editOptions, 'optionss')
        },
        viewBetOptionsDialog(array){
            this.viewBetOptions = array
            this.betOptionsDialog = true
        }
    },
    computed:{
        asc(){
            if(this.gameCategory == 'ALL'){
                let all = this.$lodash.orderBy(this.ScheduledGames, ['gameNumber'], ['asc']);
                
                return all
            }else{
                let optionss = this.$lodash.filter(this.ScheduledGames, m => {
                    return m.gameCategory == this.gameCategory
                })
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

            let map = betsopts.map(a=>{
                return {
                    ...a,
                    name: a.betsopt
                }
            })

            let diff = this.$lodash.differenceBy(map,this.Options, 'name')
            console.log(diff,'ffd')
            let newBetsOpt = diff.map(betsopts => {
                return {
                    label: betsopts.betsopt,
                    value: betsopts
                }
            }) 
                return newBetsOpt
        },
        editBetOptions(){
            let betsopts = this.$lodash.filter(this.BetOptions, m => {
                if(m.games === this.editSelectGame){
                    return m.betsopt
                }
            })

            let map = betsopts.map(a=>{
                return {
                    ...a,
                    name: a.betsopt
                }
            })

            let diff = this.$lodash.differenceBy(map,this.editOptions, 'name')
            console.log(diff,'ffd')
            let newBetsOpt = diff.map(betsopts => {
                return {
                    label: betsopts.betsopt,
                    value: betsopts
                }
            }) 
                return newBetsOpt
        },
        teamOptionOne(){
            let teams = this.$lodash.filter(this.Team, m => {
                if(this.updateScheduledGames === true){
                    console.log(this.editSelectGame, 'editSelectGame')
                    if(m.game === this.editSelectGame || m.game === this.editSelectGame.games){
                        return m.team
                    }
                }else{
                    if(m.game === this.selectGame.games){
                        return m.team
                    }
                }
                    
            })
            let diff = this.$lodash.differenceBy(teams,this.selectTeamTwo == '' ? [] : [{...this.selectTeamTwo}], 'team')


            let optionss = diff.map(teams => {
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
                if(this.updateScheduledGames === true){
                    if(m.game === this.editSelectGame || m.game === this.editSelectGame.games){
                        return m.team
                    }
                }else{
                    if(m.game === this.selectGame.games){
                        return m.team
                    }
                }
            })

            let diff = this.$lodash.differenceBy(teams,this.selectTeamOne == '' ? [] : [{...this.selectTeamOne}], 'team')



            let optionss = diff.map(teams => {
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
            selectGameEdit: '',
            editTrends: [],
            editBetOpt: '',
            editOptDialog: false,
            editOptions: [],
            editGameNo: '',
            editVideoUrl: '',
            editSelectGame: '',
            updateScheduledGames: false,
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
            editdateFrom: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            editdateTo: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
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
            editselectTeamOne: '',
            editselectTeamTwo:  '',
            selectTeamTwo: '',
            selectTeamOne: '',
            schedDialog: false,
            viewBetOptions: [],
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
    },
}
</script>
