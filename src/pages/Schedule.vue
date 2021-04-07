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
        <q-dialog v-model="schedDialog" persistent>
            <q-card class="my-card"> 
                <q-card-section>
                    <div class="text-h6">New Games</div>
                </q-card-section>

                <q-card-section>
                    <template>
                        <q-video :ratio="14/7" src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0"/>
                    </template>
                    <div class="q-pt-sm row items-start q-gutter-md">
                        <div class="col column bg-red text-white">
                            <div class="text-h6 text-center">
                                <q-select class="col column justify-between" v-model="selectTeamOne" :options="teamOption" label="Select Team" />
                            </div>
                        </div>

                        <q-separator vertical inset />

                        <div class="col column bg-blue text-white">
                            <div class="text-h6">
                                <q-select class="col column justify-between" v-model="selectTeamTwo" :options="teamOption" label="Select Team" />
                            </div>
                        </div>
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" v-close-popup />
                    <q-btn flat label="Add Betting Option" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
  </q-page>
</template>

<script>
export default {
    computed:{
        teamOption(){
            let optionss = this.Team.map(Team => {
                return {
                    label: Team.team,
                    value: Team.team
                }
            })
            console.log(optionss, 'opt')
            return optionss
        },
    },
    data(){
        return {
            Games: [],
            Team: [],
            selectTeamTwo: null,
            selectTeamOne: null,
            schedDialog: false,
        }
    },
    mounted () {
       this.$binding('Games', this.$db.collection('Games'))
        .then(Games => {
          console.log(Games, 'Games')
        })
       this.$binding('Team', this.$db.collection('Team'))
        .then(Team => {
          console.log(Team, 'Team')
        })
    },
}
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 700px
</style>
