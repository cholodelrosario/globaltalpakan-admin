<template>
    <q-page padding>
        <q-table title="" :data="Games" :columns="columns" :filter="filter" row-key="name">
            <template v-slot:body="props">
                <q-tr :props="props">
                    <q-td key="games" :props="props">{{props.row.games}}</q-td>
                    <q-td key="action" :props="props">
                        <q-btn no-caps dense color="primary" icon="mdi-pencil" @click="openEditDialog(props.row)"></q-btn>
                        <q-btn no-caps icon="delete" dense color="negative" @click="openDeleteDialog(props.row)"></q-btn>
                    </q-td>  
                </q-tr>
            </template>
            <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
            </template>  
        </q-table>
        <!--FLOATING BUTTON-->
        <q-page-sticky position="top-left" :offset="[18, 18]">
                <q-btn fab icon="add" color="accent" @click="addGamesDialog = true" />
                <q-tooltip>
                    Add Games
                </q-tooltip>
        </q-page-sticky>
        <!--dialog-->
        <q-dialog v-model="addGamesDialog" persistent>
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Games</div>
                </q-card-section>

                <q-card-section>
                    <q-input class="q-ma-sm" v-model="gamesName" label="Games."/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Games" v-close-popup v-on:click="addGames" />
                </q-card-actions>
            </q-card>
        </q-dialog>
            <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">Edit Games</div>
                </q-card-section>

                <q-card-section>
                    <q-input  class="q-ma-sm" v-model="updateGames" label="Games"/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Update" @click="setTask"/>
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    data(){
        return {
            gamesName: '',
            updateGames: '',
            addGamesDialog: false,
            editDialog: false,
            Games: [],
            filter: '',
            columns: [
                { name: 'games', required: true, label: 'Games', align: 'left', field: 'games', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    }, 
    mounted () {
       this.$binding('Games', this.$db.collection('Games'))
        .then(Games => {
          console.log(Games, 'Games')
        })
    },
    computed:{

    },
    methods: {
        addGames(){
            var newGames = {
                games: this.gamesName,
            }
            if(this.gamesName === '') {
              this.$q.dialog({
              title: 'Field Required!',
              message: 'Fill all Requirements?',
              ok: 'Ok',
            })
            }else
                this.$q.dialog({
                title: 'Add Games',
                message: 'Add This Games?',
                ok: 'Yes',
            }).onOk(() => { 
                this.$db.collection('Games').add(newGames)
                this.$q.notify({
                        message: 'Games Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.gamesName = ''
            })
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Games',
            message: 'Delete This Games?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('Games').doc(id).delete()
                this.$q.notify({
                        message: 'Games Deleted!',
                        icon: 'mdi-delete',
                        color: 'negative',
                        textColor: 'white',
                        position: 'center'
                    })
            })
        },
        openEditDialog (task) {
            this.gamseId = task['.key']
            this.updateGames = task.games
            this.editDialog = true
        },
        setTask(){
            var gamesBago = {
                games: this.updateGames,
            }
            if(this.updateGames === ''){
                this.$q.dialog({
                title: 'Field Required!',
                message: 'Fill all Requirements?',
                ok: 'Ok',
                cancel: 'Cancel'
                })
                }else
                this.$q.dialog({
                title: 'Update Games',
                message: 'Update This Games?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('Games').doc(this.gamesId).set(gamesBago)
                this.$q.notify({
                        message: 'Games Updated!',
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