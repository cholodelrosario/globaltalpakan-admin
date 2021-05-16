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
                <q-select class="col column" clearable emit-value map-options dark v-model="type" :options="option" label="Select Date" outlined/>
            </div>
        </div>
        <div class="q-pa-md">
            <q-table title="End Bet Option History" :filter="filter" :pagination.sync="pagination" :rows-per-page-options="[0]" class="bg-secondary text-white" :data="EndGamesThanos" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="gameNumber" :props="props">{{props.row.gameNumber}}</q-td>
                        <q-td key="gameCategory" :props="props">{{props.row.gameCategory}}</q-td>
                        <q-td key="name" :props="props">{{props.row.betOptName}}</q-td>
                        <q-td key="teams" :props="props">{{props.row.teams}}</q-td>
                        <q-td key="totalMoneyBox" :props="props">{{props.row.totalMoneyBox}}</q-td>
                        <q-td key="endingOddBets" :props="props">{{props.row.endingOddBets.totalBets * props.row.endingOddBets.odds}}</q-td>
                        <q-td key="companyCommission" :props="props">{{props.row.companyCommission}}</q-td>
                        <q-td key="extraAddComms" :props="props">{{props.row.totalMoneyBox - ((props.row.endingOddBets.totalBets * props.row.endingOddBets.odds) + props.row.companyCommission) }}</q-td>
                        <q-td key="dateEnded" :props="props">{{props.row.dateEnded}}</q-td>
                        <!-- <q-td key="action" :props="props">
                            <q-btn label="Options" color="yellow" />
                        </q-td> -->
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
            EndGamesThanos: [],
            EndGames: [],
            type: '',
            option: [
                {label: 'Daily', value: 'DD'},
                {label: 'Monthly', value: 'MM'}, 
                {label: 'Yearly', value: 'YYYY'},
            ],
            BetOptionsEndGames: [],
            company: 0,
            extra: 0,
            total: 0,
            filter: '',
            pagination: { page: 1, rowsPerPage: 20},
            columns: [
                { name: 'gameNumber', align: 'left', required: true, label: 'G-No.', field: 'gameNumber', sortable: true },
                { name: 'gameCategory', align: 'left', required: true, label: 'Games', field: 'gameCategory', sortable: true },
                { name: 'name', align: 'left', required: true, label: 'Bet Options', field: 'name', sortable: true },
                { name: 'teams', align: 'left', required: true, label: 'Teams', field: 'teams', sortable: true },
                { name: 'totalMoneyBox', align: 'center', label: 'Total Bets', field: 'totalMoneyBox', sortable: true },
                { name: 'endingOddBets', align: 'center', label: 'Total Winnings(Players)', field: 'endingOddBets', sortable: true },    
                { name: 'companyCommission', align: 'center', required: true, label: 'Company Comms', field: 'companyCommission', sortable: true },
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
                if(this.filter === 'All'){
                    await this.endGameDetails()
                    await this.betOptEndGameDetails()
                    .then(() => {
                        let map = this.$lodash.map(this.BetOptionsEndGames,a=>{
                            let games = this.getGames(a.scheduleKey)
                            return {
                                    ['.key']: a['.key'],
                                    scheduleKey: a.scheduleKey,
                                    gameNumber: games.gameNumber,
                                    gameCategory: games.gameCategory,
                                    endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                                    companyCommission: a.companyCommission,
                                    dateCreated: a.dateCreated,
                                    dateEnded: this.$moment(a.dateEnded.toDate()).format('MM-DD-YYYY hh:mm A'),
                                    betOptions: a.betOptions,
                                    totalMoneyBox: a.totalMoneyBox,
                                    teams: a.teamRed.team + ' vs ' + a.teamBlue.team,
                                    companyCommsLessAgent: a.totalMoneyBox * 0.02,
                                    betOptName: a.name
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
                    await this.betOptEndGameDetails()
                    .then(() => {
                        let map = this.$lodash.map(this.BetOptionsEndGames,a=>{
                            let games = this.getGames(a.scheduleKey)
                            return {
                                    ['.key']: a['.key'],
                                    scheduleKey: a.scheduleKey,
                                    gameNumber: games.gameNumber,
                                    gameCategory: games.gameCategory,
                                    endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                                    companyCommission: a.companyCommission,
                                    dateCreated: a.dateCreated,
                                    dateEnded: this.$moment(a.dateEnded.toDate()).format('MM-DD-YYYY hh:mm A'),
                                    betOptions: a.betOptions,
                                    totalMoneyBox: a.totalMoneyBox,
                                    teams: a.teamRed.team + ' vs ' + a.teamBlue.team,
                                    companyCommsLessAgent: a.totalMoneyBox * 0.02,
                                    betOptName: a.name
                            }
                        })
                        let filterSearch = this.$lodash.filter(map, p => {
                                return p.gameCategory === this.filter
                        })
                        let orderByP = this.$lodash.orderBy(filterSearch, ['dateEnded'], ['desc']);
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
                await this.betOptEndGameDetails()
                .then(() => {
                    let dateMMDDYYYY = this.$lodash.filter(this.BetOptionsEndGames, b => {
                        return this.$moment(b.dateEnded.toDate()).format('DD') === this.$moment(new Date()).format(this.type) || this.$moment(b.dateEnded.toDate()).format('MM') === this.$moment(new Date()).format(this.type) || this.$moment(b.dateEnded.toDate()).format('YYYY') === this.$moment(new Date()).format(this.type)
                    })
                    let orderByP = this.$lodash.orderBy(dateMMDDYYYY, ['dateEnded'], ['desc']);
                    let map = this.$lodash.map(orderByP,a=>{
                        let games = this.getGames(a.scheduleKey)
                        return {
                                ['.key']: a['.key'],
                                scheduleKey: a.scheduleKey,
                                gameNumber: games.gameNumber,
                                gameCategory: games.gameCategory,
                                endingOddBets: a.winningTeam === 'Red' ? a.endingOddBets.teamRed : a.endingOddBets.teamBlue,
                                companyCommission: a.companyCommission,
                                dateCreated: a.dateCreated,
                                dateEnded: this.$moment(a.dateEnded.toDate()).format('MM-DD-YYYY hh:mm A'),
                                betOptions: a.betOptions,
                                totalMoneyBox: a.totalMoneyBox,
                                teams: a.teamRed.team + ' vs ' + a.teamBlue.team,
                                companyCommsLessAgent: a.totalMoneyBox * 0.02,
                                betOptName: a.name
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
            await this.$binding("EndGames", this.$db.collection("EndGames"))
            .then((EndGames) => {
            }).catch(err => {
                console.error(err)
            })             
        },
        async betOptEndGameDetails(){
            await this.$binding("BetOptionsEndGames", this.$db.collection("BetOptionsEndGames"))
            .then((BetOptionsEndGames) => {
            }).catch(err => {
                console.error(err)
            })             
        },
        getGames(key){
            var docRef = null
            var data = null
            docRef = this.EndGames.filter(a=>{
                return a['.key'] == key
            })[0]
            data = {...docRef}
            delete data['.key']
            return data

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