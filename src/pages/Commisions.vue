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
            <!-- <div class="q-pa-md row q-gutter-md">
                <strong>From:</strong><q-input dark v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
                <strong>To:</strong><q-input dark v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
                <q-btn class="col column" color="accent" label="Create MA Account" @click="$router.push('/create-masteragent')"/>
            </div> -->
        </div>
        <div class="q-pa-md">
            <q-table title="Master Agent" :filter="filter" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="myMasterAgents" :columns="columns" row-key="name">
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
            credits: 0,
            comms: 0,
            mtd: 0,
            Agents: [],
            TotalMonthYearMTD: [],
            Wallet: [],
            CommissionHistory: [],
            fromdate:  '',
            todate:  '',
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
                let total = this.$lodash.sumBy(this.myMasterAgents, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = total       
        },
        totalBalanceComms(){
                let total = this.$lodash.sumBy(this.myMasterAgents, a => { 
                    return parseInt(a.commisionBalance)
                })
                return this.comms = total  
        },
        totalBalanceMTD(){
                let total = this.$lodash.sumBy(this.myMasterAgents, a => { 
                    return parseInt(a.MTD)
                })
                return this.mtd = total       
        },
        myMasterAgents(){
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
            // let downliness = map.filter(p => {
            //     return p.masterAgentKey === this.user.uid 
            // })
            let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
            return orderByP
        },
    },
    mounted() {
        // this.$db.collection('TeamGameAccountBets').where('gameKey',"==",this.$route.params.schedule),
        this.$binding('MasterAgents', this.$db.collection('MasterAgents'))
            .then(MasterAgents => {
            console.log(MasterAgents, 'MasterAgents')
        })
        this.$binding('CommissionHistory', this.$db.collection('CommissionHistory'))
            .then(CommissionHistory => {
            console.log(CommissionHistory, 'CommissionHistory')
        })
        this.$binding("Wallet", this.$db.collection("Wallet"))
        .then((wallet) => {
            console.log(wallet,'wallet') // => __ob__: Observer
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
    }
}
</script>