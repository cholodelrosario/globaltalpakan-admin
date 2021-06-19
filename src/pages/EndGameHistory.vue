<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <b v-show="false">{{totalCompanyComms}}</b>
            <b v-show="false">{{totalExtraComms}}</b>
            <b v-show="false">{{totalSalesComms}}</b>
            <div class="q-pa-md row q-gutter-md">
                <q-input class="col" readonly dark outlined v-model="company" type="number" label="Company Comms. Less Agent Comms." />
                <q-input class="col" readonly dark outlined v-model="extra" type="number" label="Extra Add. Comms." />
                <q-input class="col" readonly dark outlined v-model="total" type="number" label="Total Sales of Company for Games" />
                <q-select class="col column" @input="myEndGame()" clearable emit-value map-options dark v-model="type" :options="option" label="Select Date" outlined/>
            </div>
        </div>
        <div class="row q-pa-md q-gutter-sm">
            <q-input style="width: 430px" borderless dense outlined placeholder="Enter 'All' to search ALL Games" color="primary" debounce="300" v-model="filter" dark>
                <template v-slot:append>
                    <q-icon name="search" />
                </template>
            </q-input>
            <q-btn label="Search by Games" class="text-black" borderless @click="searchAll()" dense outlined color="primary"/>
        </div>
        <div class="q-pa-md">
            <q-table title="End Game History" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="EndGamesThanos" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="gameNumber" :props="props">{{props.row.gameNumber}}</q-td>
                        <q-td key="gameCategory" :props="props">{{props.row.gameCategory}}</q-td>
                        <q-td key="teams" :props="props">{{props.row.teams}}</q-td>
                        <q-td key="totalMoneyBox" :props="props">{{props.row.totalMoneyBox}}</q-td>
                        <q-td key="endingOddBets" :props="props">{{props.row.endingOddBets.totalBets * props.row.endingOddBets.odds}}</q-td>
                        <q-td key="companyCommission" :props="props">{{props.row.companyCommission}}</q-td>
                        <q-td key="compCommsLessAgentComms" :props="props">{{props.row.companyCommission - props.row.companyCommsLessAgent}}</q-td>
                        <q-td key="extraAddComms" :props="props">{{props.row.totalMoneyBox - ((props.row.endingOddBets.totalBets * props.row.endingOddBets.odds) + props.row.companyCommission) }}</q-td>
                        <q-td key="dateEnded" :props="props">{{props.row.dateEnded}}</q-td>
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
            EndGamesThanos: [],
            type: '',
            option: [
                {label: 'Daily', value: 'MM-DD-YYYY'},
                {label: 'Monthly', value: 'MM-YYYY'}, 
                {label: 'Yearly', value: 'YYYY'},
            ],
            EndGames: [],
            company: 0,
            extra: 0,
            total: 0,
            filter: '',
            pagination: { page: 1, rowsPerPage: 20},
            columns: [
                { name: 'gameNumber', align: 'left', required: true, label: 'G-No.', field: 'gameNumber', sortable: true },
                { name: 'gameCategory', align: 'left', required: true, label: 'Games', field: 'gameCategory', sortable: true },
                { name: 'teams', align: 'left', required: true, label: 'Teams', field: 'teams', sortable: true },
                { name: 'totalMoneyBox', align: 'center', label: 'Total Bets', field: 'totalMoneyBox', sortable: true },
                { name: 'endingOddBets', align: 'center', label: 'Total Winnings(Players)', field: 'endingOddBets', sortable: true },    
                { name: 'companyCommission', align: 'center', required: true, label: 'Company Comms', field: 'companyCommission', sortable: true },
                { name: 'compCommsLessAgentComms', align: 'center', required: true, label: 'Comp. Comms. Less Agent Comms', field: 'compCommsLessAgentComms', sortable: true },
                { name: 'extraAddComms', align: 'center', required: true, label: 'Extra Add. Comms.', sortable: true },
                { name: 'dateEnded', align: 'center', label: 'Date Ended', field: 'dateEnded', sortable: true },
            ]
        }
    },
    methods: {
        async searchAll(){
            this.type = null
            if(this.filter === ''){
                this.$q.dialog({
                title: 'Please Enter Game Title!',
                message: 'Fill Search Bar?',
                ok: 'Ok',
                cancel: 'Cancel',
                dark: true
                })
                this.EndGamesThanos = []
            }else{
                if(this.filter === 'All' || this.filter === 'ALL'){
                    await this.endGameDetails()
                    .then(() => {
                        let map = this.$lodash.map(this.EndGames,a=>{
                        return {
                                ['.key']: a['.key'],
                                scheduleKey: a.scheduleKey,
                                gameNumber: a.gameNumber,
                                gameCategory: a.gameCategory,
                                endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                                companyCommission: a.companyCommission,
                                dateCreated: a.dateCreated,
                                dateEnded: this.$moment(a.dateEnded.toDate()).format('MM-DD-YYYY hh:mm A'),
                                betOptions: a.betOptions,
                                totalMoneyBox: a.totalMoneyBox,
                                teams: a.teamRed.team + ' vs ' + a.teamBlue.team,
                                companyCommsLessAgent: a.totalMoneyBox * 0.02
                            }
                        })
                        console.log(map, 'AgentsAccount')
                        let orderByP = this.$lodash.orderBy(map, ['creditsAmount'], ['desc']);
                        this.EndGamesThanos = orderByP
                    }).catch(err => {
                        console.error(err)
                    })
                }else{
                    await this.endGameDetails()
                    .then(() => {
                        // let filterSearch = this.$lodash.filter(this.EndGames, p => {
                        //         return p.gameCategory === this.filter
                        // })
                        let map = this.$lodash.map(this.EndGames,a=>{
                            return {
                                ['.key']: a['.key'],
                                scheduleKey: a.scheduleKey,
                                gameNumber: a.gameNumber,
                                gameCategory: a.gameCategory,
                                endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                                companyCommission: a.companyCommission,
                                dateCreated: a.dateCreated,
                                dateEnded: this.$moment(a.dateEnded.toDate()).format('MM-DD-YYYY hh:mm A'),
                                betOptions: a.betOptions,
                                totalMoneyBox: a.totalMoneyBox,
                                teams: a.teamRed.team + ' vs ' + a.teamBlue.team,
                                companyCommsLessAgent: a.totalMoneyBox * 0.02
                            }
                        })
                        let orderByP = this.$lodash.orderBy(map, ['dateEnded'], ['desc']);
                        this.EndGamesThanos = orderByP
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }
        },
        async myEndGame(){
            this.filter = ''
            if(this.type === null){
                this.EndGamesThanos = []
            }else{
                await this.endGameDetails()
                .then(() => {
                    let dateMMDDYYYY = this.$lodash.filter(this.EndGames, b => {
                        return this.$moment(b.dateEnded.toDate()).format('DD') === this.$moment(new Date()).format(this.type) || this.$moment(b.dateEnded.toDate()).format('MM') === this.$moment(new Date()).format(this.type) || this.$moment(b.dateEnded.toDate()).format('YYYY') === this.$moment(new Date()).format(this.type)
                    })
                    let orderByP = this.$lodash.orderBy(dateMMDDYYYY, ['dateEnded'], ['desc']);
                    let map = this.$lodash.map(orderByP,a=>{
                        return {
                                ['.key']: a['.key'],
                                scheduleKey: a.scheduleKey,
                                gameNumber: a.gameNumber,
                                gameCategory: a.gameCategory,
                                endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                                companyCommission: a.companyCommission,
                                dateCreated: a.dateCreated,
                                dateEnded: this.$moment(a.dateEnded.toDate()).format('MM-DD-YYYY hh:mm A'),
                                betOptions: a.betOptions,
                                totalMoneyBox: a.totalMoneyBox,
                                teams: a.teamRed.team + ' vs ' + a.teamBlue.team,
                                companyCommsLessAgent: a.totalMoneyBox * 0.02
                            }
                    })
                    console.log(map, 'mappaaa')
                    this.EndGamesThanos = map
                }).catch(err => {
                    console.error(err)
                })
            }
        },
        async endGameDetails(){
            if(this.type !== null){
                await this.$binding("EndGames", this.$db.collection("EndGames"))
                .then((EndGames) => {
                }).catch(err => {
                    console.error(err)
                })
            }else if(this.filter !== ''){
                if(this.filter === 'All'){
                    await this.$binding("EndGames", this.$db.collection("EndGames"))
                    .then((EndGames) => {
                    }).catch(err => {
                        console.error(err)
                    })  
                }else{
                    await this.$binding("EndGames", this.$db.collection("EndGames").where("gameCategory","==",this.filter))
                    .then((EndGames) => {
                    }).catch(err => {
                        console.error(err)
                    })
                }
            }       
        },
    },
    computed: {
        totalCompanyComms(){
            let totalAgentComms = this.$lodash.sumBy(this.EndGamesThanos, a => { 
                return parseFloat(a.companyCommsLessAgent)
            })
            let companyComms = this.$lodash.sumBy(this.EndGamesThanos, a => { 
                return parseFloat(a.companyCommission)
            })
            let total = companyComms - totalAgentComms
            return this.company = total
        },
        totalExtraComms(){
            let totalExtraCommss = this.$lodash.sumBy(this.EndGamesThanos, a => { 
                return parseFloat(a.totalMoneyBox - ((a.endingOddBets.totalBets * a.endingOddBets.odds) + a.companyCommission))
            })
            return this.extra = totalExtraCommss
        },
        totalSalesComms(){
            let totalSales = parseFloat(this.totalCompanyComms) + parseFloat(this.totalExtraComms) 
            return this.total = totalSales
        },
    },
    mounted() {
    }
}
</script>