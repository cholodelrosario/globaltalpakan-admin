<template>
    <q-page class="bg-dark text-white">
        <q-card class="bg-secondary q-pa-md">
            <q-card-section class="text-center">
                <b><b class="text-h6">{{CancelledGames.name}}</b></b>
            </q-card-section>

            <q-card-section class="text-center">
                <div class="text-h3" v-show="CancelledGames.length !== 0">
                    
                    <span class="text-blue text-weight-bold" v-if="CancelledGames.teamBlue">
                        {{CancelledGames.winningTeam == 'BLUE' ? '' : CancelledGames.teamBlue.team}}
                        <q-chip class="text-h3 text-white bg-blue-10 text-weight-bold" :label="CancelledGames.teamBlue.team" v-show="CancelledGames.winningTeam == 'BLUE'">
                            <q-badge floating label="WINNER" class="text-h6 q-pa-sm" rounded />
                        </q-chip>
                    </span> 
                    VS 
                    
                    <span class="text-red text-weight-bold" v-if="CancelledGames.teamRed">
                        {{CancelledGames.winningTeam == 'RED' ? '' : CancelledGames.teamRed.team}}
                        <q-chip class="text-h3 text-white bg-red-10 text-weight-bold" :label="CancelledGames.teamRed.team" v-show="CancelledGames.winningTeam == 'RED'">
                            <q-badge floating label="WINNER" class="text-h6 q-pa-sm" rounded />
                        </q-chip>
                    </span>
                </div> 
            

            </q-card-section>
            <div class="row q-pa-none">

                <div class="col " :class="CancelledGames.winningTeam == 'BLUE' ? 'bg-primary text-black text-weight-bold' : 'bg-grey-8 text-center'">
                    <div class="text-subtitle1 text-center">₱ {{CancelledGames.endingOddBets.teamBlue.totalBets}} / {{CancelledGames.endingOddBets.teamBlue.odds.toFixed(2)}}</div>              
                </div>

                <div class="col " :class="CancelledGames.winningTeam == 'RED' ? 'bg-primary text-black text-weight-bold' : 'bg-grey-8 text-center'">
                <div class="text-subtitle1 text-center">₱ {{CancelledGames.endingOddBets.teamRed.totalBets}} / {{CancelledGames.endingOddBets.teamRed.odds.toFixed(2)}}</div>
                </div>

            </div> 

 
            <q-card-section class="text-center">
                <div class="text-caption">Date Cancelled: {{CancelledGames.dateEnded ? $moment(CancelledGames.dateEnded.toDate()).format('LLLL') : ''}}</div>
                <q-chip :color="returnColorStatus(CancelledGames.status)"  text-color="white" :label="CancelledGames.status" />
            </q-card-section>
            <q-separator dark v-show="CancelledGames.status !== 'PROCESSED'"/>
            <q-card-actions align="center" v-show="CancelledGames.status !== 'PROCESSED'">
                <q-btn flat color="warning" label="Proceed to Credit Refunding" icon="redo" @click="proceedToCreditRefunding">
                    <q-badge color="white" floating transparent text-color="black"><q-icon size="xs" name="next_plan"/>
                    </q-badge>
                </q-btn>
            </q-card-actions>
        </q-card>

        <q-tabs
            v-model="tab"
            class="text-white"
            align="justify"
            active-color="primary"
            active-bg-color="grey-9"
        >
            <q-tab name="Player Credit Refunds"  label="Player Credit Refunds" />
            <q-tab name="Cancelled Company Sales"  label="Cancelled Company Sales" />
        </q-tabs>
        <q-table
            dark
            flat
            :data="returnDataTable"
            :columns="returnColumns"
            :pagination="initialPagination"
            row-key=".key"
            v-show="tab !== 'Cancelled Company Sales'"
        />
        <div v-show="tab == 'Cancelled Company Sales'">
            <div class="row q-pa-xl text-h6">
                <div class="col text-center">
                    CANCELLED TOTAL GAME BETS: <br>
                    <span class="text-h2 text-red-10 text-weight-bold">₱ {{CancelledGames.totalMoneyBox}}</span>
                </div>
                <div class="col text-center">
                    CANCELLED TOTAL COMPANY SALES (5.5%): <br>
                    <span class="text-h2 text-red-10 text-weight-bold">₱ {{CancelledGames.companyCommission}}</span>                    
                </div>
            </div>
        </div>
    </q-page>
