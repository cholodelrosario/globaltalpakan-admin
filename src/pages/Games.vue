<template>
    <q-page padding>
        <q-table grid :data="Games" :columns="columns" :filter="filter" class="q-px-sm q-pt-xl full-width align-center " row-key=".key">
            <template v-slot:item="props">
                
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3 col-lg-3 grid-style-transition q-ma-sm">
                    <q-card class="my-card" >
                        <div >
                            <q-card-section>
                                <div>
                                    <q-avatar size="200px">
                                        <img :src="props.row.link">
                                    </q-avatar>    
                                </div>
                                <div class="q-pa-md text-center">
                                    <b>{{props.row.games}}</b>
                                </div>
                                <div class="row q-gutter-md">
                                    <div>
                                        <q-btn style="width: 99px" color="accent" icon="mdi-pencil" @click="openEditDialog(props.row)">
                                            <q-tooltip> Edit Games </q-tooltip>  
                                        </q-btn>
                                    </div>
                                    <div>
                                        <q-btn style="width: 99px" icon="delete" color="negative" @click="openDeleteDialog(props.row)">
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
                    <q-input class="q-ma-sm" v-model="gamesName" label="Games"/>
                    <q-img :src="siteUrl" :ratio="4/3" />
                    <q-input class="q-ma-sm" v-model="siteUrl" label="Enter Img Url."/>
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
                    <q-img :src="updateLink" :ratio="4/3" />
                    <q-input class="q-ma-sm" v-model="updateLink" label="Enter Img Url."/>
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
            siteUrl: '',
            gamesName: '',
            updateGames: '',
            updateLink: '',
            addGamesDialog: false,
            editDialog: false,
            Games: [],
            filter: '',
            columns: [
                { name: 'games', required: true, label: 'Games', align: 'left', field: 'games', sortable: true },
                { name: 'image', required: true, label: 'Image', align: 'left', field: 'image', sortable: true },
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
                link: this.siteUrl
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
                this.$db.collection('Games').add(newGames)
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
            this.updateLink = task.link
            this.editDialog = true
        },
        setTask(){
            var gamesBago = {
                games: this.updateGames,
                link: this.updateLink
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
                this.$db.collection('Games').doc(this.gamseId).set(gamesBago)
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