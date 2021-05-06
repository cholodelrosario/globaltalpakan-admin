<template>
  <q-page class="container flex q-pa-lg bg-dark">
      <div class="full-width">
        <h5 class="text-primary text-weight-bolder q-mt-none">TOTAL SALES OF AGENTS AND COMPANY</h5>
        <q-list>
            <!-- COMPUTED DAILY -->
            <q-item dark>
                <q-item-section>
                    <q-item-label caption lines="2" >Computed Daily: </q-item-label>
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
                    <q-item-label caption lines="2">Computed Monthly: </q-item-label>
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
                    <q-item-label caption lines="2">Computed Yearly: </q-item-label>
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
        <br>
        <h5 class="text-primary text-weight-bolder q-mt-none">TOTAL COMMISSION OF AGENTS AND MASTER AGENTS</h5>
        <q-list>
            <!-- COMPUTED DAILY -->
            <q-item dark>
                <q-item-section>
                    <q-item-label caption lines="2" >Computed Daily/Monthly/Yearly: </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black bg-primary q-pa-md">
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.agentMACommissionDaily === null ? 0 : this.agentMACommissionDaily}}</q-item-label>
                    <q-item-label caption lines="2">Agents and Master Agents<br>(Daily Commission)</q-item-label>
                </q-item-section>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.agentMACommissionMonthly === null ? 0 : this.agentMACommissionMonthly}}</q-item-label>
                    <q-item-label caption lines="2">Agents and Master Agents <br>(Monthly Commission)</q-item-label>
                </q-item-section>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.agentMACommissionYearly === null ? 0 : this.agentMACommissionYearly}}</q-item-label>
                    <q-item-label caption lines="2">Agents and Master Agents <br>(Yearly Commission)</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
        <br>
        <br>
        <br>
        <h5 class="text-primary text-weight-bolder q-mt-none">TOTAL SALES LESS AGENT AND MA COMMISSION</h5>
        <q-list>
            <!-- COMPUTED DAILY -->
            <q-item dark>
                <q-item-section>
                    <q-item-label caption lines="2" >Computed Monthly/Yearly: </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black bg-primary text-center flex flex-center q-pa-md">
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.totalSalesLessCommsMonthly === null ? 0 : this.totalSalesLessCommsMonthly}}</q-item-label>
                    <q-item-label caption lines="2">Total Monthly Sales <br>(Monthly Commission)</q-item-label>
                </q-item-section>
                <q-separator vertical inset/>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.totalSalesLessCommsYearly === null ? 0 : this.totalSalesLessCommsYearly}}</q-item-label>
                    <q-item-label caption lines="2">Total Yearly Sales <br>(Yearly Commission)</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
        <br>
        <br>
        <br>
        <h5 class="text-primary text-weight-bolder q-mt-none">TOTAL EXTRA COMMISSION</h5>
        <q-list>
            <!-- COMPUTED DAILY -->
            <q-item dark>
                <q-item-section>
                    <q-item-label caption lines="2" >Computed Monthly/Yearly (For Games): </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black bg-primary text-center flex flex-center q-pa-md">
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.extraCommissionMonthly === null ? 0 : this.extraCommissionMonthly}}</q-item-label>
                    <q-item-label caption lines="2">Total Extra Commission <br>(Monthly Commission)</q-item-label>
                </q-item-section>
                <q-separator vertical inset/>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.extraCommissionYearly === null ? 0 : this.extraCommissionYearly}}</q-item-label>
                    <q-item-label caption lines="2">Total Yearly Sales <br>(Yearly Commission)</q-item-label>
                </q-item-section>
            </q-item>
            <q-item dark>
                <q-item-section>
                    <q-item-label caption lines="2" >Computed Monthly/Yearly (For Bet Options): </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black bg-primary text-center flex flex-center q-pa-md">
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.extraCommissionMonthlyBetOpt === null ? 0 : this.extraCommissionMonthlyBetOpt}}</q-item-label>
                    <q-item-label caption lines="2">Total Extra Commission <br>(Monthly Commission)</q-item-label>
                </q-item-section>
                <q-separator vertical inset/>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.extraCommissionYearlyBetOpt === null ? 0 : this.extraCommissionYearlyBetOpt}}</q-item-label>
                    <q-item-label caption lines="2">Total Yearly Sales <br>(Yearly Commission)</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
        <br>
        <br>
        <br>
        <h5 class="text-primary text-weight-bolder q-mt-none">TOTAL SALES OF THE COMPANY</h5>
        <q-list>
            <!-- COMPUTED DAILY -->
            <q-item dark>
                <q-item-section>
                    <q-item-label caption lines="2" >Computed Monthly/Yearly: </q-item-label>
                </q-item-section>
            </q-item>
            <q-item class="text-black bg-primary text-center flex flex-center q-pa-md">
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.totalSalesOfCompanyMonthly === null ? 0 : this.totalSalesOfCompanyMonthly}}</q-item-label>
                    <q-item-label caption lines="2">Total Monthly Sales <br>(Monthly Commission)</q-item-label>
                </q-item-section>
                <q-separator vertical inset/>
                <q-item-section class="text-h6">
                    <q-item-label>₱ {{this.totalSalesOfCompanyYearly === null ? 0 : this.totalSalesOfCompanyYearly}}</q-item-label>
                    <q-item-label caption lines="2">Total Yearly Sales <br>(Yearly Commission)</q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
        <br>
        <br>
        <br>
    </div>
  </q-page>
