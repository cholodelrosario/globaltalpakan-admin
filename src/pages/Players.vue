a<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <div class="q-pa-md row q-gutter-md">
                <q-input class="col" readonly dark outlined v-model="credits" type="number" label="Overall Credits Balance of Players" />
                <q-select class="col column" clearable emit-value map-options dark v-model="type" :options="MAOption" label="Select Agent" outlined/>
            </div>
        </div>
        <b v-show="false">{{totalBalanceCredit}}</b>
        <div class="q-pa-md">
            <q-table title="Players" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="selectAgent" :filter="filter" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                        <q-td key="creditsAmount" :props="props">{{props.row.creditsAmount}}</q-td>
                        <q-td key="lastTransaction" :props="props">{{props.row.lastTransaction}}</q-td>
                        <q-td key="action" :props="props">
                            <q-btn flat color="primary" @click="editAgent(props.row)" label="Move Player" />
                        </q-td>
                    </q-tr>
                </template>
                <template v-slot:top-right>
                    <q-input borderless dense outlined color="primary" debounce="300" v-model="filter" dark placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
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
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    methods: {
        movePlayers(){
            let agent = this.$lodash.filter(this.Agents, p => {
            return p['.key'] === this.newType['.key']
            })[0]
            console.log(agent,'thisAgent')
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
            console.log(movePlayer, 'movemovemovemove')
            let move = this.$lodash.filter(this.Movements, p => {
                return p.downline === playerID
                })[0]
            console.log(move, 'MovementSpeed')
            let movedID = move === undefined ? '' : move['.key']
            console.log(movedID, 'movedID')
            var isMovePlayer = {
                downline: playerID,
                isFromReferralLink: true,
                timestamp: new Date() ,
                topline: agent.masterAgentKey,
                isMoved: true
            }
            console.log(isMovePlayer, 'isMovePlayer')
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
            })
        },
        editAgent(task){
            console.log(task, 'tasktasktask')
            let agent = this.$lodash.filter(this.Agents, p => {
            return p['.key'] === task.agentKey
            })
            this.IDss = task['.key']
            console.log(agent, 'agentsssss')
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
    data(){
        return{
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
            TotalMonthYearMTD: [],
            Agents: [],
            Players: [],
            type: '',
            MasterAgents: [],
            filter: '',
            columns: [
                { name: 'accountName', align: 'left', required: true, label: 'Agent Name', field: 'accountName', sortable: true },
                { name: 'accountPhone', align: 'center', required: true, label: 'Number', field: 'accountPhone', sortable: true },
                { name: 'creditsAmount', align: 'center', label: 'Credit Balance', field: 'creditsAmount', sortable: true },
                { name: 'lastTransaction', align: 'center', label: 'Last Transaction.', field: 'lastTransaction', sortable: true },
                { name: 'action', align: 'right', label: 'Action', sortable: true },
            ]
        }
    },
    computed: {
        totalBalanceCredit(){
            if(this.type === '' || this.type === null){
                let total = this.$lodash.sumBy(this.myPlayers, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = total
            }else{
                let total = this.$lodash.filter(this.myPlayers, p => {
                    return p.agentKey === this.type['.key']
                })
                let totals = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = totals
            }       
        },
        selectAgent(){
            console.log(this.type, 'typetypetype')
            if(this.type === null || this.type === ''){
                return this.myPlayers
            }else{
                let withType = this.$lodash.filter(this.myPlayers, p => {
                return p.agentKey === this.type['.key']
                })
                return withType
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
        myPlayers(){
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
              console.log(map, 'playersAccount')
              let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
              return orderByP
        },
    },
    mounted() {
        this.$binding('MasterAgents', this.$db.collection('MasterAgents'))
            .then(MasterAgents => {
            console.log(MasterAgents, 'MasterAgents')
        })
        this.$binding("Wallet", this.$db.collection("Wallet"))
        .then((wallet) => {
            console.log(wallet,'wallet') // => __ob__: Observer
        }).catch(err => {
            console.error(err)
        })
        this.$binding("Players", this.$db.collection("Players"))
        .then((Players) => {
            console.log(Players,'Players') // => __ob__: Observer
        }).catch(err => {
            console.error(err)
        })
        this.$binding('TotalMonthYearMTD', this.$db.collection('TotalMonthYearMTD'))
        .then(TotalMonthYearMTD => {
          console.log(TotalMonthYearMTD, 'TotalMonthYearMTD')
        })
        this.$binding('Agents', this.$db.collection('Agents'))
        .then(Agents => {
          console.log(Agents, 'Agents')
        })
        this.$binding('Movements', this.$db.collection('Movements'))
        .then(Movements => {
          console.log(Movements, 'Movements')
        })
    }
}
</script>
