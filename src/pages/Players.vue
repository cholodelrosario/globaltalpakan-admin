a<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <div class="q-pa-md row q-gutter-md">
                <q-input class="col" readonly dark outlined v-model="credits" type="number" label="Overall Credits Balance of Players" />
                <q-select @input="myPlayerNew()" class="col column" clearable emit-value map-options dark v-model="type" :options="MAOption" label="Select Agent" outlined/>
            </div>
        </div>
        <b v-show="false">{{totalBalanceCredit}}</b>
        <div class="row q-pa-md q-gutter-sm">
            <q-input style="width: 430px" borderless dense outlined placeholder="Enter '000'/Three Zero's to search ALL Master Agents" color="primary" debounce="300" v-model="filter" dark>
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
            <q-btn label="Search by UserName" class="text-black" borderless @click="searchAll()" dense outlined color="primary"/>
        </div>
        <div class="q-pa-md">
            <q-table title="Players" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="myAgentsPlayers" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                        <q-td key="creditsAmount" :props="props">{{props.row.creditsAmount}}</q-td>
                        <q-td key="lastTransaction" :props="props">{{props.row.lastTransaction}}</q-td>
                        <q-td key="action" :props="props">
                            <q-btn flat color="primary" @click="editAgent(props.row)" label="Move Player" />
                            <q-btn flat color="primary" @click="viewBetHistory(props.row)" label="View Bet History" />
                        </q-td>
                    </q-tr>
                </template>  
            </q-table>
        </div>
        <q-dialog v-model="selectNewAgent" persistent>
            <q-card style="min-width: 350px" class="bg-dark text-white">
                <q-card-section>
                <div class="text-h6">Move This Player</div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                Player Name: 
                <q-input outlined dark readonly v-model="playerName" />
                <br>
                Current Agent: 
                <q-input outlined dark readonly v-model="currentAgent" />
                <br>
                Move to Agent:
                <q-select class="col column" clearable emit-value map-options dark v-model="newType" :options="MAOption" label="Select Agent" outlined/>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <q-btn flat label="Cancel" v-close-popup />
                <q-btn flat label="Move Player" @click="movePlayers()" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="myPlayersBetHistory" persistent>
            <q-card style="width: 550px" class="bg-dark text-white">
                <q-card-section>
                <h5 class="text-primary text-weight-bolder q-mt-none">BET HISTORY</h5>
                    <q-tabs
                        v-model="tab"
                        inline-label
                        class="bg-secondary text-white shadow-2 col-12"
                    >
                        <q-tab class="col-6" name="bet" label="Game Bet History" />
                        <q-tab class="col-6" name="option" label="Bet Option History" />
                        
                    </q-tabs>
                </q-card-section>

                <q-card-section class="q-pt-none">
                    <h6 class="text-secondary flex flex-center text-white q-ma-none">{{this.tab == 'bet' ? 'BET HISTORY' : 'BET OPTIONS HISTORY'}}</h6>
                    <q-list v-for="(p, index) in this.getData" :key="index" bordered separator>
                        <!-- <br> -->
                        <q-item>
                            <q-item-section caption top>
                                <q-item-label overline class="text-white">P&nbsp;{{p.totalBets}} &nbsp;&nbsp;&nbsp;<b :class="p.betStatus === 'LOSE' || p.betStatus === 'CANCELLED' ? 'text-red' : 'text-primary'">{{p.betStatus}}</b></q-item-label>
                                <q-item-label overline class="text-white">{{p.team.team}}</q-item-label>
                                <q-item-label v-if="tab == 'option'" caption class="text-white">{{p.betOptions.name}}</q-item-label>
                                <q-item-label caption class="text-white"></q-item-label>
                                <q-item-label overline class="text-white">Total Winnings: &nbsp;{{p.betStatus == 'LOSE' || p.betStatus == 'CANCELLED' ? 'NONE' : parseFloat(p.totalBets) * parseFloat(p.endingOdds)}}</q-item-label>
                                <!-- <q-item-label v-else overline class="text-white">Total Winnings: &nbsp;{{p.betStatus == 'LOSE' || p.betStatus == 'CANCELLED' ? 'NONE' : parseFloat(p.totalBets) * parseFloat(p.endingOdds)}}</q-item-label> -->
                            </q-item-section>

                            <q-item-section top>
                            <q-item-label overline class="text-white">{{p.timestamp.toDate('MM-DD-YYYY')}}</q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                    <div class="q-pa-lg flex flex-center">
                        <q-pagination
                            v-model="page"
                            :min="currentPage"
                            :max="Math.ceil(this.bethistory.length/totalPages)"
                            direction-links
                            unelevated
                            color="black"
                            active-color="yellow"
                            active-text-color="black"
                        />
                    </div>
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                <!-- <q-btn flat label="Cancel" v-close-popup /> -->
                <q-btn flat label="Ok" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    data(){
        return{
            page: 1,
            currentPage:1,
            nextPage: null,
            totalPages:10,
            TeamGameAccountOptionsBets: [],
            BettorsPlayerID: '',
            tab: 'bet',
            myPlayersBetHistory: false,
            TeamGameAccountBets: [],
            myAgentsPlayers: [],
            Movements: [],
            playerName: '',
            newType: '',
            currentAgent: '',
            selectNewAgent: false,
            credits: 0,
            pagination: {
                rowsPerPage: 0
            },
            Wallet: [],
            Agents: [],
            Players: [],
            type: '',
            filter: '',
            columns: [
                { name: 'accountName', align: 'left', required: true, label: 'Agent Name', field: 'accountName', sortable: true },
                { name: 'accountPhone', align: 'center', required: true, label: 'User Name', field: 'accountPhone', sortable: true },
                { name: 'creditsAmount', align: 'center', label: 'Credit Balance', field: 'creditsAmount', sortable: true },
                { name: 'lastTransaction', align: 'center', label: 'Last Transaction.', field: 'lastTransaction', sortable: true },
                { name: 'action', align: 'center', label: 'Action', sortable: true },
            ]
        }
    },
    methods: {
        async viewBetHistory(task){
            this.BettorsPlayerID = task['.key']
            this.myPlayersBetHistory = true
            await this.playersBetHistory()
            await this.playersBetOptionsHistory()
        },
        async searchAll(){
            this.type = null
            if(this.filter === ''){
                this.$q.dialog({
                title: 'Please Enter Players UserName to Search!',
                message: 'Fill Search Bar?',
                ok: 'Ok',
                cancel: 'Cancel',
                dark: true
                })
                this.myAgentsPlayers = []
            }else{
                if(this.filter === '000'){
                    await this.checkWalletBalance()
                    await this.myPlayersDetails()
                    .then(() => {
                        let map = this.$lodash.map(this.Players,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                            return {
                                ['.key']: a['.key'],
                                accountID: a['.key'],
                                accountName: a.accountName,
                                accountPhone: a.accountPhone,
                                lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY hh:ss A'),
                                creditsAmount: wallet.creditsAmount === undefined || wallet.creditsAmount === null ? 0 : wallet.creditsAmount,
                                agentKey: a.agentKey,
                                masterAgentKey: a.masterAgentKey,
                                activated: a.activated,
                                dateCreated: a.dateCreated
                            }
                        })
                            let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                            this.myAgentsPlayers = orderByP
                        }).catch(err => {
                            console.error(err)
                        })
                }else{
                    await this.checkWalletBalance()
                    await this.myPlayersDetails()
                    .then(() => {
                        // let filterSearch = this.$lodash.filter(this.Players, p => {
                        //         return p.accountPhone === this.filter
                        // })
                        // console.log(filterSearch, 'filtersearch')
                        let map = this.$lodash.map(this.Players,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                            return {
                                ['.key']: a['.key'],
                                accountID: a['.key'],
                                accountName: a.accountName,
                                accountPhone: a.accountPhone,
                                lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY hh:ss A'),
                                creditsAmount: wallet.creditsAmount === undefined || wallet.creditsAmount === null ? 0 : wallet.creditsAmount,
                                agentKey: a.agentKey,
                                masterAgentKey: a.masterAgentKey,
                                activated: a.activated,
                                dateCreated: a.dateCreated
                            }
                        })
                        let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                        this.myAgentsPlayers = orderByP
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }
        },
        async myPlayerNew(){
            this.filter = ''
            if(this.type === null){
                this.myAgentsPlayers = []
            }else{
                await this.checkWalletBalance()
                await this.myPlayersDetails()
                .then(() => {
                    // let filterSearch = this.$lodash.filter(this.Players, p => {
                    //         return p.agentKey === this.type['.key']
                    // })
                    let map = this.$lodash.map(this.Players,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                        return {
                            ['.key']: a['.key'],
                            accountID: a['.key'],
                            accountName: a.accountName,
                            accountPhone: a.accountPhone,
                            lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY hh:ss A'),
                            creditsAmount: wallet.creditsAmount === undefined || wallet.creditsAmount === null ? 0 : wallet.creditsAmount,
                            agentKey: a.agentKey,
                            masterAgentKey: a.masterAgentKey,
                            activated: a.activated,
                            dateCreated: a.dateCreated
                        }
                    })
                    let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                    this.myAgentsPlayers = orderByP
                }).catch(err => {
                    console.error(err)
                })
            }
        },
        async checkWalletBalance(){
            await this.$binding("Wallet", this.$db.collection("Wallet"))
            .then((wallet) => {
            }).catch(err => {
                console.error(err)
            })             
        },
        async myPlayersDetails(){
            if(this.filter === '000'){
                await this.$binding("Players", this.$db.collection("Players"))
                .then((Players) => {
                }).catch(err => {
                    console.error(err)
                })
            }else if(this.type !== null){
                await this.$binding("Players", this.$db.collection("Players").where("agentKey","==",this.type['.key']))
                .then((Players) => {
                }).catch(err => {
                    console.error(err)
                })
            }else{
                await this.$binding("Players", this.$db.collection("Players").where("accountPhone","==",this.filter))
                .then((Players) => {
                }).catch(err => {
                    console.error(err)
                })
            }             
        },
        async myMovements(){
            await this.$binding("Movements", this.$db.collection("Movements"))
            .then((Movements) => {
            }).catch(err => {
                console.error(err)
            })             
        },
        async playersBetHistory(){
            await this.$binding("TeamGameAccountBets", this.$db.collection("TeamGameAccountBets").where("accountID","==",this.BettorsPlayerID))
            .then((TeamGameAccountBets) => {
            }).catch(err => {
                console.error(err)
            })             
        },
        async playersBetOptionsHistory(){
            await this.$binding("TeamGameAccountOptionsBets", this.$db.collection("TeamGameAccountOptionsBets").where("accountID","==",this.BettorsPlayerID))
            .then((TeamGameAccountOptionsBets) => {
            }).catch(err => {
                console.error(err)
            })             
        },
        movePlayers(){
            let agent = this.$lodash.filter(this.Agents, p => {
            return p['.key'] === this.newType['.key']
            })[0]
            let playerID = this.IDss
            var movePlayer = {
                accountName: this.accountName,
                accountPhone: this.accountPhone,
                activated: this.activated,
                agentKey: agent === null ? '' : agent['.key'],
                dateCreated: this.dateCreated,
                masterAgentKey: agent === null ? '' : agent.masterAgentKey,
                lastTransaction: new Date() 
            }
            let move = this.$lodash.filter(this.Movements, p => {
                return p.downline === playerID
                })[0]
            let movedID = move === undefined ? '' : move['.key']
            var isMovePlayer = {
                downline: playerID,
                isFromReferralLink: true,
                timestamp: new Date() ,
                topline: agent.masterAgentKey,
                isMoved: true
            }
            if(this.newType === '' || this.newType === null || this.newType.accountName === this.currentAgent){
                this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements or Please Select Different Agent?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                })
            }else
            this.$q.dialog({
                title: 'Move this Player?',
                message: 'Are you sure you want to move this Player?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => {
                this.$db.collection('Players').doc(playerID).set(movePlayer)
                if(move === undefined){
                    this.$db.collection('Movements').add(isMovePlayer)
                }else{
                    this.$db.collection('Movements').doc(movedID).set(isMovePlayer)
                }
                this.$q.notify({
                    message: 'Player has Been Moved to New Agent!',
                    icon: 'mdi-folder-plus-outline',
                    color: 'positive',
                    textColor: 'white',
                    position: 'center'
                })
                this.newType = null
                this.type = null
                this.myAgentsPlayers = []
            })
        },
        editAgent(task){
            let agent = this.$lodash.filter(this.Agents, p => {
            return p['.key'] === task.agentKey
            })
            this.IDss = task['.key']
            this.playerName = task.accountName
            this.currentAgent = agent[0].accountName
            this.accountName = task.accountName
            this.accountPhone = task.accountPhone
            this.activated = task.activated
            this.dateCreated = task.dateCreated
            this.lastTransaction = task.lastTransaction
            this.selectNewAgent = true
        },
        getwalletDetails(key){
            var docRef = null
            var data = null
            docRef = this.Wallet.filter(a=>{
                return a['.key'] == key
            })[0]
            data = {...docRef}
            delete data['.key']
            return data

        },
    },
    computed: {
        getData(){
			return 	this.bethistory.slice((this.page-1)*this.totalPages,(this.page-1)*this.totalPages+this.totalPages)
        },
        bethistory(){
            if(this.tab === 'bet'){  
                return this.TeamGameAccountBets
            }else {
                return this.TeamGameAccountOptionsBets
            }
        },
        totalBalanceCredit(){
            if(this.type === '' || this.type === null){
                let total = this.$lodash.sumBy(this.myAgentsPlayers, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = total
            }else{
                let total = this.$lodash.filter(this.myAgentsPlayers, p => {
                    return p.agentKey === this.type['.key']
                })
                let totals = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = totals
            }       
        },
        MAOption(){
            let optionss = this.Agents.map(Ma => {
                return {
                    label: Ma.accountName,
                    value: Ma
                }
            })
            return optionss
        },
    },
    mounted() {
        this.$binding('Agents', this.$db.collection('Agents'))
        .then(Agents => {
        })
    }
}
</script>
