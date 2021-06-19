<template>
  <q-page class="bg-dark">
        <div full-width>
            <q-tabs v-model="tab" inline-label flat class="bg-secondary text-white shadow-2 col-12" >
                <q-tab class="col-4" name="magents" label="Master Agents" icon="mdi-account-multiple" />
                <q-tab class="col-4" name="agents" label="Agents" icon="mdi-face-agent" />
            </q-tabs>
        </div>
        <div class="q-pa-md">
            <q-table class="bg-secondary text-white" :pagination.sync="pagination" :title="this.tab == 'magents' ?  'Master Agents Convertion Request' : 'Agents Convertion Request' " :data="this.returnConvertion" :columns="column" :filter="filter" row-key="name">
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="accountFirstName" :props="props">{{ tab=='magents' ? props.row.from.accountFirstName + ' ' + props.row.from.accountLastName : props.row.from.accountName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.from.accountPhone}}</q-td>
                        <q-td key="amount" :props="props">{{props.row.amount}}</q-td>
                        <q-td key="status" :props="props"><q-chip square :color="props.row.status == true ? 'green-8' : 'red-8'" >{{props.row.status == true ? 'Completed' : 'Pending'}}</q-chip></q-td>
                        <q-td v-if="props.row.status == false" key="action" :props="props">
                            <q-btn flat label="Approve" @click="approveWithdrawal(props.row)" color="yellow" />
                        </q-td>
                        <q-td v-else key="action" :props="props">
                            <q-btn disable flat label="- - - - - - - - " color="yellow" />
                        </q-td>  
                    </q-tr>
                </template>
                <template v-slot:top-right>
                    <q-input borderless outlined dense debounce="300" v-model="filter" dark placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>  
            </q-table>
        </div>
  </q-page>
</template>

