<template>
    <q-page padding>
        <q-table grid :data="Team" :columns="columns" :filter="filter" class="full-width align-center " row-key=".key">
            <template v-slot:item="props">
                <div class="q-pa-xs col-md-6 grid-style-transition">
                    <q-card class="my-card" flat bordered>
                        <q-card-section class="col-6" horizontal>
                            <q-card-section class="q-pt-xs">
                            <div class="text-overline">{{props.row.game}}</div>
                            <div class="row">
                                <div class="text-h5 q-mt-sm q-mb-xs">{{props.row.team}}</div> &nbsp;&nbsp;&nbsp;
                                <div class="text-overline">({{props.row.win}}-{{props.row.lose}})</div>
                                <div class="text-overline"><b></b><b>({{props.row.winrate}}%)</b></div>
                            </div>
                            <div class="text-caption text-grey">
                                <div>
                                    <div class="row q-gutter-md">
                                        <div class="col-5 column justify-between">
                                            <b>Player</b>
                                        </div>
                                        <div class="col-5 q-pl-lg column justify-between">
                                            <b>Status</b>
                                        </div>
                                        <!-- <div class="q-pl-xl col column justify-between">
                                            <b>Action</b>
                                        </div> -->
                                    </div>
                                    <q-scroll-area style="height: 120px;">
                                        <q-list v-for="(i, index) in props.row.player" :key="index" dense>
                                            <div class="q-pl-sm row q-gutter-md">
                                                    <div class="col-6 column justify-between">
                                                        <q-item-label class="q-pt-xs">{{i.Name}}</q-item-label>
                                                    </div>
                                                    <div class="col-4 column justify-between">
                                                        <q-item-label class="q-pt-xs q-ml-sx">{{i.Status}}</q-item-label>
                                                    </div>
                                            </div>
                                        </q-list>
                                    </q-scroll-area>
                                </div>
                            </div>
                            </q-card-section>

                            <q-card-section class="q-ml-xl col-5 flex flex-center">
                            <q-img
                                :ratio="4/3"
                                class="rounded-borders"
                                :src="props.row.link"
                            />
                            </q-card-section>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions align="center">
                            <q-btn label="Edit" padding="none" style="width: 30px" @click="openEditDialog(props.row)" class=" col column justify-between" color="accent" icon="mdi-pencil">
                                <q-tooltip> Edit Team </q-tooltip>
                            </q-btn>
                            <q-btn label="Delete" padding="none" style="width: 30px" class=" col column justify-between" color="negative" icon="delete" @click="openDeleteDialog(props.row)">
                                <q-tooltip> Delete Team </q-tooltip>
                            </q-btn>
                        </q-card-actions>
                        </q-card>
                </div>
            </template>
            <template v-slot:top-right>
                <q-input bordered outlined debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
                </q-input>
            </template>
        </q-table>

        <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn fab icon="add" color="accent" @click="addTeamDialog = true" />
                <q-tooltip>
                    Add Team
                </q-tooltip>
        </q-page-sticky>
        <!--dialog-->
        <q-dialog v-model="addTeamDialog" persistent>
            <q-card style="min-width: 750px">
                <q-card-section>
                    <div class="text-h6">New Team</div>
                </q-card-section>

                <q-card-section>
                    <div style="margin-top: -40px" class="q-pa-md row q-gutter-md">
                        <div class="col column justify-between">
                            <q-img style="border: 2px solid;border-color: #ffc400;" :src="siteUrl" :ratio="4/3" />
                            <q-input class="q-pa-xs" outlined v-model="siteUrl" label="Enter Img Url."/>
                        </div>
                        <q-separator vertical inset />
                        <div class="col column">
                            <q-select class="q-pa-xs" v-model="gametype" dense outlined :options="gamesOption" label="Select Game" />
                            <q-input class="q-pa-xs" v-model="teamName" dense outlined label="Team"/>
                            <div class="q-pa-xs row q-gutter-md">
                                <b style="margin-top: 30px">Standing:</b>
                                <q-input class="col column justify-between" outlined input-class="text-center" v-model.number="win" type="number" dense label="Win" />
                                <q-input class="col column justify-between" outlined input-class="text-center" v-model.number="lose" type="number" dense label="Lose" />
                                <b class="col column justify-between" style="margin-top: 30px">WinRate:</b>
                                <b class="col column justify-between" style="margin-top: 30px">{{winrate}}%</b>
                            </div>
                            <q-separator/>
                            <div class="q-pt-sm row q-gutter-md">
                                <b class="col column justify-between"> </b>
                                <q-btn class="column justify-between" label="Add Players" padding="none" @click="playerDialog = true" style="width: 150px" color="accent" icon="add">
                                    <q-tooltip> Add Players </q-tooltip>
                                </q-btn>
                            </div>
                            <div>
                                <div class="q-pl-md row q-gutter-md">
                                    <div class="col column justify-between">
                                        <b>Player</b>
                                    </div>
                                    <div class="q-pl-lg col column justify-between">
                                        <b>Status</b>
                                    </div>
                                    <div class="q-pl-xl col column justify-between">
                                        <b>Action</b>
                                    </div>
                                </div>
                                <q-scroll-area style="height: 120px;">
                                    <q-list v-for="(i, index) in this.Player" :key="index" dense>
                                        <div class="q-pl-sm row q-gutter-md">
                                                <div class="col column justify-between">
                                                    <q-item-label class="q-pt-xs">{{i.Name}}</q-item-label>
                                                </div>
                                                <div class="col column justify-between">
                                                    <q-item-label class="q-pt-xs">{{i.Status}}</q-item-label>
                                                </div>
                                                <div class="col column justify-between">
                                                    <q-item-label class="row">
                                                        <q-btn padding="none" flat size="sm" @click="deletePlayer(index)" style="height:23px" class="col column justify-between" color="negative" icon="mdi-delete">
                                                            <q-tooltip> Delete Players </q-tooltip>
                                                        </q-btn>
                                                    </q-item-label>
                                                </div>
                                        </div>
                                    </q-list>
                                </q-scroll-area>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Team" v-close-popup v-on:click="addTeam" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!-- AddPlayer -->
        <q-dialog v-model="playerDialog" persistent>
            <q-card style="width: 500px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6">Add Player</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="row q-gutter-md">
                        <q-input class="col column justify-between" v-model="playerName" dense label="Player Name"/>
                        <q-select class="col column justify-between" v-model="status" dense :options="options" label="Select Status" />
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="OK" @click="addPlayer()" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!-- Edit Player Dialog -->
        <q-dialog v-model="editPlayer" persistent>
            <q-card style="width: 500px; max-width: 80vw;">
                <q-card-section>
                    <div class="text-h6">Edit Player</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <div class="row q-gutter-md">
                        <q-input class="col column justify-between" v-model="updatePlayerName" dense label="Player Name"/>
                        <q-select class="col column justify-between" v-model="updateStatus" dense :options="options" label="Select Status" />
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="OK" @click="saveEditArray()" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
            <!--Modal for upadate-->
        <q-dialog v-model="editDialog" persistent>
            <q-card style="min-width: 750px">
                <q-card-section>
                    <div class="text-h6">Edit Team</div>
                </q-card-section>

                <q-card-section>
                    <div style="margin-top: -40px" class="q-pa-md row q-gutter-md">
                        <div class="col column justify-between">
                            <q-img style="border: 2px solid;border-color: #ffc400;" :src="updateLink" :ratio="4/3" />
                            <q-input class="q-pa-xs" outlined v-model="updateLink" label="Enter Img Url."/>
                        </div>
                        <q-separator vertical inset />
                        <div class="col column">
                            <q-select class="q-pa-xs" v-model="updateGame" dense outlined :options="gamesOption" label="Select Game" />
                            <q-input class="q-pa-xs" v-model="updateTeam" dense outlined label="Team"/>
                            <div class="q-pa-xs row q-gutter-md">
                                <b style="margin-top: 30px">Standing:</b>
                                <q-input class="col column justify-between" outlined input-class="text-center" v-model.number="updateWin" type="number" dense label="Win" />
                                <q-input class="col column justify-between" outlined input-class="text-center" v-model.number="updateLose" type="number" dense label="Lose" />
                                <b class="col column justify-between" style="margin-top: 30px">WinRate:</b>
                                <b class="col column justify-between" style="margin-top: 30px">{{updateWinrate}}%</b>
                            </div>
                            <q-separator/>
                            <div class="q-pt-sm row q-gutter-md">
                                <b class="col column justify-between"> </b>
                                <q-btn class="column justify-between" label="Add Players" padding="none" @click="playerDialog = true" style="width: 150px" color="accent" icon="add">
                                    <q-tooltip> Add Players </q-tooltip>
                                </q-btn>
                            </div>
                            <div>
                                <div class="q-pl-md row q-gutter-md">
                                    <div class="col column justify-between">
                                        <b>Player</b>
                                    </div>
                                    <div class="q-pl-lg col column justify-between">
                                        <b>Status</b>
                                    </div>
                                    <div class="q-pl-xl col column justify-between">
                                        <b>Action</b>
                                    </div>
                                </div>
                                <q-scroll-area style="height: 120px;">
                                    <q-list v-for="(i, index) in this.updatePlayers" :key="index" dense>
                                        <div class="q-pl-sm row q-gutter-md">
                                                <div class="col column justify-between">
                                                    <q-item-label class="q-pt-xs">{{i.Name}}</q-item-label>
                                                </div>
                                                <div class="col column justify-between">
                                                    <q-item-label class="q-pt-xs">{{i.Status}}</q-item-label>
                                                </div>
                                                <div class="col column justify-between">
                                                    <q-item-label class="row">
                                                        <q-btn padding="none" flat size="sm" @click="openEditPlayer(i,index)" style="height:23px" class="col column justify-between" color="accent" icon="mdi-pencil">
                                                            <q-tooltip> Edit Players </q-tooltip>
                                                        </q-btn>
                                                    </q-item-label>
                                                </div>
                                        </div>
                                    </q-list>
                                </q-scroll-area>
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Update Team" v-close-popup v-on:click="setTask()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            updatePlayerName: '',
            updateStatus: null,
            editPlayer: false,
            options: [ 'Playing', 'Not Playing' ],
            status: '',
            playerName: '',
            playerDialog: false,
            wr: 0,
            lose: 0,
            win: 0,
            gametype: null,
            updateGame: null,
            updatePlayers: [],
            updateWin: 0,
            updateLose: 0,
            siteUrl: '',
            teamName: '',
            updateTeam: '',
            updateLink: '',
            addTeamDialog: false,
            editDialog: false,
            Team: [],
            Games: [],
            Player: [],
            filter: '',
            columns: [
                { name: 'team', required: true, label: 'Team', align: 'left', field: 'team', sortable: true },
                { name: 'game', required: true, label: 'Games', align: 'left', field: 'game', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    }, 
    mounted () {
       this.$binding('Team', this.$db.collection('Team'))
        .then(Team => {
          console.log(Team, 'Team')
        }),
        this.$binding('Games', this.$db.collection('Games'))
        .then(Games => {
          console.log(Games, 'Games')
        })
    },
    computed:{
        gamesOption(){
                let optionss = this.Games.map(Games => {
                    return {
                        label: Games.games,
                        value: Games.games
                    }
                })
                return optionss
            },
        tmatch(){
            let totalmatch = parseInt(this.win) + parseInt(this.lose)
               return totalmatch
        },
        winrate(){
            if(this.lose === 0 && this.win === 0){
                return this.wr = 0
            }else{
               this.wr = ( parseInt(this.win) / parseInt(this.tmatch) ) * 100 
               console.log(parseInt(this.wr), 'wr')
                return parseInt(this.wr)   
            }
        },
        updateTmatch(){
            let totalmatch = parseInt(this.updateWin) + parseInt(this.updateLose)
               return totalmatch
        },
        updateWinrate(){
            if(this.updateLose === 0 && this.updateWin === 0){
                return this.wr = 0
            }else{
               this.wr = ( parseInt(this.updateWin) / parseInt(this.updateTmatch) ) * 100 
               console.log(parseInt(this.wr), 'wr')
                return parseInt(this.wr)   
            }
        },
    },
    methods: {
        deletePlayer(index){
                    this.Player.splice(index, 1)
        },
        addPlayer(){
            var players = {
                Name: this.playerName,
                Status: this.status,
            }
            if(this.playerName === '' || this.status === '') {
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
                this.Player.push(players)
                this.$q.notify({
                        message: 'Team Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.playerName = ''
                    this.status = ''
            })
        },
        addTeam(){
            var newTeam = {
                team: this.teamName,
                link: this.siteUrl,
                game: this.gametype.value,
                win: this.win,
                lose: this.lose,
                winrate: this.winrate,
                player: this.Player
            }
            console.log(newTeam,'team')
            if(this.teamName === '' && this.siteUrl === '' && this.win === 0) {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
            })
            }else
                this.$q.dialog({
                title: 'Add Team',
                message: 'Add This Team?',
                ok: 'Yes',
            }).onOk(() => { 
                this.$db.collection('Team').add(newTeam)
                this.$q.notify({
                        message: 'Team Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.teamName = ''
                    this.siteUrl = ''
            })
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Team',
            message: 'Delete This Team?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('Team').doc(id).delete()
                this.$q.notify({
                        message: 'Team Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        openEditDialog (task) {
            console.log(task, 'task')
            this.teamId = task['.key']
            this.updateTeam = task.team
            this.updateGame = task.game
            this.updateLink = task.link
            this.updateWin = task.win
            this.updateLose = task.lose
            this.updatePlayers = task.player
            this.editDialog = true
        },
        saveEditArray(){
            this.updatePlayers[this.selectedIndex].Status = this.updateStatus
            this.updatePlayers[this.selectedIndex].Name = this.updatePlayerName
        },
        openEditPlayer (i,index) {
            console.log(i, 'i')
            console.log(index, 'index')
            this.selectedIndex = index
            this.updatePlayerName = i.Name
            this.updateStatus = i.Status
            this.editPlayer = true
        },
        setTask(){
            var teamBago = {
                team: this.updateTeam,
                link: this.updateLink,
                game: this.updateGame,
                win: this.updateWin,
                lose: this.updateLose,
                winrate: this.updateWinrate,
                player: this.updatePlayers
            }
            if(this.updateTeam === '' || this.updateLink === ''){
                this.$q.dialog({
                title: 'Field Required!',
                message: 'Fill all Requirements?',
                ok: 'Ok',
                cancel: 'Cancel'
                })
                }else
                this.$q.dialog({
                title: 'Update Team',
                message: 'Update This Team?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('Team').doc(this.teamId).set(teamBago)
                this.$q.notify({
                        message: 'Team Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.editDialog = false  
            })  
        }
    }
}
</script>