<template>
    <q-page padding>
        <q-table grid title="Betting Options" :data="BetOpt" :columns="columns" row-key="name" :filter="filter" hide-header>
            <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
                </q-input>
            </template>

            <template v-slot:item="props">
                <div class="q-pa-xs col-md-6">
                <q-card class="my-card" flat bordered>
                        <q-card-section class="col-6" horizontal>
                            <q-card-section class="q-pt-xs">
                            <div class="text-h5 q-mt-sm q-mb-xs">{{props.row.games}}</div>
                            <div class="row">
                                <div class="text-overline">{{props.row.betsopt}}</div>
                            </div>
                            </q-card-section>
                        </q-card-section>

                        <q-separator />

                        <q-card-actions align="center">
                            <q-btn label="Edit" padding="none" @click="openEditDialog(props.row)" style="width: 30px" class=" col column justify-between" color="accent" icon="mdi-pencil">
                                <q-tooltip> Edit Team </q-tooltip>
                            </q-btn>
                            <q-btn label="Delete" padding="none" @click="openDeleteDialog(props.row)" style="width: 30px" class=" col column justify-between" color="negative" icon="delete" >
                                <q-tooltip> Delete Team </q-tooltip>
                            </q-btn>
                        </q-card-actions>
                    </q-card>
                </div>
            </template>
        </q-table>
        <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn fab icon="add" color="accent" @click="addBetsDialog = true" />
                <q-tooltip>
                    Add Games
                </q-tooltip>
        </q-page-sticky>
        <!--dialog-->
        <q-dialog v-model="addBetsDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Betting Options</div>
                </q-card-section>

                <q-card-section>
                    <q-select class="col column justify-between" v-model="selectGame" dense :options="gamesOption" label="Select Game" />
                    <q-input class="q-ma-sm" v-model="betsOpt" label="Enter Options."/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Betting Option" v-close-popup @click="addBetsopt()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Betting Options</div>
                </q-card-section>

                <q-card-section>
                    <q-select class="col column justify-between" v-model="updateGame" dense :options="gamesOption" label="Select Game" />
                    <q-input class="q-ma-sm" v-model="updateBetsopt" label="Enter Options"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Update Betting Option" v-close-popup @click="setTask()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            updateGame: null,
            updateBetsopt: '',
            editDialog: false,
            betsOpt: '',
            selectGame: '',
            addBetsDialog: false,
            Games: [],
            BetOpt: [],
            filter: '',
            columns: [
                { name: 'game', label: 'Games', field: 'game' },
                { name: 'betsopt', label: 'Betting Options', field: 'betsopt' }
            ],
        }
    }, 
    mounted () {
       this.$binding('Games', this.$db.collection('Games'))
        .then(Games => {
          console.log(Games, 'Games')
        })
       this.$binding('BetOpt', this.$db.collection('BetOpt'))
        .then(BetOpt => {
          console.log(BetOpt, 'BetOpt')
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
    },
    methods: {
        setTask(){
            var betsBago = {
                games: this.updateGame,
                betsopt: this.updateBetsopt
            }
            if(this.updateGame === '' || this.updateBetsopt === ''){
                this.$q.dialog({
                title: 'Field Required!',
                message: 'Fill all Requirements?',
                ok: 'Ok',
                cancel: 'Cancel'
                })
                }else
                this.$q.dialog({
                title: 'Update Options',
                message: 'Update This Options?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('BetOpt').doc(this.betsID).set(betsBago)
                this.$q.notify({
                        message: 'Options Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.editDialog = false  
            })  
        },
        openEditDialog (task) {
            this.betsID = task['.key']
            this.updateGame = task.games
            this.updateBetsopt = task.betsopt
            this.editDialog = true
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Option',
            message: 'Delete This Option?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('BetOpt').doc(id).delete()
                this.$q.notify({
                        message: 'Option Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        addBetsopt(){
            var newOpt = {
                games: this.selectGame.value,
                betsopt: this.betsOpt
            }
            if(this.selectGame === '' || this.betsOpt === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
            })
            }else
                this.$q.dialog({
                title: 'Add Option',
                message: 'Add This Option?',
                ok: 'Yes',
            }).onOk(() => { 
                this.$db.collection('BetOpt').add(newOpt)
                this.$q.notify({
                        message: 'Option Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.selectGame = ''
                    this.betsOpt = ''
            })
        },
        
    }
}
</script>