<script>
import { firebase,firebaseAuth,firebaseDb } from 'src/boot/firebase'
import { date } from 'quasar'
export default {
    data(){
        return {
            agentConvertion: [],
            MAConvertion: [],
            pagination: {
                page: 1, 
                rowsPerPage: 15, 
                sortBy: 'timestamp',
                descending: true,
                rowsNumber: 100 
            },
            filter: '',
            accountObj: null,
            tab: 'magents',
            Wallet: [],
            column: [
                { name: 'accountFirstName', required: true, label: 'Full Name', align: 'left', field: 'accountFirstName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'left', field: 'accountPhone', sortable: true },
                { name: 'amount', required: true, label: 'Amount', align: 'left', field: 'amount', sortable: true },
                { name: 'status', required: true, label: 'Status', align: 'left', field: 'status', sortable: true },
                { name: 'action', align: 'right', label: 'Action' }
            ],
        }
    },
    mounted() {
        this.$binding('agentConvertion', this.$db.collection('AgentConvertion'))
            .then(agentConvertion => {
            console.log(agentConvertion, 'agentConvertion')
        })
        this.$binding('MAConvertion', this.$db.collection('MasterAgentConvertion'))
            .then(MAConvertion => {
            console.log(MAConvertion, 'MAConvertion')
        })
    },
    computed: {
        returnConvertion () {
            if(this.tab == 'magents'){
                let orderByMA = this.$lodash.orderBy(this.MAConvertion, ['timestamp'], ['desc']);
                return orderByMA
            }else {
                let orderByAgent = this.$lodash.orderBy(this.agentConvertion, ['timestamp'], ['desc']);
                return orderByAgent
            }
        }
    },
    methods:{
        async currentUsers(){
            let user = this.$store.getters['useraccount/isAuthenticated']
            await this.$binding("accountObj", this.$db.collection("Accounts").doc(user.userDBKey))
            .then((account) => {
                // console.log(account,'account') // => __ob__: Observer
            }).catch(err => {
                console.error(err)
            })             
        },
        async walletDetails(){
            await this.$binding("Wallet", this.$db.collection("Wallet"))
            .then((Wallet) => {
                // console.log(Wallet,'wallet') // => __ob__: Observer
            }).catch(err => {
                console.error(err)
            })             
        },
        async approveWithdrawal(agent){
            console.log(agent, 'agent')
            this.$q.dialog({
                dark: true,
                title: this.tab == 'magents' ? `Approve ${agent.from.accountFirstName + '' + agent.from.accountLastName} Convetion?` : `Approve ${agent.from.accountName} Convetion?`,
                message: `Approve P${agent.amount} Withdrawals`,
                cancel: {
                    color: 'grey',
                    flat: true,
                },
                persistent: true
            }).onOk( async () =>{
                 await this.currentUsers()
                 await this.walletDetails()
                 if(this.tab == 'magents'){
                    let converterID = agent.masterAgentKey
                    let credits = this.$lodash.filter(this.Wallet, m => {
                            return m['.key'] == converterID
                    })
                    console.log(credits, 'credits')
                    let creditsComms = {
                        commisionBalance: credits[0].commisionBalance,
                        creditsAmount: parseInt(agent.amount) + parseInt(credits[0].creditsAmount)
                    }
                    this.$db.collection('Wallet').doc(converterID).set(creditsComms)
                    console.log(creditsComms, 'creditsComms')
                    let user = this.$store.getters['useraccount/isAuthenticated']
                    console.log(user,'user')
                    let userID = user.userDBKey   
                    agent.status = true
                    let key = agent['.key']
                    let update = {...agent}
                    delete update['.key']
                    this.$db.collection(`MasterAgentConvertion`).doc(key).set(update)
                    var approveConvertionHistory = {
                        convertionID: agent['.key'],
                        convertedBy: agent.from,
                        convertedAmount: agent.amount,
                        approveByID: userID,
                        approveBy: this.accountObj,
                        timestamp: new Date(),
                    }
                    console.log(approveConvertionHistory, 'approveHistory')
                    this.$db.collection('AdminConvertionApprovalHistory').add(approveConvertionHistory)
                    try {
                    const response = firebaseDb.collection('MasterAgents').doc(converterID).update({ lastTransaction: new Date() })
                    if(response) { console.log('%c SUCCESS_LAST_TRANSACTION','background: #222; color: #bada55') }
                    } catch (error) {
                        console.log(error,'error')
                        console.log('%c ERROR_LAST_TRANSACTION','background: #D50000; color: #fff')
                    }
                }else{ 
                    let converterID = agent.agentKey
                    let credits = this.$lodash.filter(this.Wallet, m => {
                            return m['.key'] == converterID
                    })
                    console.log(credits, 'credits')
                    let creditsComms = {
                        commisionBalance: credits[0].commisionBalance,
                        creditsAmount: parseInt(agent.amount) + parseInt(credits[0].creditsAmount)
                    }
                    this.$db.collection('Wallet').doc(converterID).set(creditsComms)
                    console.log(creditsComms, 'creditsComms')
                    let user = this.$store.getters['useraccount/isAuthenticated']
                    console.log(user,'user')
                    let userID = user.userDBKey   
                    agent.status = true
                    let key = agent['.key']
                    let update = {...agent}
                    delete update['.key']
                    this.$db.collection(`AgentConvertion`).doc(key).set(update)
                    var approveConvertionHistory = {
                        convertionID: agent['.key'],
                        convertedBy: agent.from,
                        convertedAmount: agent.amount,
                        approveByID: userID,
                        approveBy: this.accountObj,
                        timestamp: new Date(),
                    }
                    console.log(approveConvertionHistory, 'approveHistory')
                    this.$db.collection('AdminConvertionApprovalHistory').add(approveConvertionHistory)
                    try {
                    const response = firebaseDb.collection('Agents').doc(converterID).update({ lastTransaction: new Date() })
                    if(response) { console.log('%c SUCCESS_LAST_TRANSACTION','background: #222; color: #bada55') }
                    } catch (error) {
                        console.log(error,'error')
                        console.log('%c ERROR_LAST_TRANSACTION','background: #D50000; color: #fff')
                    }
                }
                this.$q.notify({
                    message: this.tab == 'magents' ? `${agent.from.accountFirstName + '' + agent.from.accountLastName} Convertion has been Approved` : `${agent.from.accountName} Convertion has been Approved`,
                    icon: 'mdi-update',
                    color: 'positive',
                    textColor: 'white',
                    position: 'center'
                })
            })            
        },
    }
}
</script>
