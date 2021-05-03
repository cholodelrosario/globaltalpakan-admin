<template>
  <q-page class="container flex q-pa-lg bg-dark">
      <div class="full-width">
        <h5 class="text-primary text-weight-bolder q-mt-none">DASHBOARD</h5>
        <q-list>
            <!-- COMPUTED DAILY -->
            <q-item dark>
                <q-item-section>
                    <q-item-label caption lines="2" >Computed Company Commissions Daily: </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black bg-primary q-pa-md">
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.endGamesCommission === null ? 0 : this.endGamesCommission}}</q-item-label>
                    <q-item-label caption lines="2">Per Games Commission Daily<br>(Company Commission)</q-item-label>
                </q-item-section>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.betOptionsCommission === null ? 0 : this.betOptionsCommission}}</q-item-label>
                    <q-item-label caption lines="2">Per Bet Options Commission Daily <br>(Company Commission)</q-item-label>
                </q-item-section>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.overallDaily}}</q-item-label>
                    <q-item-label caption lines="2">Overall Bet Options and Games Commission Daily <br>(Company Commission)</q-item-label>
                </q-item-section>
            </q-item>
            <!-- COMPUTED MONTHLY -->
            <q-item dark class="">
                <q-item-section>
                    <q-item-label caption lines="2">Computed Company Commissions Monthly: </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black bg-primary q-pa-md">
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.endGamesCommissionMonthly === null ? 0 : this.endGamesCommissionMonthly}}</q-item-label>
                    <q-item-label caption lines="2">Per Games Commission Monthly<br>(Company Commission)</q-item-label>
                </q-item-section>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.betOptionsCommissionMonthly === null ? 0 : this.betOptionsCommissionMonthly}}</q-item-label>
                    <q-item-label caption lines="2">Per Bet Options Commission Monthly <br>(Company Commission)</q-item-label>
                </q-item-section>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.overallMonthly}}</q-item-label>
                    <q-item-label caption lines="2">Overall Bet Options and Games Commission Monthly<br>(Company Commission)</q-item-label>
                </q-item-section>
            </q-item>
            <!-- COMPUTED YEARLY -->
            <q-item dark class="">
                <q-item-section>
                    <q-item-label caption lines="2">Computed Company Commissions Yearly: </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black bg-primary q-pa-md">
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.endGamesCommissionYearly === null ? 0 : this.endGamesCommissionYearly}}</q-item-label>
                    <q-item-label caption lines="2">Per Games Commission Yearly<br>(Company Commission)</q-item-label>
                </q-item-section>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.betOptionsCommissionYearly === null ? 0 : this.betOptionsCommissionYearly}}</q-item-label>
                    <q-item-label caption lines="2">Per Bet Options Commission Yearly <br>(Company Commission)</q-item-label>
                </q-item-section>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.overallYearly}}</q-item-label>
                    <q-item-label caption lines="2">Overall Bet Options and Games Commission Yearly<br>(Company Commission)</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
        <br>
        <br>
        <div class="container row q-gutter-sm q-mt-sm">
            <q-btn color="primary" class="text-black col" label="Send Credits" icon="send" @click="$router.push('/credits')"/>
            <q-btn color="primary" class="text-black col" label="Withdrawals" icon="credit_card" @click="$router.push('/withdrawal')"/>
        </div>
        <br>
        <div>
            <h6 class="text-white flex flex-center q-ma-none">Agents And Master Agents</h6>
            <br>
            <q-table title="Top MTD Coordinator" :filter="filter" :pagination.sync="pagination" flat :rows-per-page-options="[0]" class="bg-dark text-white" :data="allAgents" :columns="columns" row-key="name">
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
      </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'