</template>
<script>
import { firebase,firebaseAuth,firebaseApp,firebaseDb,firefirestore } from 'boot/firebase'
export default {
    data(){
        return { 
            confirm: false,
            tab: 'Player Credit Refunds',
            selectedOptionsKey: null,
            selectedStatus: '',
            TrendsHistory: [],
            initialPagination: {
                sortBy: 'totalBets',
                descending: false,
                page: 1,
                rowsPerPage: 10
                // rowsNumber: xx if getting data from a server
            },
        }
    },
    firestore(){
      return {
        CancelledGames: this.$db.collection('BetOptionsCancelledGames').doc(this.$route.params.options),
        TeamGameAccountBets: this.$db.collection('TeamGameAccountOptionsBets').where('guideKey',"==",this.$route.params.options),
        Players: this.$db.collection('Players'),
        Agents: this.$db.collection('Agents'),
        MasterAgents: this.$db.collection('MasterAgents'),
      }
    },
    computed: {
        returnDataTable(){
            if(this.tab == 'Player Credit Refunds'){
                return this.returnCancelledAmount
            } 

            return this.returnAgentCommission
        },
        returnColumns(){
            if(this.tab == 'Player Credit Refunds'){
                return [
                    { name: 'Player', align: 'center', label: 'Player', field: 'PlayerName', sortable: true },
                    { name: 'Phone', align: 'center', label: 'Phone', field: 'AccountPhone', sortable: true },
                    { name: 'Team', align: 'center', label: 'Team', field: 'teamColor', sortable: true },
                    { name: 'totalRefunds', align: 'center', label: 'Total Refunds', field: 'totalRefunds', sortable: true },
                ]
            } else if (this.tab == 'Agents Commisions' || this.tab == 'MasterAgents Commisions'){
                return [
                    { name: 'Agent', align: 'center', label: this.tab == 'Agents Commisions' ? 'Agent / Phone' : 'MasterAgent / Phone', field: this.tab == 'Agents Commisions' ? 'AgentNamePhone' : 'MasterNamePhone', sortable: true },
                    { name: 'Player', align: 'center', label: 'Player / Phone', field: 'PlayerNamePhone', sortable: true },
                    { name: 'Bets', align: 'center', label: 'Total Bet', field: 'totalBets', sortable: true },
                    { name: 'Percentage', align: 'center', label: 'Commission %', field: this.tab == 'Agents Commisions' ? 'AgentPercent' : 'MasterPercent', sortable: true },
                    { name: 'TotalCommission', align: 'center', label: 'Total Commission', field: this.tab == 'Agents Commisions' ? 'AgentCommission' : 'MasterCommission', sortable: true },                  
                ]
            }

            return []
        },
        returnCancelledAmount(){
            let filterWins = this.TeamGameAccountBets
        

            let map = filterWins.map(a=>{
                let player = a.accountID !== null ?  this.getAccountDetails(a.accountID,'Player') : null


                return {
                    ...a,
                    totalRefunds: a.totalBets,
                    Player: player,
                    PlayerName: player.accountName,
                    AccountPhone: player.accountPhone,
                }
            })

            console.log(map,'map')



            return map
        },
        returnTotalBets(){
            return this.CancelledGames.endingOddBets.teamBlue.totalBets + this.CancelledGames.endingOddBets.teamRed.totalBets
        },
    },
    methods:{
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
        },  
        getAccountDetails(key,type){

            var docRef = null
            var data = null
            if(type == 'Player'){
                docRef = this.Players.filter(a=>{
                    return a['.key'] == key
                })[0]    
            } 
            data = {...docRef}
            delete data['.key']
            return data
        },
        proceedToCreditRefunding(){
            this.$q.dialog({
                title: `PROCEED TO Credit Refunding?`,
                message: 'Do you confirm this action ? This action cannot be undone if you click proceed.',
                type: 'accent',
                color: 'accent',
                textColor: 'white',
                persistent: true,
                icon: 'warning',
                ok: 'YES, I CONFIRM',
                cancel: {
                    color: 'grey',
                    flat: true,
                }
            }).onOk(async ()=> {
                await this.saveRefunds()      
                await this.updateStatusEndGameProcessed()
   
            })
        },
        saveRefunds(){
            let winnings = this.returnCancelledAmount
            winnings.forEach(a=>{
                let winningOBJ = {
                    guideKey: this.CancelledGames['.key'],
                    scheduleKey: this.CancelledGames.scheduleKey,
                    amount: a.totalRefunds,
                    from: this.$store.getters['useraccount/isAuthenticated'],
                    to: {...a.Player,accountID: a.accountID},
                    timestamp: new Date(),
                    accountID: a.accountID
                }        

                let credit = a.totalRefunds
                let id = a.accountID
                this.saveRefundsHistory(winningOBJ)
                this.refundCredits(credit,id)

            })
        },
        async saveRefundsHistory(OBJ){
            try {
                const response = await this.$db.collection('OptionsRefundsHistory').add(OBJ)
                if(response) { console.log('%c SUCCESS_OPTIONS_REFUNDS_HISTORY','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_OPTIONS_REFUNDS_HISTORY','background: #D50000; color: #fff')
            }              
        },

        async refundCredits(credits,downlineID){
            try {
                const increment = firebase.firestore.FieldValue.increment(credits);
                const response = await firebaseDb.collection('Wallet').doc(downlineID).update({ creditsAmount: increment });
                if(response) { console.log('%c SUCCESS_OPTIONS_CREDITS_REFUNDED','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_OPTIONS_CREDITS_REFUNDED','background: #D50000; color: #fff')
            }   
        },

        async updateStatusEndGameProcessed(){
            try {
                const response = await firebaseDb.collection('BetOptionsCancelledGames').doc(this.$route.params.options).update({ status: 'PROCESSED' });
                if(response) { console.log('%c SUCCESS_UPDATE_OPTIONS_CANCELLED_PROCESSED','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_UPDATE_OPTIONS_CANCELLED_PROCESSED','background: #D50000; color: #fff')
            }               
        }
    }
}
</script>