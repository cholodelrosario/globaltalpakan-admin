a<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <b v-show="false">{{totalBalanceCredit}}</b>
            <b v-show="false">{{totalBalanceComms}}</b>
            <b v-show="false">{{totalBalanceMTD}}</b>
            <div class="q-pa-md row q-gutter-md">
                <q-input class="col" readonly dark outlined v-model="credits" type="number" label="Overall Credits Balance of Agent" />
                <q-input class="col" readonly dark outlined v-model="comms" type="number" label="Overall Commission Balance of Agent" />
                <q-input class="col" readonly dark outlined v-model="mtd" type="number" label="Overall MTD of Agent" />
            </div>
            <div class="row q-pa-sm q-gutter-sm">
                <q-select class="col column" dense @input="myAgentsNew()" clearable emit-value map-options dark v-model="type" :options="MAOption" label="Search By Master Agents" outlined/>
                <q-input style="width: 430px" borderless dense outlined placeholder="Enter '000'/Three Zero's to search ALL Agents" color="primary" debounce="300" v-model="filter" dark>
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                </q-input>
                <q-btn label="Search by UserName" class="text-black" borderless @click="searchAll()" dense outlined color="primary"/>
            </div>
            
        </div>
        <div class="q-pa-md">
            <q-table title="Agent" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="MasterAgentsAgent" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                        <q-td key="creditsAmount" :props="props">{{props.row.creditsAmount}}</q-td>
                        <q-td key="commisionBalance" :props="props">{{props.row.commisionBalance}}</q-td>
                        <q-td key="MTD" :props="props">{{props.row.MTD}}</q-td>
                        <q-td key="lastTransaction" :props="props">{{props.row.lastTransaction}}</q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    methods: {
        async searchAll(){
            this.type = null
            if(this.filter === ''){
                this.$q.dialog({
                title: 'Please Enter Agents Number to Search!',
                message: 'Fill Search Bar?',
                ok: 'Ok',
                cancel: 'Cancel',
                dark: true
                })
                this.MasterAgentsAgent = []
            }else{
                if(this.filter === '000'){
                    await this.checkWalletBalance()
                    await this.checkMTDBalance()
                    await this.masterAgents()
                    .then(() => {
                        let map = this.$lodash.map(this.Agents,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                        let MTDs = this.getMTD(a['.key'])
                        return {
                                ['.key']: a['.key'],
                                accountID: a['.key'],
                                masterAgentKey: a.masterAgentKey,
                                accountName: a.accountName,
                                accountPhone: a.accountPhone,
                                lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY') + ' at ' + this.$moment(a.lastTransaction.toDate()).format('hh:ss A'),
                                MTD: MTDs === undefined || MTDs === null ? 0 : MTDs,
                                creditsAmount: wallet.creditsAmount === undefined || wallet.creditsAmount === null ? 0 : wallet.creditsAmount,
                                commisionBalance: wallet.commisionBalance === undefined || wallet.commisionBalance === null ? 0 : wallet.commisionBalance
                            }
                        })
                        console.log(map, 'AgentsAccount')
                        let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                        this.MasterAgentsAgent = orderByP
                    }).catch(err => {
                        console.error(err)
                    })
                }else{
                    await this.checkWalletBalance()
                    await this.checkMTDBalance()
                    await this.masterAgents()
                    .then(() => {
                        // let filterSearch = this.$lodash.filter(this.Agents, p => {
                        //         return p.accountPhone === this.filter
                        // })
                        let map = this.$lodash.map(this.Agents,a=>{
                            let wallet = this.getwalletDetails(a['.key'])
                            let MTDs = this.getMTD(a['.key'])
                            return {
                                    ['.key']: a['.key'],
                                    accountID: a['.key'],
                                    masterAgentKey: a.masterAgentKey,
                                    accountName: a.accountName,
                                    accountPhone: a.accountPhone,
                                    lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY') + ' at ' + this.$moment(a.lastTransaction.toDate()).format('hh:ss A'),
                                    MTD: MTDs === undefined || MTDs === null ? 0 : MTDs,
                                    creditsAmount: wallet.creditsAmount === undefined || wallet.creditsAmount === null ? 0 : wallet.creditsAmount,
                                    commisionBalance: wallet.commisionBalance === undefined || wallet.commisionBalance === null ? 0 : wallet.commisionBalance
                                }
                        })
                        console.log(map, 'AgentsAccount')
                        let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                        this.MasterAgentsAgent = orderByP
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }
        },
        async myAgentsNew(){
            this.filter = ''
            if(this.type === null){
                this.MasterAgentsAgent = []
            }else{
                await this.checkWalletBalance()
                await this.checkMTDBalance()
                await this.masterAgents()
                .then(() => {
                    // let filterSearch = this.$lodash.filter(this.Agents, p => {
                    //         return p.masterAgentKey === this.type['.key']
                    // })
                    let map = this.$lodash.map(this.Agents,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                        let MTDs = this.getMTD(a['.key'])
                        return {
                                ['.key']: a['.key'],
                                accountID: a['.key'],
                                masterAgentKey: a.masterAgentKey,
                                accountName: a.accountName,
                                accountPhone: a.accountPhone,
                                lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY') + ' at ' + this.$moment(a.lastTransaction.toDate()).format('hh:ss A'),
                                MTD: MTDs === undefined || MTDs === null ? 0 : MTDs,
                                creditsAmount: wallet.creditsAmount === undefined || wallet.creditsAmount === null ? 0 : wallet.creditsAmount,
                                commisionBalance: wallet.commisionBalance === undefined || wallet.commisionBalance === null ? 0 : wallet.commisionBalance
                            }
                    })
                    console.log(map, 'AgentsAccount')
                    let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                    this.MasterAgentsAgent = orderByP
                }).catch(err => {
                    console.error(err)
                })
            }
        },
        async masterAgents(){
            if(this.filter === "000"){
                await this.$binding("Agents", this.$db.collection("Agents"))
                .then((Agents) => {
                    // console.log(wallet,'wallet') // => __ob__: Observer
                }).catch(err => {
                    console.error(err)
                })
            }else if(this.type !== null){
                await this.$binding("Agents", this.$db.collection("Agents").where("masterAgentKey","==",this.type['.key'] ))
                .then((Agents) => {
                    // console.log(wallet,'wallet') // => __ob__: Observer
                }).catch(err => {
                    console.error(err)
                })
            }else{
                await this.$binding("Agents", this.$db.collection("Agents").where("accountPhone","==",this.filter))
                .then((Agents) => {
                    // console.log(wallet,'wallet') // => __ob__: Observer
                }).catch(err => {
                    console.error(err)
                })
            }             
        },
        async checkWalletBalance(){
            await this.$binding("Wallet", this.$db.collection("Wallet"))
            .then((wallet) => {
                // console.log(wallet,'wallet') // => __ob__: Observer
            }).catch(err => {
                console.error(err)
            })             
        },
        async checkMTDBalance(){
            await this.$binding('TotalMonthYearMTD', this.$db.collection('TotalMonthYearMTD'))
            .then(TotalMonthYearMTD => {
            // console.log(TotalMonthYearMTD, 'TotalMonthYearMTD')
            }).catch(err => {
                console.error(err)
            })             
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
        getMTD(key){
            let date = this.$moment(new Date()).format('MM-YYYY-')
            let filterKey = date + key
            var docRef = null
            var data = null
            docRef = this.TotalMonthYearMTD.filter(a=>{
                return a['.key'] == filterKey
            })[0]
            data = {...docRef}
            delete data['.key']
            return data.MTD

        },
    },
    data(){
        return{
            MasterAgentsAgent: [],
            comms: 0,
            mtd: 0,
            credits: 0,
            pagination: {
                rowsPerPage: 0
            },
            Wallet: [],
            TotalMonthYearMTD: [],
            Agents: [],
            type: '',
            todate:  '',
            MasterAgents: [],
            filter: '',
            columns: [
                { name: 'accountName', align: 'left', required: true, label: 'Agent Name', field: 'accountName', sortable: true },
                { name: 'accountPhone', align: 'center', required: true, label: 'User Name', field: 'accountPhone', sortable: true },
                { name: 'creditsAmount', align: 'center', label: 'Credit Balance', field: 'creditsAmount', sortable: true },
                { name: 'commisionBalance', align: 'center', label: 'Commission Balance', field: 'commisionBalance', sortable: true },
                { name: 'MTD', align: 'center', label: 'MTD.', field: 'MTD', sortable: true },
                { name: 'lastTransaction', align: 'center', label: 'Last Transaction.', field: 'lastTransaction', sortable: true },
            ]
        }
    },
    computed: {
        totalBalanceCredit(){
            if(this.type === '' || this.type === null){
                let total = this.$lodash.sumBy(this.MasterAgentsAgent, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = total
            }else{
                let total = this.$lodash.filter(this.MasterAgentsAgent, p => {
                    return p.masterAgentKey === this.type['.key'] 
                })
                let sum = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = sum
            }       
        },
        totalBalanceComms(){
            if(this.type === '' || this.type === null){
                let total = this.$lodash.sumBy(this.MasterAgentsAgent, a => { 
                    return parseInt(a.commisionBalance)
                })
                return this.comms = total
            }else{
                let total = this.$lodash.filter(this.MasterAgentsAgent, p => {
                    return p.masterAgentKey === this.type['.key'] 
                })
                let sum = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.commisionBalance)
                })
                return this.comms = sum
            }       
        },
        totalBalanceMTD(){
            if(this.type === '' || this.type === null){
                let total = this.$lodash.sumBy(this.MasterAgentsAgent, a => { 
                    return parseInt(a.MTD)
                })
                return this.mtd = total
            }else{
                let total = this.$lodash.filter(this.MasterAgentsAgent, p => {
                    return p.masterAgentKey === this.type['.key'] 
                })
                let sum = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.MTD)
                })
                return this.mtd = sum
            }       
        },
        MAOption(){
            let optionss = this.MasterAgents.map(Ma => {
                return {
                    label: Ma.accountFirstName + ' ' + Ma.accountLastName,
                    value: Ma
                }
            })
            return optionss
        },
    },
    mounted() {
        this.$binding('MasterAgents', this.$db.collection('MasterAgents'))
            .then(MasterAgents => {
            console.log(MasterAgents, 'MasterAgents')
        })
    }
}
</script>
