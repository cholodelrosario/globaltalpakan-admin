<template>
  <q-page class="bg-dark">
        <div full-width>
            <q-tabs v-model="tab" inline-label flat class="bg-secondary text-white shadow-2 col-12" >
                <q-tab class="col-4" name="magents" label="Master Agents" icon="mdi-account-multiple" />
            </q-tabs>
        </div>
        <div class="q-pa-md">
            <q-table class="bg-secondary text-white" :pagination.sync="pagination" title="Master Agents Withdrawal Request" :data="this.returnMAwithdrwals" :columns="columns" :filter="filter" row-key="name">
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="accountFirstName" :props="props">{{props.row.from.accountFirstName + ' ' + props.row.from.accountLastName}}</q-td>
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
            MasterAgents: [],
            MasterAgentsWithdrawal: [],
            columns: [
                { name: 'accountFirstName', required: true, label: 'Full Name', align: 'left', field: 'accountFirstName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'left', field: 'accountPhone', sortable: true },
                { name: 'amount', required: true, label: 'Amount', align: 'left', field: 'amount', sortable: true },
                { name: 'status', required: true, label: 'Status', align: 'left', field: 'status', sortable: true },
                { name: 'action', align: 'right', label: 'Action' }
            ],
        }
    },
    mounted() {
        let user = this.$store.getters['useraccount/isAuthenticated']
        console.log(user,'user')
        this.$binding("accountObj", this.$db.collection("Accounts").doc(user.userDBKey))
        .then((account) => {
            console.log(account,'account') // => __ob__: Observer
        }).catch(err => {
            console.error(err)
        })
        this.$binding('MasterAgents', this.$db.collection('MasterAgents'))
            .then(MasterAgents => {
            console.log(MasterAgents, 'MasterAgents')
        })
        this.$binding('MasterAgentsWithdrawal', this.$db.collection('MasterAgentsWithdrawal'))
            .then(MasterAgentsWithdrawal => {
            console.log(MasterAgentsWithdrawal, 'MasterAgentsWithdrawal')
        })
    },
    computed: {
        returnMAwithdrwals () {
            let orderBy = this.$lodash.orderBy(this.MasterAgentsWithdrawal, ['timestamp'], ['desc']);
            return orderBy
        }
    },
    methods:{
        async approveWithdrawal(agent){
            this.$q.dialog({
                dark: true,
                title: `Approve ${agent.from.accountFirstName + '' + agent.from.accountLastName} Withdrawals?`,
                message: `Approve P${agent.amount} Withdrawals`,
                cancel: {
                    color: 'grey',
                    flat: true,
                },
                persistent: true
            }).onOk(() =>{
                let user = this.$store.getters['useraccount/isAuthenticated']
                console.log(user,'user')
                let masterAgentID = agent.masterAgentKey
                let userID = user.userDBKey
                agent.status = agent.status == false ? true : false
                let key = agent['.key']
                let update = {...agent}
                delete update['.key']
                this.$db.collection(`MasterAgentsWithdrawal`).doc(key).set(update)
                var approveHistory = {
                    withdrawalID: agent['.key'],
                    withdrawBy: agent.from,
                    withdrawAmount: agent.amount,
                    approveByID: userID,
                    approveBy: this.accountObj,
                    timestamp: new Date(),
                }
                console.log(approveHistory, 'approveHistory')
                this.$db.collection('AdminApprovalHistory').add(approveHistory)
                try {
                    const response = firebaseDb.collection('MasterAgents').doc(masterAgentID).update({ lastTransaction: new Date() })
                    if(response) { console.log('%c SUCCESS_LAST_TRANSACTION','background: #222; color: #bada55') }
                } catch (error) {
                    console.log(error,'error')
                    console.log('%c ERROR_LAST_TRANSACTION','background: #D50000; color: #fff')
                }
                this.$q.notify({
                    message: `${agent.from.accountFirstName + '' + agent.from.accountLastName} Withdrawals has been Approved`,
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
