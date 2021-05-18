<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <b v-show="false">{{totalBalanceCredit}}</b>
            <b v-show="false">{{totalBalanceComms}}</b>
            <b v-show="false">{{totalBalanceMTD}}</b>
            <div class="q-pa-md row q-gutter-md">
                <q-input class="col" readonly dark outlined v-model="credits" type="number" label="Overall Credits Balance of Coordinator" />
                <q-input class="col" readonly dark outlined v-model="comms" type="number" label="Overall Commission Balance of Coordinator" />
                <q-input class="col" readonly dark outlined v-model="mtd" type="number" label="Overall MTD of Coordinator" />
                <q-select @input="myCoordinatorsRanking()" class="col column" clearable emit-value map-options dark v-model="type" :options="option" label="Select Coordinator" outlined/>
            </div>
        </div>
        <div class="q-pa-md">
            <q-table title="Top MTD Coordinator" :filter="filter" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="myRanking" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                        <q-td key="type" :props="props">{{props.row.type}}</q-td>
                        <q-td key="creditsAmount" :props="props">{{props.row.creditsAmount}}</q-td>
                        <q-td key="commisionBalance" :props="props">{{props.row.commisionBalance}}</q-td>
                        <q-td key="MTD" :props="props">{{props.row.MTD}}</q-td>
                        <q-td key="lastTransaction" :props="props">{{props.row.lastTransaction}}</q-td>
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
    </q-page>
