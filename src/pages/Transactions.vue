<template>
  <q-page class="bg-dark">
        <b v-show="false">{{withdrawalAmount}}</b>
        <div full-width>
            <q-tabs v-model="tab" @click="clear()" inline-label flat class="bg-secondary text-white shadow-2 col-12" >
                <q-tab class="col-4" name="withdraw" label="Withdrawals History" icon="mdi-account-multiple" />
                <q-tab class="col-4" name="credit" label="Crediting History" icon="mdi-account-multiple" />
            </q-tabs>
        </div>
        <div class="q-pa-md col-12 row q-gutter-md">
            <div class="col-3">
                <strong class="text-white">From:</strong><q-input dark v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
            </div>
            <div class="col-3">
                <strong class="text-white">To:</strong><q-input dark v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
            </div>
             <div class="text-white col-2 ">
                 <strong class="text-white">{{this.tab == 'withdraw' ? 'Total Credits Withdraw' : 'Total Credits Sold'}}</strong><q-input dark  outlined v-model="amountWithdraw" type="number" label="Credits" />
            </div>
            <div class="col text-white">
                <strong class="text-white">By:</strong><q-select emit-value map-options dark v-model="type" :options="MAOption" label="Select Admin" outlined/>
            </div>
        </div>
        <div class="q-pa-md">
            <q-table class="bg-secondary text-white" :title="this.tab == 'withdraw' ? 'Withdrawal History' : 'Crediting History' " :data="this.returnMAwithdrwals" :columns="this.tab == 'withdraw' ? columns : col" :filter="filter" row-key="name">
                <template v-if="this.tab == 'withdraw'" v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="accountFirstName" :props="props">{{props.row.withdrawBy.accountFirstName + ' ' + props.row.withdrawBy.accountLastName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.withdrawBy.accountPhone}}</q-td>
                        <q-td key="amount" :props="props">{{props.row.withdrawAmount}}</q-td>
                        <q-td key="status" :props="props">{{props.row.timestamp.toDate()}}</q-td>
                        <q-td key="approvedBy" :props="props">{{props.row.approveBy.accountFirstName + ' ' + props.row.approveBy.accountLastName}}</q-td>
                    </q-tr>
                </template>
                <template v-else v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="accountFullName" :props="props">{{props.row.to.accountFirstName !== undefined ? props.row.to.accountFirstName + ' ' + props.row.to.accountLastName : props.row.to.accountName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.to.accountPhone}}</q-td>
                        <q-td key="amount" :props="props">{{props.row.amount}}</q-td>
                        <q-td key="status" :props="props">{{props.row.timestamp.toDate()}}</q-td>
                        <q-td key="creditedBy" :props="props">{{props.row.from.displayName}}</q-td>
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
            Accounts: [],
            amountWithdraw: 0,
            type: '',
            fromdate: date.formatDate(new Date(),'YYYY/MM/DD'),
            todate: date.formatDate(new Date(),'YYYY/MM/DD'),
            CreditHistory: [],
            AdminApprovalHistory: [],
            filter: '',
            accountObj: null,
            tab: 'withdraw',
            MasterAgents: [],
            MasterAgentsWithdrawal: [],
            columns: [
                { name: 'accountFirstName', required: true, label: 'Full Name', align: 'left', field: 'accountFirstName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'left', field: 'accountPhone', sortable: true },
                { name: 'amount', required: true, label: 'Amount', align: 'left', field: 'amount', sortable: true },
                { name: 'status', required: true, label: 'Approved Date', align: 'left', field: 'status', sortable: true },
                { name: 'approvedBy', align: 'right', label: 'Approved By' }
            ],
            col: [
                { name: 'accountFullName', required: true, label: 'Full Name', align: 'left', field: 'accountFullName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'left', field: 'accountPhone', sortable: true },
                { name: 'amount', required: true, label: 'Amount', align: 'left', field: 'amount', sortable: true },
                { name: 'status', required: true, label: 'Date of Creditting', align: 'left', field: 'status', sortable: true },
                { name: 'creditedBy', align: 'right', label: 'Credited By' }
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
        this.$binding('Accounts', this.$db.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
        })
        this.$binding('MasterAgents', this.$db.collection('MasterAgents'))
            .then(MasterAgents => {
            console.log(MasterAgents, 'MasterAgents')
        })
        this.$binding('MasterAgentsWithdrawal', this.$db.collection('MasterAgentsWithdrawal'))
            .then(MasterAgentsWithdrawal => {
            console.log(MasterAgentsWithdrawal, 'MasterAgentsWithdrawal')
        })
        this.$binding('AdminApprovalHistory', this.$db.collection('AdminApprovalHistory'))
            .then(AdminApprovalHistory => {
            console.log(AdminApprovalHistory, 'AdminApprovalHistory')
        })
        this.$binding('CreditHistory', this.$db.collection('CreditHistory'))
            .then(CreditHistory => {
            console.log(CreditHistory, 'CreditHistory')
        })
    },
    computed: {
        withdrawalAmount(){
            if(this.tab == 'withdraw'){
                let totalWithdraw = this.$lodash.filter(this.AdminApprovalHistory, p => {
                    return p.approveByID === this.type['.key'] 
                })
                let sumWithdraw = this.$lodash.sumBy(totalWithdraw, a => { 
                    return parseInt(a.withdrawAmount)
                    })
                console.log(sumWithdraw, 'sum')
                return this.amountWithdraw = sumWithdraw
            }else if(this.tab == 'credit'){
                let totalCredit = this.$lodash.filter(this.CreditHistory, p => {
                    return p.from.accountID === this.type['.key'] 
                })
                console.log(totalCredit, 'totalCredit')
                let sumCredit = this.$lodash.sumBy(totalCredit, a => { 
                    return parseInt(a.amount)
                    })
                console.log(sumCredit, 'sum')
                return this.amountWithdraw = sumCredit
            }else{
                return 0    
            }
        },
        MAOption(){
            let optionss = this.Accounts.map(Accounts => {
                return {
                    label: Accounts.accountFirstName + ' ' + Accounts.accountLastName,
                    value: Accounts
                }
            })
            return optionss
        },
        returnMAwithdrwals () {
          if(this.tab == 'withdraw'){
              let orderBy = this.$lodash.orderBy(this.AdminApprovalHistory, ['timestamp'], ['desc']);
              if(this.type === ''){
                    return orderBy
              }else{
                    let byMasterAgent = this.$lodash.filter(orderBy, m => {
                            return m.approveByID === this.type['.key']
                    })
                    console.log(byMasterAgent, 'byMasterAgent')
                    return byMasterAgent
              }
          }else{
              if(this.type === ''){
                  return this.CreditHistory
              }else{
                let creditH = this.$lodash.filter(this.CreditHistory, m => {
                return m.from.accountID == this.type['.key']
                })
                let orderByCredit = this.$lodash.orderBy(creditH, ['timestamp'], ['desc']);
                console.log(orderByCredit, 'orderByCredit')
                return orderByCredit
              }
          }
        }
    },
    methods:{
        clear(){
            this.amountWithdraw = 0
            this.type = ''
        }
    }
}
</script>
