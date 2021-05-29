<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <b v-show="false">{{totalBalanceCredit}}</b>
            <b v-show="false">{{totalBalanceComms}}</b>
            <b v-show="false">{{totalBalanceMTD}}</b>
            <div class="q-pa-md row q-gutter-md">
                <q-input class="col" readonly dark outlined v-model="credits" type="number" label="Overall Credits Balance of Master Agents" />
                <q-input class="col" readonly dark outlined v-model="comms" type="number" label="Overall Commission Balance of Master Agents" />
                <q-input class="col" readonly dark outlined v-model="mtd" type="number" label="Overall MTD of Master Agents" />
            </div>
        </div>
        <div class="row q-pa-md q-gutter-sm">
            <q-input style="width: 430px" borderless type="number" dense outlined placeholder="Enter '000'/Three Zero's to search ALL Master Agents" color="primary" debounce="300" v-model="filter" dark>
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
            <q-btn label="Search by Number" class="text-black" borderless @click="searchAll()" dense outlined color="primary"/>
        </div>
        <div class="q-pa-md">
            <q-table title="Master Agent" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="MymasterAgents" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="accountFirstName" :props="props">{{props.row.accountFirstName + ' ' + props.row.accountLastName}}</q-td>
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
export default {
    data(){
        return{
            MymasterAgents: [],
            credits: 0,
            comms: 0,
            mtd: 0,
            TotalMonthYearMTD: [],
            Wallet: [],
            MasterAgents: [],
            filter: '',
            pagination: {
                rowsPerPage: 0
            },
            columns: [
                { name: 'accountFirstName', align: 'left', required: true, label: 'MA Name', field: 'accountFirstName', sortable: true },
                { name: 'accountPhone', align: 'left', required: true, label: 'Number', field: 'accountPhone', sortable: true },
                { name: 'creditsAmount', align: 'center', label: 'Credits Balance', field: 'creditsAmount', sortable: true },
                { name: 'commisionBalance', align: 'center', label: 'Commission Balance.', field: 'commisionBalance', sortable: true },
                { name: 'MTD', align: 'center', label: 'MTD Comms.', field: 'MTD', sortable: true },
                { name: 'lastTransaction', align: 'center', label: 'Last Transaction', field: 'lastTransaction', sortable: true },
            ]
        }
    },
    methods: {
        async searchAll(){
            if(this.filter === ''){
                this.$q.dialog({
                title: 'Please Enter MA Number to Search!',
                message: 'Fill Search Bar?',
                ok: 'Ok',
                cancel: 'Cancel',
                dark: true
                })
                this.MymasterAgents = []
            }else{
                if(this.filter === '000'){
                    await this.checkWalletBalance()
                    await this.checkMTDBalance()
                    await this.masterAgents()
                    .then(() => {
                        let map = this.$lodash.map(this.MasterAgents,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                        let MTDs = this.getMTD(a['.key'])
                            return {
                                    ['.key']: a['.key'],
                                    accountID: a['.key'],
                                    accountFirstName: a.accountFirstName,
                                    accountLastName: a.accountLastName,
                                    accountPhone: a.accountPhone,
                                    lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY') + ' at ' + this.$moment(a.lastTransaction.toDate()).format('hh:ss A'),
                                    MTD: MTDs === undefined || MTDs === null ? 0 : MTDs,
                                    creditsAmount: wallet.creditsAmount,
                                    commisionBalance: wallet.commisionBalance === undefined || wallet.commisionBalance === null ? 0 : wallet.commisionBalance
                                }
                        })
                            console.log(map, 'MasterAgentsAccount')
                            let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                            this.MymasterAgents = orderByP
                        }).catch(err => {
                            console.error(err)
                        })
                }else{
                    await this.checkWalletBalance()
                    await this.checkMTDBalance()
                    await this.masterAgents()
                    .then(() => {
                        // let filterSearch = this.$lodash.filter(this.MasterAgents, p => {
                        //         return p.accountPhone === this.filter
                        // })
                        let map = this.$lodash.map(this.MasterAgents,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                        let MTDs = this.getMTD(a['.key'])
                            return {
                                    ['.key']: a['.key'],
                                    accountID: a['.key'],
                                    accountFirstName: a.accountFirstName,
                                    accountLastName: a.accountLastName,
                                    accountPhone: a.accountPhone,
                                    lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY') + ' at ' + this.$moment(a.lastTransaction.toDate()).format('hh:ss A'),
                                    MTD: MTDs === undefined || MTDs === null ? 0 : MTDs,
                                    creditsAmount: wallet.creditsAmount,
                                    commisionBalance: wallet.commisionBalance === undefined || wallet.commisionBalance === null ? 0 : wallet.commisionBalance
                                }
                        })
                        console.log(map, 'MasterAgentsAccount')
                        let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                        this.MymasterAgents = orderByP
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }
        },
        async masterAgents(){
            if(this.filter === "000"){
                await this.$binding("MasterAgents", this.$db.collection("MasterAgents"))
                .then((MasterAgents) => {
                    // console.log(wallet,'wallet') // => __ob__: Observer
                }).catch(err => {
                    console.error(err)
                })
            }else{
                await this.$binding("MasterAgents", this.$db.collection("MasterAgents").where("accountPhone","==",this.filter))
                .then((MasterAgents) => {
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
            console.log(TotalMonthYearMTD, 'TotalMonthYearMTD')
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
    computed: {
        totalBalanceCredit(){
                let total = this.$lodash.sumBy(this.MymasterAgents, a => { 
                    return parseFloat(a.creditsAmount)
                })
                return this.credits = total       
        },
        totalBalanceComms(){
                let total = this.$lodash.sumBy(this.MymasterAgents, a => { 
                    return parseFloat(a.commisionBalance)
                })
                return this.comms = total  
        },
        totalBalanceMTD(){
                let total = this.$lodash.sumBy(this.MymasterAgents, a => { 
                    return parseFloat(a.MTD)
                })
                return this.mtd = total       
        },
    },
    mounted() {

    }
}
</script>