<template>
    <q-page padding class="bg-dark text-white">
        <q-table grid :data="GamesCategory" :columns="columns" :filter="filter" class="full-width align-center " row-key=".key">
            <template v-slot:top-right>
                <q-input bordered dense outlined debounce="300" dark v-model="filter" placeholder="Search">
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
                </q-input>
            </template>
            <template v-slot:item="props">
                
                <div class="q-pa-xs col-sm-6 col-md-4 grid-style-transition">
                    <q-card class="my-card bg-secondary text-white" >
                        <div class="col-12">
                            <q-card-section>
                                <div class="col-6 flex flex-center">
                                    <q-avatar size="200px">
                                        <img :src="props.row.link">
                                    </q-avatar>    
                                </div>
                                <div class="flex flex-center">
                                    <b>{{props.row.games}}</b>
                                </div>
                                <div class="q-pa-md row col-12 q-gutter-md flex flex-center">
                                    <div class="col-5 flex flex-center">
                                        <q-btn style="width: 99px" flat color="grey" icon="mdi-pencil" @click="openEditDialog(props.row)">
                                            <q-tooltip> Edit Games </q-tooltip>  
                                        </q-btn>
                                    </div>
                                    <div class="col-5 flex flex-center">
                                        <q-btn style="width: 99px" flat icon="delete" color="grey" @click="openDeleteDialog(props.row)">
                                            <q-tooltip> Delete Games </q-tooltip>
                                        </q-btn>
                                    </div>
                                </div>
                            </q-card-section>
                        </div>
                    </q-card>
                </div>
            </template>
        </q-table>

        <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
                <q-btn fab icon="add" color="primary" @click="addGamesDialog = true" />
                <q-tooltip>
                    Add Games
                </q-tooltip>
        </q-page-sticky>
        <!--dialog-->
        <q-dialog v-model="addGamesDialog" persistent>
            <q-card class="bg-secondary text-white" style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">New Games</div>
                </q-card-section>

                <q-card-section>
                    <q-input dark class="q-ma-sm" outlined v-model="gamesName" label="Games"/>
                    <q-img class="q-pa-sm" style="border: 2px solid;border-color: #ffc400;" :src="siteUrl" :ratio="4/3" />
                    <q-input dark class="q-ma-sm" outlined v-model="siteUrl" label="Enter Img Url."/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Games" v-close-popup v-on:click="addGames" />
                </q-card-actions>
            </q-card>
        </q-dialog>
            <!--Modal for upadate-->
        <q-dialog v-model="editDialog">
            <q-card class="bg-secondary text-white" style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">Edit Games</div>
                </q-card-section>

                <q-card-section>
                    <q-input dark class="q-ma-sm" outlined v-model="updateGames" label="Games"/>
                    <q-img class="q-pa-sm" style="border: 2px solid;border-color: #ffc400;" :src="updateLink" :ratio="4/3" />
                    <q-input dark class="q-ma-sm" outlined v-model="updateLink" label="Enter Img Url."/>
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
import { date } from 'quasar'
export default {
    data(){
        return {
            siteUrl: '',
            gamesName: '',
            updateGames: '',
            updateLink: '',
            addGamesDialog: false,
            editDialog: false,
            GamesCategory: [],
            filter: '',
            columns: [
                { name: 'games', required: true, label: 'Games', align: 'left', field: 'games', sortable: true },
                { name: 'image', required: true, label: 'Image', align: 'left', field: 'image', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    }, 
    mounted () {
       this.$binding('GamesCategory', this.$db.collection('GamesCategory'))
        .then(GamesCategory => {
          console.log(GamesCategory, 'GamesCategory')
        })
    },
    computed:{

    },
    methods: {
        addGames(){
            var newGames = {
                games: this.gamesName,
                link: this.siteUrl,
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            }
            if(this.gamesName === '' || this.siteUrl === '') {
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
                this.$db.collection('GamesCategory').add(newGames)
                this.$q.notify({
                        message: 'Games Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.gamesName = ''
                    this.siteUrl = ''
            })
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Games',
            message: 'Delete This Games?',
            dark: true,
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                this.$db.collection('GamesCategory').doc(id).delete()
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
            this.updateLink = task.link
            this.editDialog = true
        },
        setTask(){
            var gamesBago = {
                games: this.updateGames,
                link: this.updateLink,
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            }
            if(this.updateGames === '' || this.updateLink === ''){
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
                this.$db.collection('GamesCategory').doc(this.gamseId).set(gamesBago)
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