const { getDateDiff } = date
export default {
    data(){
        return {
            MasterAgents: [],
            Wallet: [],
            TotalMonthYearMTD: [],
            Agents: [],
            BetOptionsEndGames: [],
            EndGames: [],
            TotalMonthYearMTD: [],
            walletObj: null,
            Wallet: [],
            filter: '',
            pagination: { page: 1, rowsPerPage: 20},
            columns: [
                { name: 'accountName', align: 'left', required: true, label: 'Name', field: 'accountName', sortable: true },
                { name: 'accountPhone', align: 'left', required: true, label: 'Number', field: 'accountPhone', sortable: true },
                { name: 'type', align: 'center', required: true, label: 'Type', field: 'type', sortable: true },
                { name: 'creditsAmount', align: 'center', label: 'Credits Balance', field: 'creditsAmount', sortable: true },
                { name: 'commisionBalance', align: 'center', label: 'Commission Balance.', field: 'commisionBalance', sortable: true },
                { name: 'MTD', align: 'center', label: 'MTD Comms.', field: 'MTD', sortable: true },
                { name: 'lastTransaction', align: 'center', label: 'Last Transaction', field: 'lastTransaction', sortable: true },
            ]
        }
    },
    mounted(){
        this.$binding('TotalMonthYearMTD', this.$db.collection('TotalMonthYearMTD'))
        .then(TotalMonthYearMTD => {
          console.log(TotalMonthYearMTD, 'TotalMonthYearMTD')
        })
        this.$binding('EndGames', this.$db.collection('EndGames'))
        .then(EndGames => {
          console.log(EndGames, 'EndGames')
        })
        this.$binding('Wallet', this.$db.collection('Wallet'))
        .then(Wallet => {
          console.log(Wallet, 'Wallet')
        })
        this.$binding('BetOptionsEndGames', this.$db.collection('BetOptionsEndGames'))
        .then(BetOptionsEndGames => {
          console.log(BetOptionsEndGames, 'BetOptionsEndGames')
        })
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
        this.$binding('TotalMonthYearMTD', this.$db.collection('TotalMonthYearMTD'))
        .then(TotalMonthYearMTD => {
          console.log(TotalMonthYearMTD, 'TotalMonthYearMTD')
        })
        this.$binding('Agents', this.$db.collection('Agents'))
        .then(Agents => {
          console.log(Agents, 'Agents')
        })
    },
    methods:{
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
        // ALL AGENTS AND MASTER AGENTS
        allAgents(){
          let allmyAgents = [...this.myAgents,...this.myMasterAgents]
            let orderByP = this.$lodash.orderBy(allmyAgents, ['MTD'], ['desc']);
            return orderByP
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
        // DAILY COMPUTATIONS
        overallDaily(){
            return parseFloat(this.endGamesCommission) + parseFloat(this.betOptionsCommission)
        },
        endGamesCommission(){
            let todaysDate = this.$moment(new Date()).format('MM-DD-YYYY')
            let filterToday = this.$lodash.filter(this.EndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('MM-DD-YYYY') === todaysDate
              })
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.companyCommission)
            })
                return totalComms
        },
        betOptionsCommission(){
            let todaysDate = this.$moment(new Date()).format('MM-DD-YYYY')
            let filterToday = this.$lodash.filter(this.BetOptionsEndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('MM-DD-YYYY') === todaysDate
              })
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.companyCommission)
            })
                return totalComms
        },
        // MONTHLY COMPUTATIONS
        overallMonthly(){
            return parseFloat(this.endGamesCommissionMonthly) + parseFloat(this.betOptionsCommissionMonthly)
        },
        endGamesCommissionMonthly(){
            let todaysDate = this.$moment(new Date()).format('MM-YYYY')
            let filterToday = this.$lodash.filter(this.EndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('MM-YYYY') === todaysDate
              })
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.companyCommission)
            })
                return totalComms
        },
        betOptionsCommissionMonthly(){
            let todaysDate = this.$moment(new Date()).format('MM-YYYY')
            let filterToday = this.$lodash.filter(this.BetOptionsEndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('MM-YYYY') === todaysDate
              })
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.companyCommission)
            })
                return totalComms
        },
        // YEARLY COMPUTATIONS
        overallYearly(){
            return parseFloat(this.endGamesCommissionYearly) + parseFloat(this.betOptionsCommissionYearly)
        },
        endGamesCommissionYearly(){
            let todaysDate = this.$moment(new Date()).format('YYYY')
            let filterToday = this.$lodash.filter(this.EndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('YYYY') === todaysDate
              })
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.companyCommission)
            })
                return totalComms
        },
        betOptionsCommissionYearly(){
            let todaysDate = this.$moment(new Date()).format('YYYY')
            let filterToday = this.$lodash.filter(this.BetOptionsEndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('YYYY') === todaysDate
              })
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.companyCommission)
            })
                return totalComms
        },
    }
}
</script>