</template>

<script>
import { date } from 'quasar'
const { getDateDiff } = date
export default {
    data(){
        return {
            BetOptionsEndGames: [],
            EndGames: [],
            TotalMonthYearMTD: [],
            CommissionHistory: [],
            walletObj: null,
            Wallet: [],
        }
    },
    mounted(){
        this.$binding('CommissionHistory', this.$db.collection('CommissionHistory'))
        .then(CommissionHistory => {
          console.log(CommissionHistory, 'CommissionHistory')
        })
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
    },
    methods:{
        
    },
    computed: {
        totalSalesOfCompanyYearly(){
            return parseFloat(this.totalSalesLessCommsYearly) + parseFloat(this.extraCommissionYearlyBetOpt) + parseFloat(this.extraCommissionYearly)
        },
        totalSalesOfCompanyMonthly(){
            return parseFloat(this.totalSalesLessCommsMonthly) + parseFloat(this.extraCommissionMonthlyBetOpt) + parseFloat(this.extraCommissionMonthly)
        },
        extraCommissionYearlyBetOpt(){
            let monthlyDate = this.$moment(new Date()).format('YYYY')
            let filterMonthly = this.$lodash.filter(this.BetOptionsEndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('YYYY') === monthlyDate
            })
            let map = this.$lodash.map(filterMonthly,a=>{
                return{
                    ['.key']: a['.key'],
                    totalMoneyBox:  a.totalMoneyBox,
                    companyCommission: a.companyCommission,
                    endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                    dateEnded: a.dateEnded 
                }
            })
            console.log(map, 'checkIndex')
            let totalExtraCommss = this.$lodash.sumBy(map, a => { 
                return parseFloat(a.totalMoneyBox - ((a.endingOddBets.totalBets * a.endingOddBets.odds) + a.companyCommission))
            })
            return totalExtraCommss
        },
        extraCommissionMonthlyBetOpt(){
            let monthlyDate = this.$moment(new Date()).format('MM-YYYY')
            let filterMonthly = this.$lodash.filter(this.BetOptionsEndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('MM-YYYY') === monthlyDate
            })
            let map = this.$lodash.map(filterMonthly,a=>{
                return{
                    ['.key']: a['.key'],
                    totalMoneyBox:  a.totalMoneyBox,
                    companyCommission: a.companyCommission,
                    endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                    dateEnded: a.dateEnded 
                }
            })
            console.log(map, 'checkIndex')
            let totalExtraCommss = this.$lodash.sumBy(map, a => { 
                return parseFloat(a.totalMoneyBox - ((a.endingOddBets.totalBets * a.endingOddBets.odds) + a.companyCommission))
            })
            return totalExtraCommss
        },
        extraCommissionMonthly(){
            let monthlyDate = this.$moment(new Date()).format('MM-YYYY')
            let filterMonthly = this.$lodash.filter(this.EndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('MM-YYYY') === monthlyDate
            })
            let map = this.$lodash.map(filterMonthly,a=>{
                return{
                    ['.key']: a['.key'],
                    totalMoneyBox:  a.totalMoneyBox,
                    companyCommission: a.companyCommission,
                    endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                    dateEnded: a.dateEnded 
                }
            })
            console.log(map, 'checkIndex')
            let totalExtraCommss = this.$lodash.sumBy(map, a => { 
                return parseFloat(a.totalMoneyBox - ((a.endingOddBets.totalBets * a.endingOddBets.odds) + a.companyCommission))
            })
            return totalExtraCommss
        },
        extraCommissionYearly(){
            let monthlyDate = this.$moment(new Date()).format('YYYY')
            let filterMonthly = this.$lodash.filter(this.EndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('YYYY') === monthlyDate
            })
            let map = this.$lodash.map(filterMonthly,a=>{
                return{
                    ['.key']: a['.key'],
                    totalMoneyBox:  a.totalMoneyBox,
                    companyCommission: a.companyCommission,
                    endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                    dateEnded: a.dateEnded 
                }
            })
            console.log(map, 'checkIndex')
            let totalExtraCommss = this.$lodash.sumBy(map, a => { 
                return parseFloat(a.totalMoneyBox - ((a.endingOddBets.totalBets * a.endingOddBets.odds) + a.companyCommission))
            })
            return totalExtraCommss
        },
        totalSalesLessCommsYearly(){
            return parseFloat(this.overallYearly) - parseFloat(this.agentMACommissionYearly)
        },
        totalSalesLessCommsMonthly(){
            return parseFloat(this.overallMonthly) - parseFloat(this.agentMACommissionMonthly)
        },
        // agentMACommissionDaily(){
        //     let todaysDate = this.$moment(new Date()).format('MM-DD-YYYY')
        //     let filterToday = this.$lodash.filter(this.CommissionHistory, p => {
        //             return this.$moment(p.timestamp.toDate()).format('MM-DD-YYYY') === todaysDate
        //       })    
        //     let totalComms = this.$lodash.sumBy(filterToday, a => { 
        //         return parseFloat(a.amount)
        //     })
        //         return totalComms
        // },
        agentMACommissionDaily(){
            let todaysDate = this.$moment(new Date()).format('MM-DD-YYYY')
            let filterToday = this.$lodash.filter(this.EndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('MM-DD-YYYY') === todaysDate
              })    
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.totalMoneyBox * 0.02)
            })
            let filterTodays = this.$lodash.filter(this.BetOptionsEndGames, b => {
                    return this.$moment(b.dateEnded.toDate()).format('MM-DD-YYYY') === todaysDate
              })    
            let totalCommss = this.$lodash.sumBy(filterTodays, f => { 
                return parseFloat(f.totalMoneyBox * 0.02)
            })
            let TotalComms = parseFloat(totalComms + totalCommss)
                return TotalComms
        },
        agentMACommissionMonthly(){
            let todaysDate = this.$moment(new Date()).format('MM-YYYY')
            let filterToday = this.$lodash.filter(this.EndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('MM-YYYY') === todaysDate
              })    
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.totalMoneyBox * 0.02)
            })
            let filterTodays = this.$lodash.filter(this.BetOptionsEndGames, b => {
                    return this.$moment(b.dateEnded.toDate()).format('MM-YYYY') === todaysDate
              })    
            let totalCommss = this.$lodash.sumBy(filterTodays, f => { 
                return parseFloat(f.totalMoneyBox * 0.02)
            })
            let TotalComms = parseFloat(totalComms + totalCommss)
                return TotalComms
        },
        // agentMACommissionMonthly(){
        //     let todaysDate = this.$moment(new Date()).format('MM-YYYY')
        //     let filterToday = this.$lodash.filter(this.CommissionHistory, p => {
        //             return this.$moment(p.timestamp.toDate()).format('MM-YYYY') === todaysDate
        //       })
        //     let totalComms = this.$lodash.sumBy(filterToday, a => { 
        //         return parseFloat(a.amount)
        //     })
        //         return totalComms
        // },
        agentMACommissionYearly(){
            let todaysDate = this.$moment(new Date()).format('YYYY')
            let filterToday = this.$lodash.filter(this.EndGames, p => {
                    return this.$moment(p.dateEnded.toDate()).format('YYYY') === todaysDate
              })    
            let totalComms = this.$lodash.sumBy(filterToday, a => { 
                return parseFloat(a.totalMoneyBox * 0.02)
            })
            let filterTodays = this.$lodash.filter(this.BetOptionsEndGames, b => {
                    return this.$moment(b.dateEnded.toDate()).format('YYYY') === todaysDate
              })    
            let totalCommss = this.$lodash.sumBy(filterTodays, f => { 
                return parseFloat(f.totalMoneyBox * 0.02)
            })
            let TotalComms = parseFloat(totalComms + totalCommss)
                return TotalComms
        },
        // agentMACommissionYearly(){
        //     let todaysDate = this.$moment(new Date()).format('YYYY')
        //     let filterToday = this.$lodash.filter(this.CommissionHistory, p => {
        //             return this.$moment(p.timestamp.toDate()).format('YYYY') === todaysDate
        //       })
        //     let totalComms = this.$lodash.sumBy(filterToday, a => { 
        //         return parseFloat(a.amount)
        //     })
        //         return totalComms
        // },
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
