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
                <q-select class="col column" clearable emit-value map-options dark v-model="type" :options="option" label="Select Coordinator" outlined/>
            </div>
            <!-- <div class="q-pa-md row q-gutter-md">
                <strong>From:</strong><q-input dark v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
                <strong>To:</strong><q-input dark v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
                <q-btn class="col column" color="accent" label="Create MA Account" @click="$router.push('/create-masteragent')"/>
            </div> -->
        </div>
        <div class="q-pa-md">
            <q-table title="Top MTD Coordinator" :filter="filter" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="allAgents" :columns="columns" row-key="name">
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
            credits: 0,
            comms: 0,
            mtd: 0,
            Agents: [],
            type: '',
            option: [
              'Agent',
              'Master Agent'
            ],
            TotalMonthYearMTD: [],
            Wallet: [],
            CommissionHistory: [],
            fromdate:  '',
            todate:  '',
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
        allAgents(){
          let allmyAgents = [...this.myAgents,...this.myMasterAgents]
          if(this.type === '' || this.type === null){
            let orderByP = this.$lodash.orderBy(allmyAgents, ['MTD'], ['desc']);
            return orderByP
          }else{
            let withType = this.$lodash.filter(allmyAgents, p => {
                return p.type === this.type
            })
              return withType
          }
        },
        myAgents(){
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
              // let downliness = map.filter(p => {
              //     return p.masterAgentKey === this.user.uid 
              // })
              let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
              return orderByP
        },
        totalBalanceCredit(){
            if(this.type === '' || this.type === null){
                let total = this.$lodash.sumBy(this.allAgents, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = total
            }else{
                let total = this.$lodash.filter(this.allAgents, p => {
                    return p.type === this.type
                })
                let totals = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.creditsAmount)
                })
                return this.credits = totals
            }       
        },
        totalBalanceComms(){
            if(this.type === '' || this.type === null){
              let total = this.$lodash.sumBy(this.allAgents, a => { 
                    return parseInt(a.commisionBalance)
              })
                return this.comms = total
            }else{
              let total = this.$lodash.filter(this.allAgents, p => {
                    return p.type === this.type
              })
              let totals = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.commisionBalance)
              })
                return this.comms = totals
            }
        },
        totalBalanceMTD(){
            if(this.type === '' || this.type === null){
              let total = this.$lodash.sumBy(this.allAgents, a => { 
                    return parseInt(a.MTD)
              })
                return this.mtd = total
            }else{
              let total = this.$lodash.filter(this.allAgents, p => {
                    return p.type === this.type
              })
              let totals = this.$lodash.sumBy(total, a => { 
                    return parseInt(a.MTD)
              })
                return this.mtd = totals
            }
                       
        },
        myMasterAgents(){
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