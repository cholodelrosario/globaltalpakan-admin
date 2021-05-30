<template>
  <q-page class="bg-dark">
        <b v-show="false">{{withdrawalAmount}}</b>
        <div full-width>
            <q-tabs v-model="tab" @click="clear()" inline-label flat class="bg-secondary text-white shadow-2 col-12" >
                <q-tab class="col-4" name="withdraw" label="Withdrawals History" icon="mdi-account-multiple" />
                <q-tab class="col-4" name="credit" label="Crediting History" icon="mdi-account-multiple" />
                <q-tab class="col-4" name="convert" label="Commission Convertion History" icon="mdi-account-multiple" />
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
                 <strong class="text-white">{{this.tab == 'withdraw' ? 'Total Credits Withdraw' : this.tab == 'credit' ? 'Total Credits Sold' : 'Total Comms Converted'}}</strong><q-input dark  outlined v-model="amountWithdraw" type="number" label="Credits" />
            </div>
            <div class="col text-white">
                <strong class="text-white">By:</strong><q-select @input="openMounted()" clearable emit-value map-options dark v-model="type" :options="MAOption" label="Select Admin" outlined/>
            </div>
        </div>
        <div class="row q-pa-md q-gutter-sm">
            <!-- <q-input style="width: 430px" borderless dense outlined placeholder="Enter 'All' to search ALL Games" color="primary" debounce="300" v-model="filter" dark>
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input> -->
            <q-btn label="Search All History" class="text-black" borderless @click="searchAll()" dense outlined color="primary"/>
        </div>
        <div class="q-pa-md">
            <q-table class="bg-secondary text-white" :title="this.tab == 'withdraw' ? 'Withdrawal History' : this.tab == 'credit' ? 'Crediting History' : 'Convertion History' " :data="returnMAwithdrwals" :columns="this.tab == 'withdraw' ? columns : this.tab == 'credit' ? col : colcol" :filter="filter" row-key="name">
                <template v-if="this.tab == 'withdraw'" v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="accountFirstName" :props="props">{{props.row.withdrawBy.accountFirstName + ' ' + props.row.withdrawBy.accountLastName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.withdrawBy.accountPhone}}</q-td>
                        <q-td key="amount" :props="props">{{props.row.withdrawAmount}}</q-td>
                        <q-td key="status" :props="props">{{props.row.timestamp.toDate()}}</q-td>
                        <q-td key="approvedBy" :props="props">{{props.row.approveBy.accountFirstName + ' ' + props.row.approveBy.accountLastName}}</q-td>
                    </q-tr>
                </template>
                <template v-else-if="this.tab == 'credit'" v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="accountFullName" :props="props">{{props.row.to.accountFirstName !== undefined ? props.row.to.accountFirstName + ' ' + props.row.to.accountLastName : props.row.to.accountName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.to.accountPhone}}</q-td>
                        <q-td key="amount" :props="props">{{props.row.amount}}</q-td>
                        <q-td key="status" :props="props">{{props.row.timestamp.toDate()}}</q-td>
                        <q-td key="creditedBy" :props="props">{{props.row.from.displayName}}</q-td>
                    </q-tr>
                </template>
                <template v-else v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="accountFullName" :props="props">{{props.row.convertedBy.accountFirstName !== undefined ? props.row.convertedBy.accountFirstName + ' ' + props.row.convertedBy.accountLastName : props.row.convertedBy.accountName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.convertedBy.accountPhone}}</q-td>
                        <q-td key="amount" :props="props">{{props.row.convertedAmount}}</q-td>
                        <q-td key="status" :props="props">{{props.row.timestamp.toDate()}}</q-td>
                        <q-td key="creditedBy" :props="props">{{props.row.approveBy.accountFirstName + ' ' + props.row.approveBy.accountLastName}}</q-td>
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
            searchALLwithdraw: false,
            searchALLconvert: false,
            searchALLcredit: false,
            adminConvertObj: [],
            Accounts: [],
            amountWithdraw: 0,
            type: '',
            fromdate: date.formatDate(new Date(),'YYYY/MM/DD'),
            todate: date.formatDate(new Date(),'YYYY/MM/DD'),
            CreditHistory: [],
            AdminApprovalHistory: [],
            filter: '',
            // accountObj: null,
            tab: 'withdraw',
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
            colcol: [
                { name: 'accountFullName', required: true, label: 'Full Name', align: 'left', field: 'accountFullName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'left', field: 'accountPhone', sortable: true },
                { name: 'amount', required: true, label: 'Amount', align: 'left', field: 'amount', sortable: true },
                { name: 'status', required: true, label: 'Date of Convertion', align: 'left', field: 'status', sortable: true },
                { name: 'creditedBy', align: 'right', label: 'Converted By' }
            ],
        }
    },
    mounted() {
        this.$binding('Accounts', this.$db.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
        })
    },
    computed: {
        withdrawalAmount(){
            if(this.tab == 'withdraw'){
                // let totalWithdraw = this.$lodash.filter(this.AdminApprovalHistory, p => {
                //     return p.approveByID === this.type['.key'] 
                // })
                let sumWithdraw = this.$lodash.sumBy(this.AdminApprovalHistory, a => { 
                    return parseInt(a.withdrawAmount)
                    })
                console.log(sumWithdraw, 'sum')
                return this.amountWithdraw = sumWithdraw
            }else if(this.tab == 'credit'){
                // let totalCredit = this.$lodash.filter(this.CreditHistory, p => {
                //     return p.from.accountID === this.type['.key'] 
                // })
                // console.log(totalCredit, 'totalCredit')
                let sumCredit = this.$lodash.sumBy(this.CreditHistory, a => { 
                    return parseInt(a.amount)
                    })
                console.log(sumCredit, 'sum')
                return this.amountWithdraw = sumCredit
            }else{
                // let totalConvert = this.$lodash.filter(this.adminConvertObj, p => {
                //     return p.approveByID === this.type['.key'] 
                // })
                // console.log(totalConvert, 'totalCredit')
                let sumConvert = this.$lodash.sumBy(this.adminConvertObj, a => { 
                    return parseInt(a.convertedAmount)
                    })
                console.log(sumConvert, 'sum')
                return this.amountWithdraw = sumConvert    
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
                return this.AdminApprovalHistory  
          }else if(this.tab == 'credit'){
            //   if(this.type === null){
                    return this.CreditHistory
            //   }else{
                // let creditH2wo = this.$lodash.filter(this.CreditHistory, m => {
                // return m.from.accountID == this.type['.key']
                // })
            //     let orderByCredit = this.$lodash.orderBy(this.CreditHistory, ['timestamp'], ['desc']);
            //     console.log(orderByCredit, 'orderByCredit')
            //     return orderByCredit
            //   }
          }else{
            //   if(this.type == null){
            //     return []
            //   }else{
                return this.adminConvertObj
            //   }
          }
        }
    },
    methods:{
        async searchAll(){
            this.type = null
            this.$q.dialog({
            title: 'Search All' + ' ' + this.tab,
            // message: 'Fill Search Bar?',
            ok: 'Ok',
            cancel: 'Cancel',
            dark: true
            }).onOk(async () => {
                if(this.tab === 'withdraw'){
                    this.searchALLwithdraw = true
                    await this.approvalHistoryAdmin()
                }else if(this.tab === 'credit'){
                    this.searchALLcredit = true
                    await this.creditHistoryAdmin()
                }else{
                    await this.convertionHistoryAdmin()
                }
            })
        },
        async openMounted(){
            this.amountWithdraw = 0
            await this.convertionHistoryAdmin()
            await this.creditHistoryAdmin()
            await this.approvalHistoryAdmin()
        },
        async convertionHistoryAdmin(){
            if(this.type !== null){
                await this.$binding('adminConvertObj', this.$db.collection("AdminConvertionApprovalHistory").where("approveByID","==",this.type['.key']))
                .then(adminConvertObj => {
                    console.log(adminConvertObj, 'adminConvertObj')
                }).catch(err => {
                    console.error(err)
                })
            }else{
                await this.$binding('adminConvertObj', this.$db.collection("AdminConvertionApprovalHistory"))
                .then(adminConvertObj => {
                    console.log(adminConvertObj, 'adminConvertObj')
                }).catch(err => {
                    console.error(err)
                })
            }             
        },
        async creditHistoryAdmin(){
            if(this.type !== null){
                await this.$binding('CreditHistory', this.$db.collection('CreditHistory').where("from.accountID","==",this.type['.key']))
                .then(CreditHistory => {
                    console.log(CreditHistory, 'CreditHistory')
                }).catch(err => {
                    console.error(err)
                })
            }else if(this.searchALLcredit === true){
                await this.$binding('CreditHistory', this.$db.collection('CreditHistory').where("from.accountPosition","==",'Admin'))
                .then(CreditHistory => {
                    console.log(CreditHistory, 'CreditHistory')
                }).catch(err => {
                    console.error(err)
                })
            }             
        },
        async approvalHistoryAdmin(){
            if(this.type !== null){
                await this.$binding('AdminApprovalHistory', this.$db.collection('AdminApprovalHistory').where("approveByID","==",this.type['.key']))
                .then(AdminApprovalHistory => {
                    console.log(AdminApprovalHistory, 'AdminApprovalHistory')
                }).catch(err => {
                    console.error(err)
                })
            }else if(this.searchALLwithdraw === true){
                await this.$binding('AdminApprovalHistory', this.$db.collection('AdminApprovalHistory'))
                .then(AdminApprovalHistory => {
                    console.log(AdminApprovalHistory, 'AdminApprovalHistory')
                }).catch(err => {
                    console.error(err)
                })
            }        
        },  
        clear(){
            this.amountWithdraw = 0
            this.type = ''
        }
    }
}
</script>
