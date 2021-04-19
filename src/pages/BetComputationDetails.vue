<template>
    <q-page class="bg-dark text-white">
        <q-card class="bg-secondary q-pa-md">
            <q-card-section class="text-center">
                <b><b class="text-h6">{{EndGames.gameCategory}}</b></b>
            </q-card-section>

            <q-card-section class="text-center">
                <div class="text-h3" v-show="EndGames.length !== 0">
                    
                    <span class="text-blue text-weight-bold" v-if="EndGames.teamBlue">
                        {{EndGames.winningTeam == 'BLUE' ? '' : EndGames.teamBlue.team}}
                        <q-chip class="text-h3 text-white bg-blue-10 text-weight-bold" :label="EndGames.teamBlue.team" v-show="EndGames.winningTeam == 'BLUE'">
                            <q-badge floating label="WINNER" class="text-h6 q-pa-sm" rounded />
                        </q-chip>
                    </span> 
                    VS 
                    
                    <span class="text-red text-weight-bold" v-if="EndGames.teamRed">
                        {{EndGames.winningTeam == 'RED' ? '' : EndGames.teamRed.team}}
                        <q-chip class="text-h3 text-white bg-red-10 text-weight-bold" :label="EndGames.teamRed.team" v-show="EndGames.winningTeam == 'RED'">
                            <q-badge floating label="WINNER" class="text-h6 q-pa-sm" rounded />
                        </q-chip>
                    </span>
                </div> 
            

            </q-card-section>
            <div class="row q-pa-none">

                <div class="col " :class="EndGames.winningTeam == 'BLUE' ? 'bg-primary text-black text-weight-bold' : 'bg-grey-8 text-center'">
                    <div class="text-subtitle1 text-center">₱ {{EndGames.endingOddBets.teamBlue.totalBets}} / {{EndGames.endingOddBets.teamBlue.odds}}</div>              
                </div>

                <div class="col " :class="EndGames.winningTeam == 'RED' ? 'bg-primary text-black text-weight-bold' : 'bg-grey-8 text-center'">
                <div class="text-subtitle1 text-center">₱ {{EndGames.endingOddBets.teamRed.totalBets}} / {{EndGames.endingOddBets.teamRed.odds}}</div>
                </div>

            </div> 

 
            <q-card-section class="text-center">
                <div class="text-caption">Date Ended: {{EndGames.dateEnded ? $moment(EndGames.dateEnded.toDate()).format('LLLL') : ''}}</div>
                <q-chip :color="returnColorStatus(EndGames.status)"  text-color="white" :label="EndGames.status" />
            </q-card-section>
            <q-separator dark v-show="EndGames.status !== 'PROCESSED'"/>
            <q-card-actions align="center" v-show="EndGames.status !== 'PROCESSED'">
                <q-btn flat color="info" label="Proceed to wallet crediting" icon="account_balance_wallet" @click="proceedToWalletCrediting">
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
            <q-tab name="Player Winnings"  label="Player Winnings" />
            <q-tab name="Agents Commisions"  label="Agents Commisions" />
            <q-tab name="MasterAgents Commisions"  label="Master Agents Commisions" />
            <q-tab name="Company Sales"  label="Company Sales" />
        </q-tabs>
        <q-table
            dark
            flat
            :data="returnDataTable"
            :columns="returnColumns"
            :pagination="initialPagination"
            row-key=".key"
            v-show="tab !== 'Company Sales'"
        />
        <div v-show="tab == 'Company Sales'">
            <div class="row q-pa-xl text-h6">
                <div class="col text-center">
                    TOTAL GAME BETS: <br>
                    <span class="text-h2 text-weight-bold">₱ {{EndGames.totalMoneyBox}}</span>
                </div>
                <div class="col text-center">
                    TOTAL COMPANY SALES (5.5%): <br>
                    <span class="text-h2 text-weight-bold">₱ {{EndGames.companyCommission}}</span>                    
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
            tab: 'Player Winnings',
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
        EndGames: this.$db.collection('EndGames').doc(this.$route.params.schedule),
        TeamGameAccountBets: this.$db.collection('TeamGameAccountBets').where('gameKey',"==",this.$route.params.schedule),
        Players: this.$db.collection('Players'),
        Agents: this.$db.collection('Agents'),
        MasterAgents: this.$db.collection('MasterAgents'),
      }
    },
    computed: {
        returnDataTable(){
            if(this.tab == 'Player Winnings'){
                return this.returnWinningAccounts
            } else if(this.tab == 'Agents Commisions'){
                return this.returnAgentCommission.filter(a=>{
                    return a.Agent !== null
                })
            } else if (this.tab == 'MasterAgents Commisions'){
                return this.returnAgentCommission.filter(a=>{
                    return a.MasterAgent !== null
                })
            }

            return this.returnAgentCommission
        },
        returnColumns(){
            if(this.tab == 'Player Winnings'){
                return [
                    { name: 'Player', align: 'center', label: 'Player', field: 'PlayerName', sortable: true },
                    { name: 'Phone', align: 'center', label: 'Phone', field: 'AccountPhone', sortable: true },
                    { name: 'totalBets', align: 'center', label: 'Total Bet On Winning Team', field: 'totalBets', sortable: true },
                    { name: 'Odds', align: 'center', label: 'Odds', field: 'Odds', sortable: true },
                    { name: 'totalWinnings', align: 'center', label: 'Total Winnings', field: 'totalWinnings', sortable: true },
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
        returnWinningAccounts(){
            let winTeam = this.EndGames.winningTeam
            let winOdds = winTeam == 'RED' ? this.EndGames.endingOddBets.teamRed.odds : this.EndGames.endingOddBets.teamBlue.odds
            let filterWins = this.TeamGameAccountBets.filter(a=>{
                return a.teamColor == winTeam
            })
        

            let map = filterWins.map(a=>{
                let player = a.accountID !== null ?  this.getAccountDetails(a.accountID,'Player') : null
                let agent = a.agentKey !== null ?  this.getAccountDetails(a.agentKey,'Agent') : null
                let master = a.masterAgentKey !==null ?  this.getAccountDetails(a.masterAgentKey,'Master') : null


                return {
                    ...a,
                    totalWinnings: a.totalBets * winOdds,
                    Player: player,
                    PlayerName: player.accountName,
                    AccountPhone: player.accountPhone,
                    Odds: winOdds,
                    Agent: agent,
                    MasterAgent: master,
                }
            })

            console.log(map,'map')
            return map
        },
        returnAgentCommission(){
            let filter = this.TeamGameAccountBets

            let map = filter.map(a=>{
                let player = a.accountID !== null ?  this.getAccountDetails(a.accountID,'Player') : null
                let agent = a.agentKey !== null ?  this.getAccountDetails(a.agentKey,'Agent') : null
                let master = a.masterAgentKey !==null ?  this.getAccountDetails(a.masterAgentKey,'Master') : null
                let agentPercent = agent && agent.percentSetByMA ? agent.percentSetByMA : 1
                let masterPercent = agent && agent.percentSetByMA ? 2 - agent.percentSetByMA : 1
                return {
                    ...a,
                    Player: player,
                    PlayerNamePhone: player.accountName +' / '+ player.accountPhone,
                    Agent: agent,
                    AgentNamePhone: agent ? agent.accountName +' / '+agent.accountPhone : null,
                    AgentKey: a.agentKey,
                    AgentPercent: agentPercent,
                    AgentCommission: this.getAgentAndMAPercentCommission(agentPercent,a.totalBets),
                    MasterAgent: master,
                    MasterKey: a.masterAgentKey,
                    MasterNamePhone: master ? master.accountFirstName + ' ' + master.accountLastName + ' / ' + master.accountPhone : null,
                    MasterPercent: masterPercent,
                    MasterCommission:  this.getAgentAndMAPercentCommission(masterPercent,a.totalBets),
                }
            })

            console.log(map,'map')
            return map
        },
        returnTotalBets(){
            return this.EndGames.endingOddBets.teamBlue.totalBets + this.EndGames.endingOddBets.teamRed.totalBets
        },
    },
    methods:{
        getAgentAndMAPercentCommission(percent,totalbets,){
            return parseFloat(totalbets) * parseFloat((percent/100))
        },
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
            } else if (type == 'Agent'){
                docRef = this.Agents.filter(a=>{
                    return a['.key'] == key
                })[0]  
            } else if (type == 'Master'){
                docRef = this.MasterAgents.filter(a=>{
                    return a['.key'] == key
                })[0]  
            }
            data = {...docRef}
            delete data['.key']
            return data
        },
        proceedToWalletCrediting(){
            this.$q.dialog({
                title: `PROCEED TO WALLET CREDITING?`,
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
                await this.saveWinnings()

                await this.saveAgentCommission()
    
                await this.saveMasterAgentCommission()
        
                await this.updateStatusEndGameProcessed()
   
            })
        },
        saveWinnings(){
            let winnings = this.returnWinningAccounts
            winnings.forEach(a=>{
                let winningOBJ = {
                    scheduleKey: this.EndGames['.key'],
                    gameKey: this.EndGames.gameKey,
                    amount: a.totalWinnings,
                    from: this.$store.getters['useraccount/isAuthenticated'],
                    to: {...a.Player,accountID: a.accountID},
                    timestamp: new Date(),
                    accountID: a.accountID
                }        

                let credit = a.totalWinnings
                let id = a.accountID
                this.saveWinningsHistory(winningOBJ)
                this.addCredits(credit,id)

            })
        },
        saveAgentCommission(){
            let commission = this.returnAgentCommission.filter(a=>{
                    return a.Agent !== null
                })
            
            commission.forEach(a=>{
                let commissionOBJ = {
                    scheduleKey: this.EndGames['.key'],
                    gameKey: this.EndGames.gameKey,
                    amount: a.AgentCommission,
                    from: this.$store.getters['useraccount/isAuthenticated'],
                    to: {...a.Agent,accountID: a.agentKey},
                    timestamp: new Date(),
                    accountID: a.agentKey
                }
                
                console.log(commissionOBJ,'saveAgentCommission')
                let balance = a.AgentCommission                
                let id = a.agentKey
                this.saveCommissionHistory(commissionOBJ)
                this.addCommission(balance,id)

                
            })
        },
        saveMasterAgentCommission(){
            let commission = this.returnAgentCommission.filter(a=>{
                    return a.MasterAgent !== null
                })
            
            commission.forEach(a=>{
                let commissionOBJ = {
                    scheduleKey: this.EndGames['.key'],
                    gameKey: this.EndGames.gameKey,
                    amount: a.MasterCommission,
                    from: this.$store.getters['useraccount/isAuthenticated'],
                    to: {...a.MasterAgent,accountID: a.masterAgentKey},
                    timestamp: new Date(),
                    accountID: a.masterAgentKey
                }
                console.log(commissionOBJ,'saveMasterAgentCommission')

                let balance = a.MasterCommission
                let id = a.masterAgentKey
                this.saveCommissionHistory(commissionOBJ)
                this.addCommission(balance,id)   
            })
        },
        async saveWinningsHistory(OBJ){
            try {
                const response = await this.$db.collection('WinningsHistory').add(OBJ)
                if(response) { console.log('%c SUCCESS_WINNING_HISTORY','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_WINNING_HISTORY','background: #D50000; color: #fff')
            }              
        },
        async saveCommissionHistory(OBJ){
            try {
                const response = await this.$db.collection('CommissionHistory').add(OBJ)
                if(response) { console.log('%c SUCCESS_COMMISSION_HISTORY','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_COMMISSION_HISTORY','background: #D50000; color: #fff')
            }              
        },
        async addCredits(credits,downlineID){
            try {
                const increment = firebase.firestore.FieldValue.increment(credits);
                const response = await firebaseDb.collection('Wallet').doc(downlineID).update({ creditsAmount: increment });
                if(response) { console.log('%c SUCCESS_CREDITS_ADD','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_CREDITS_ADD','background: #D50000; color: #fff')
            }   
        },
        async addCommission(commission,downlineID){
            try {
                const increment = firebase.firestore.FieldValue.increment(commission);
                const response = await firebaseDb.collection('Wallet').doc(downlineID).update({ commisionBalance: increment });
                if(response) { console.log('%c SUCCESS_COMMISSION_ADD','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_COMMISSION_ADD','background: #D50000; color: #fff')
            }   
        },
        async updateStatusEndGameProcessed(){
            try {
                const response = await firebaseDb.collection('EndGames').doc(this.$route.params.schedule).update({ status: 'PROCESSED' });
                if(response) { console.log('%c SUCCESS_UPDATE_ENDGAME_PROCESSED','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_UPDATE_ENDGAME_PROCESSED','background: #D50000; color: #fff')
            }               
        }
    }
}
</script>