</template>
<script>
export default {
    data(){
        return{
            AgentRanking: [],
            MARanking: [],
            AllRanking: [],
            myRanking: [],
            credits: 0,
            comms: 0,
            mtd: 0,
            Agents: [],
            type: '',
            option: [
              'Agent',
              'Master Agent',
              'ALL'
            ],  
            TotalMonthYearMTD: [],
            Wallet: [],
            MasterAgents: [],
            filter: '',
            pagination: { page: 1, rowsPerPage: 20},
            columns: [
                { name: 'accountName', align: 'left', required: true, label: 'MA Name', field: 'accountName', sortable: true },
                { name: 'accountPhone', align: 'left', required: true, label: 'Number', field: 'accountPhone', sortable: true },
                { name: 'type', align: 'center', required: true, label: 'Type', field: 'type', sortable: true },
                { name: 'creditsAmount', align: 'center', label: 'Credits Balance', field: 'creditsAmount', sortable: true },
                { name: 'commisionBalance', align: 'center', label: 'Commission Balance.', field: 'commisionBalance', sortable: true },
                { name: 'MTD', align: 'center', label: 'MTD Comms.', field: 'MTD', sortable: true },
                { name: 'lastTransaction', align: 'center', label: 'Last Transaction', field: 'lastTransaction', sortable: true },
            ]
        }
    },
    methods: {
        async myCoordinatorsRanking(){
            // this.filter = ''
            if(this.type === ''){
                this.myRanking = []
            }else if(this.type === 'ALL'){
                await this.myAgentsDetails()
                await this.checkWalletBalance()
                await this.checkMTDBalance()
                await this.myMasterAgentsDetails()
                .then(() => {
                    let map = this.$lodash.map(this.Agents,a=>{
                    let wallet = this.getwalletDetailsAgents(a['.key'])
                    let MTDs = this.getMTDAgents(a['.key'])
                    return {
                            ['.key']: a['.key'],
                            accountID: a['.key'],
                            type: 'Agent',
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
                this.AgentRanking = orderByP
                }).catch(err => {
                    console.error(err)
                })
                .then(() => {
                    let map = this.$lodash.map(this.MasterAgents,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                        let MTDs = this.getMTD(a['.key'])
                        return {
                                ['.key']: a['.key'],
                                accountID: a['.key'],
                                type: 'Master Agent',
                                accountName: a.accountFirstName + ' ' + a.accountLastName,
                                accountPhone: a.accountPhone,
                                lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY') + ' at ' + this.$moment(a.lastTransaction.toDate()).format('hh:ss A'),
                                MTD: MTDs === undefined || MTDs === null ? 0 : MTDs,
                                creditsAmount: wallet.creditsAmount,
                                commisionBalance: wallet.commisionBalance === undefined || wallet.commisionBalance === null ? 0 : wallet.commisionBalance
                            }
                    })
                    let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                    this.MARanking = orderByP
                }).catch(err => {
                    console.error(err)
                })
                .then(() => {
                    this.myNewRanking = [...this.AgentRanking,...this.MARanking]
                    let orderByP = this.$lodash.orderBy(this.myNewRanking, ['MTD'], ['desc']);
                    this.myRanking = orderByP
                })
                .catch(err => {
                    console.error(err)
                })
            }else{
                await this.myAgentsDetails()
                await this.checkWalletBalance()
                await this.checkMTDBalance()
                await this.myMasterAgentsDetails()
                .then(() => {
                    let map = this.$lodash.map(this.Agents,a=>{
                    let wallet = this.getwalletDetailsAgents(a['.key'])
                    let MTDs = this.getMTDAgents(a['.key'])
                    return {
                            ['.key']: a['.key'],
                            accountID: a['.key'],
                            type: 'Agent',
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
                this.AgentRanking = orderByP
                }).catch(err => {
                    console.error(err)
                })
                .then(() => {
                    let map = this.$lodash.map(this.MasterAgents,a=>{
                        let wallet = this.getwalletDetails(a['.key'])
                        let MTDs = this.getMTD(a['.key'])
                        return {
                                ['.key']: a['.key'],
                                accountID: a['.key'],
                                type: 'Master Agent',
                                accountName: a.accountFirstName + ' ' + a.accountLastName,
                                accountPhone: a.accountPhone,
                                lastTransaction: a.lastTransaction === undefined ? 'No Transaction Yet' : this.$moment(a.lastTransaction.toDate()).format('MM-DD-YYYY') + ' at ' + this.$moment(a.lastTransaction.toDate()).format('hh:ss A'),
                                MTD: MTDs === undefined || MTDs === null ? 0 : MTDs,
                                creditsAmount: wallet.creditsAmount,
                                commisionBalance: wallet.commisionBalance === undefined || wallet.commisionBalance === null ? 0 : wallet.commisionBalance
                            }
                    })
                    let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                    this.MARanking = orderByP
                }).catch(err => {
                    console.error(err)
                })
                .then(() => {
                    this.myNewRanking = [...this.AgentRanking,...this.MARanking]
                    let orderByP = this.$lodash.orderBy(this.myNewRanking, ['MTD'], ['desc']);
                    let withType = this.$lodash.filter(orderByP, p => {
                        return p.type === this.type
                    })
                    this.myRanking = withType
                })
                .catch(err => {
                    console.error(err)
                })
            }
        },
        async myMasterAgentsDetails(){
            await this.$binding("MasterAgents", this.$db.collection("MasterAgents"))
            .then((MasterAgents) => {
                // console.log(wallet,'wallet') // => __ob__: Observer
            }).catch(err => {
                console.error(err)
            })             
        },
        async myAgentsDetails(){
            await this.$binding("Agents", this.$db.collection("Agents"))
            .then((Agents) => {
                // console.log(wallet,'wallet') // => __ob__: Observer
            }).catch(err => {
                console.error(err)
            })             
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
        getwalletDetailsAgents(key){
            var docRef = null
            var data = null
            docRef = this.Wallet.filter(a=>{
                return a['.key'] == key
            })[0]
            data = {...docRef}
            delete data['.key']
            return data

        },
        getMTDAgents(key){
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
            if(this.type === 'ALL'){
                let total = this.$lodash.sumBy(this.myRanking, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = total
            }else{
                let total = this.$lodash.filter(this.myRanking, p => {
                    return p.type === this.type
                })
                let totals = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = totals
            }       
        },
        totalBalanceComms(){
            if(this.type === 'ALL'){
              let total = this.$lodash.sumBy(this.myRanking, a => { 
                    return parseInt(a.commisionBalance)
              })
                return this.comms = total
            }else{
              let total = this.$lodash.filter(this.myRanking, p => {
                    return p.type === this.type
              })
              let totals = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.commisionBalance)
              })
                return this.comms = totals
            }
        },
        totalBalanceMTD(){
            if(this.type === 'ALL'){
              let total = this.$lodash.sumBy(this.myRanking, a => { 
                    return parseInt(a.MTD)
              })
                return this.mtd = total
            }else{
              let total = this.$lodash.filter(this.myRanking, p => {
                    return p.type === this.type
              })
              let totals = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.MTD)
              })
                return this.mtd = totals
            }
                       
        },
    },
    mounted() {

    }
}
</script>