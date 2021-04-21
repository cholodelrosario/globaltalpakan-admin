<template>
    <q-page class="bg-dark text-white">
        <q-card class="bg-secondary">
            <q-card-section class="text-center">
                <b>Current Live For : <b class="text-h6">{{LiveGames.gameCategory}}</b></b>
            </q-card-section>
            <div v-show="LiveGames.length == 0" class="q-pr-md q-pl-md q-pb-lg">
                <div align="center" class="flex flex-center row q-gutter-md">
                    <div class="col-5 bg-red text-overline column justify-between">
                        <q-item-label class="text-h6">NO LIVE DATA AVAILABLE</q-item-label>
                    </div>
                </div>    
            </div>
            <q-card-section class="text-center">
                <div class="text-h2" v-show="LiveGames.length !== 0">
                    <span class="text-blue text-weight-bold" v-if="LiveGames.teamBlue">{{LiveGames.teamBlue.team}}</span> 
                    VS 
                    <span class="text-red text-weight-bold" v-if="LiveGames.teamRed">{{LiveGames.teamRed.team}}</span>
                </div> 
                <q-chip :color="returnColorStatus(LiveGames.status)"  text-color="white" :label="LiveGames.status" />
                <!-- <div class="q-pa-sm row items-start q-gutter-md flex flex-center" v-show="LiveGames.length !== 0">
                    
                    <div class="col-6 q-pl-xl text-overline">Betting Status: <q-badge outline :color="LiveGames.bettingStatus == true ? 'green' : 'grey' " :label="LiveGames.status" /> <q-toggle @input="activate(l)" v-model="LiveGames.bettingStatus" color="green"/> </div>
                    <div class="col text-overline">Game Status: <q-badge outline :color="LiveGames.gameStatus == true ? 'green' : 'black' " :label="LiveGames.gameStatus == true ? 'On Going' : 'Cancelled' " /> </div>
                    <div v-show="LiveGames.gameStatus == false" class="text-overline">Go to Bet Management For Cancelled Games Refund</div>
                </div> -->
            </q-card-section>
        <div class="row">
            <q-card class="text-center text-white my-card col-6 bg-blue-10" flat >
                <q-card-section>
                    <div class="col ">
                        <div class="text-h3">₱ {{MoneyBox.length !== 0 ? MoneyBox.totalBlue : 0}}</div>
                        <div class="text-subtitle2">{{returnPayoutBlue.toFixed(2)}}</div>                
                    </div>
                </q-card-section>
            </q-card>
        <q-card class="text-center text-white my-card col-6 bg-red-10" flat >
            <q-card-section>
                <div class="col">
                    <div class="text-h3">₱ {{MoneyBox.length !== 0  ? MoneyBox.totalRed : 0}}</div>
                    <div class="text-subtitle2">{{returnPayoutRed.toFixed(2)}}</div>
                </div>
            </q-card-section>
        </q-card>
        </div>
            <!-- <q-separator  dark /> -->
            <q-card-actions align="center">
                <q-btn v-if="LiveGames.status !== 'CANCELLED' && LiveGames.status !== 'ENDGAME'" flat color="grey" label="Update Game Status" @click="confirm = true,selectedStatus = LiveGames.status"/>
                <q-btn v-else-if="LiveGames.status == 'CANCELLED'" flat color="warning" label="Compute Bet Returns" icon="cancel_presentation" @click="$router.push(`/bet-cancellation/${$route.params.code}/${$route.params.schedule}`)">
                    <q-badge color="white" floating transparent text-color="black"><q-icon size="xs" name="next_plan"/>
                    </q-badge>
                </q-btn>
                <q-btn v-else-if="LiveGames.status == 'ENDGAME'" flat color="info" label="Compute Winnings and Commissions" icon="paid" @click="$router.push(`/bet-computations/${$route.params.code}/${$route.params.schedule}`)">
                     <q-badge color="white" floating transparent text-color="black"><q-icon size="xs" name="next_plan"/></q-badge>
                </q-btn>
            </q-card-actions>
        </q-card>
        <!-- <div class="row">
            <q-card class="text-center text-white my-card col-6 bg-blue-10" flat >
                <q-card-section>
                    <div class="col ">
                        <div class="text-h3">₱ {{MoneyBox.length !== 0 ? MoneyBox.totalBlue : 0}}</div>
                        <div class="text-subtitle2">{{returnPayoutBlue.toFixed(2)}}</div>                
                    </div>
                </q-card-section>
            </q-card>
        <q-card class="text-center text-white my-card col-6 bg-red-10" flat >
            <q-card-section>
                <div class="col">
                    <div class="text-h3">₱ {{MoneyBox.length !== 0  ? MoneyBox.totalRed : 0}}</div>
                    <div class="text-subtitle2">{{returnPayoutRed.toFixed(2)}}</div>
                </div>
            </q-card-section>
        </q-card>
        </div> -->
        <div class="container q-pa-md q-mt-md">
            <q-table grid :data="returnMapControlMoneyBox" :columns="columns" :filter="filter" class="full-width align-center text-white " dark row-key="['.key']">
                <template v-slot:top-right>
                    <q-input dark bordered dense outlined debounce="300" v-model="filter" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
                </template>
                <template v-slot:item="props">
                    
                    <div class="q-pa-md col-md-6 col-sm-12 col-xs-12 grid-style-transition">

                        <q-card class="my-card bg-secondary text-white">

                            <q-card-section>
                                <div class="text-h6 ellipsis">
                                        {{props.row.name}}
                                </div>
                                <q-chip :color="returnColorStatus(props.row.status)"  text-color="white" :label="props.row.status" />
                            </q-card-section>

                            <q-card-section>
                                <div class="row">
                                    <q-card class="text-center text-white my-card col-6 bg-blue-10" flat >
                                        <q-card-section>
                                            <div class="col ">
                                                <div class="text-h5">₱ {{props.row.totalBlue}}</div>
                                                <div class="text-subtitle2">{{returnPayoutOption(props.row.totalBets,props.row.totalBlue).toFixed(2)}}</div>                
                                            </div>
                                        </q-card-section>
                                    </q-card>
                                <q-card class="text-center text-white my-card col-6 bg-red-10" flat >
                                    <q-card-section>
                                        <div class="col">
                                            <div class="text-h5">₱ {{props.row.totalRed}}</div>
                                            <div class="text-subtitle2">{{returnPayoutOption(props.row.totalBets,props.row.totalRed).toFixed(2)}}</div>
                                        </div>
                                    </q-card-section>
                                </q-card>
                                </div>                             
                            </q-card-section>
                                
                            <q-separator />
                            <q-card-actions vertical align="center">
                                 <q-btn v-if="props.row.status !== 'CANCELLED' && props.row.status !== 'ENDGAME'" flat color="grey" label="Update Bet Option Status" @click="openUpdateDialogOptions(props.row['.key'],props.row.status,props.row)"/>
                                <q-btn v-else-if="props.row.status == 'CANCELLED'" flat color="warning" label="Compute Bet Returns" icon="cancel_presentation">
                                    <q-badge color="white" floating transparent text-color="black"><q-icon size="xs" name="next_plan"/>
                                    </q-badge>
                                </q-btn>
                                <q-btn v-else-if="props.row.status == 'ENDGAME'" flat color="info" label="Compute Winnings and Commissions" icon="paid">
                                    <q-badge color="white" floating transparent text-color="black"><q-icon size="xs" name="next_plan"/></q-badge>
                                </q-btn>
                                <!-- <q-btn :icon="props.row.status == 'OPEN' ? 'close' : 'play_arrow'" flat color="grey" class="full-width" :label="props.row.status == 'OPEN' ? 'CLOSE BETTING':'OPEN BETTING'" @click="activateOptions(props.row)"/> -->
                            </q-card-actions>
                            <!-- <q-card-actions>
                                <q-btn flat round icon="edit" color="grey"/>
                                <q-btn flat round icon="delete" color="grey" @click="openDeleteDialog(props.row)"/>
                                <q-btn flat color="grey" size="sm" v-show="props.row.betOptions.length > 0" @click="viewBetOptionsDialog(props.row.betOptions)">
                                view bet options list ({{props.row.betOptions.length}})
                                </q-btn>
                            </q-card-actions> -->
                            </q-card>
                    </div>
                </template>
            </q-table>        
        </div>
        <q-dialog v-model="confirm" persistent>
            <q-card style="width:30em" class="bg-dark">
                <q-card-section class="text-h6 text-white">
                    Select Status Update <q-btn color="grey" round size="sm" flat class="float-right" icon="close" @click="confirm = false,selectedOptionsKey = null,selectedOptions = null" />
                </q-card-section>
                <q-tabs
                    v-model="tab"
                    class="text-white"
                    align="justify"
                    active-color="primary"
                >
                    <q-tab name="Close Betting" icon="credit_card_off" label="Close" v-if="selectedStatus == 'OPEN'"/>
                    <q-tab name="Open Betting" icon="credit_card" label="Open" v-else-if="selectedStatus == 'CLOSED'"/>
                    <q-tab name="Cancel Game" icon="cancel" label="Cancel" />
 
                    <q-tab name="End Game" icon="open_in_new" label="End" />
                </q-tabs>
                <q-tab-panels v-model="tab" animated class="bg-secondary text-white">

                    <q-tab-panel name="Close Betting" v-if="selectedStatus == 'OPEN'">
                        <div class="text-h6">CLOSE BETTING</div>
                        This will not affect the game the ongoing game status.
                        This will only CLOSE the betting process of the LIVE GAME.
                        You can re-OPEN this if you feel like you needed to.
                        Note: Please be cautious when re-OPENING cause it can affect the current odds of the game.
                    </q-tab-panel>
                    <q-tab-panel name="Open Betting" v-else-if="selectedStatus == 'CLOSED'">
                        <div class="text-h6">RE-OPEN BETTING</div>
                        This will not affect the game the ongoing game status.
                        This will only RE-OPEN the betting process of the LIVE GAME.
                        Please check current odds before proceeding. Thank You.
                    </q-tab-panel>
                    <q-tab-panel name="Cancel Game">
                        <div class="text-h6">CANCELLED {{selectedOptionsKey ? 'BETS' : 'GAME'}}</div>
                        Cancelled Game will return all bets of players.
                        You can't undo this update status if you proceed.
                    </q-tab-panel>

                    <q-tab-panel name="End Game">
                        <div class="text-h6">END GAME</div>
                        Ending the game will stop the live feed and betting all at once.
                        This will ask you to record the winner after clicking proceed. You can't undo this update status if you proceed.
                    </q-tab-panel>
                </q-tab-panels>

                <q-card-actions align="right">
                    <q-btn flat label="Cancel" color="grey" v-close-popup @click="selectedOptionsKey = null,selectedOptions = null" />
                    <q-btn flat :disable="tab == ''" :label="`Proceed to ${tab == 'Cancel Game' && selectedOptionsKey !== null ? 'Cancel Bets' : tab}`" color="primary" v-close-popup @click="confirmStatusUpdateMain()" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
export default {
    data(){
        return { 
            confirm: false,
            tab: '',
            columns: [],
            filter: '',
            selectedOptionsKey: null,
            selectedOptions: null,
            selectedStatus: '',
            TrendsHistory: []
        }
    },
    firestore(){
      return {
        LiveGames: this.$db.collection('LiveGames').doc(this.$route.params.code),
        MoneyBox: this.$db.collection('MoneyBox').doc(this.$route.params.schedule),
        BetOptionsLiveControl: this.$db.collection('BetOptionsLiveControl').where("scheduleKey","==",this.$route.params.schedule),
        BetOptionsMoneyBox: this.$db.collection('BetOptionsMoneyBox').where("scheduleKey","==",this.$route.params.schedule)
      }
    },
    computed:{
        returnBetsMinusCompanyCommission(){
        let total = this.MoneyBox !== null && this.MoneyBox.length !== 0  ? this.MoneyBox.totalRed + this.MoneyBox.totalBlue : 0
        if(total == 0) return 0
        let minus = total * 0.055
        let minusTotal = total - minus
        return minusTotal
        },
        returnCompanyCommission(){
            let total = this.MoneyBox !== null && this.MoneyBox.length !== 0  ? this.MoneyBox.totalRed + this.MoneyBox.totalBlue : 0
            if(total == 0) return 0
            let minus = total * 0.055
            return minus
        },
        returnTotalMoneyBox(){
            let total = this.MoneyBox !== null && this.MoneyBox.length !== 0  ? this.MoneyBox.totalRed + this.MoneyBox.totalBlue : 0
            if(total == 0) return 0
            return total
        },
        returnPayoutBlue(){
            let total = this.MoneyBox.length !== 0  ? this.MoneyBox.totalBlue : 0
            if(total == 0) return 0
            let companyCommision = this.returnBetsMinusCompanyCommission
            return companyCommision / total
        },
        returnPayoutRed(){
            let total = this.MoneyBox.length !== 0 ? this.MoneyBox.totalRed : 0
            if(total == 0) return 0
            let companyCommision = this.returnBetsMinusCompanyCommission
            return companyCommision / total
        },
        returnMapControlMoneyBox(){
            let map = []
            this.BetOptionsLiveControl.forEach(element => {
                let row = this.BetOptionsMoneyBox.filter(a=>{
                    return a['.key'] == element['.key']
                })[0]

                map.push({...row,...element})
            });
            return map.map(a=>{
                return {
                    ...a,
                    totalBets: parseFloat(a.totalRed) + parseFloat(a.totalBlue)
                }
            })
        }
    },
    methods:{
        returnCompanyCommissionOptions(red = 0,blue = 0){
            let total = red + blue
            if(total == 0) return 0
            let minus = total * 0.055
            return minus
        },
        returnPayoutOption(total,bet){
            if(total == 0) return 0
            let companyCommision = this.returnOptionMinusCompanyComission(total)
            return companyCommision / bet            
        },
        returnOptionMinusCompanyComission(total){
            if(total == 0) return 0
            let minus = total * 0.055
            let minusTotal = total - minus
            return minusTotal            
        },
        activate(data) {
            this.$q.dialog({
                title: data.bettingStatus == false ? `Close Betting ??` : `Open Betting ??`,
                type: 'accent',
                color: 'accent',
                textColor: 'white',
                persistent: true,
                icon: 'warning',
                ok: 'Ok'
            }).onOk(()=> {
            var status = data.bettingStatus
            data.status = data.bettingStatus == true ? 'OPEN' : 'CLOSE'
			console.log(data, 'data')
			let key = data['.key']
            let update = {...data}
            delete update['.key']
            this.$db.collection(`LiveGames`).doc(key).set(update)
				.then(() => {
			this.$q.notify({
            message: status ? `${'Betting'} has been OPEN`: `${'Betting'} has been CLOSE`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
				})
				.catch((err) => {
					this.$q.notify({
                    message: `An error occured`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
                })
					console.log(err)
                })
            })
		},
        activateOptions(options) {
            this.$q.dialog({
                title: options.status == 'OPEN' ? `Close Betting for ${options.name}??` : `Open Betting for ${options.name}??`,
                type: 'accent',
                color: 'accent',
                textColor: 'white',
                icon: 'warning',
                ok: 'Ok',
                cancel: true
            }).onOk(()=> {
            var status = options.bettingStatus
            options.status = options.status == 'CLOSE' ? 'OPEN' : 'CLOSE'
			console.log(options, 'options')
			let key = options['.key']
            this.$db.collection(`BetOptionsLiveControl`).doc(key).update({status: options.status})
				.then(() => {
			this.$q.notify({
            message: status ? `${'Betting'} has been OPEN`: `${'Betting'} has been CLOSE`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
          })
				})
				.catch((err) => {
					this.$q.notify({
                    message: `An error occured`,
                    type: 'negative',
                    color: 'negative',
                    textColor: 'white',
                    icon: 'warning'
                })
					console.log(err)
                })
            })
		},
        confirmStatusUpdateMain(){
            let optionskey = this.selectedOptionsKey
            let tab = this.tab
            this.$q.dialog({
                title: `Confirm ${tab == 'Cancel Game' && optionskey !== null ? 'Cancel Bets' : tab}`,
                message: tab == 'End Game' || tab == 'Cancel Game' ? 'This action cannot be undone.' : '',
                type: 'primary',
                color: 'primary',
                dark: true,
                textColor: 'white',
                icon: 'warning',
                ok: 'YES, I CONFIRM',
                cancel: {
                    color: 'grey',
                    flat: true
                }
            }).onOk(async ()=> {    
                let status = null; 
                let self = this     
                
                if(optionskey){
                    if(tab == 'Close Betting'){
                        status = 'CLOSED'
                    } else if (tab == 'Open Betting') {
                        status = 'OPEN'
                    } else if (tab == 'Cancel Game') {
                        status = 'CANCELLED'
                        await this.$db.collection(`BetOptionsLiveControl`).doc(optionskey).update({status: status})
                        await self.cancelGameOptionsRecords()
                        return
                    } else if (tab == 'End Game') { 
                        status = 'ENDGAME' 
                        await this.$db.collection(`BetOptionsLiveControl`).doc(optionskey).update({status: status})
                        await self.endGameOptionsRecords()
                        return
                    }
                    await this.$db.collection(`BetOptionsLiveControl`).doc(optionskey).update({status: status})
                    return
                }               


                if(tab == 'Close Betting'){
                    status = 'CLOSED'
                } else if (tab == 'Open Betting') {
                    status = 'OPEN'
                } else if (tab == 'Cancel Game') {
                    status = 'CANCELLED'
                    await this.$db.collection(`LiveGames`).doc(this.$route.params.code).update({status: status})
                    await self.cancelGameRecords()
                    return
                } else if (tab == 'End Game') { 
                    status = 'ENDGAME'
                    await this.$db.collection(`LiveGames`).doc(this.$route.params.code).update({status: status})
                    await self.endGameRecords()
                    return
                }

                await this.$db.collection(`LiveGames`).doc(this.$route.params.code).update({status: status})
            })
        },
        returnColorStatus(status){
            if(status == 'CLOSED'){
                return 'grey'
            } else if (status == 'CANCELLED') {
                return 'red'
            } else if (status == 'ENDGAME') { 
                return 'black'
            } else {
                return 'green'
            }          
        },
        openUpdateDialogOptions(key,status,options){
            this.selectedOptionsKey = key
            this.selectedOptions = options
            this.confirm = true
            this.selectedStatus = status
            console.log(options,'optionsdata')
        },
        async endGameOptionsRecords(){
            let options = {...this.selectedOptions}
            let red = options.teamRed.team
            let blue = options.teamBlue.team
            let oddsRed = this.returnPayoutOption(options.totalBets,options.totalRed)
            let oddsBlue = this.returnPayoutOption(options.totalBets,options.totalRed)
            options.endingOddBets = {
                teamRed: {
                    odds: oddsRed,
                    totalBets: options.totalRed,
                },
                teamBlue: {
                    odds: oddsBlue,
                    totalBets: options.totalBlue,
                }
            }
            options.companyCommission = this.returnCompanyCommissionOptions(options.totalRed,options.totalBlue),
            options.totalMoneyBox = options.returnTotalMoneyBox    
            this.$q.dialog({
                title: `Record the Winning Team`,
                message: 'Please be sure before you proceed. You cannot undo this action later. Please note that the draw value is only applicable to some of the games.',
                type: 'primary',
                color: 'primary',
                dark: true,
                textColor: 'white',
                options: {
                type: 'radio',
                model: '',
                // inline: true
                items: [
                    { label: red+' - RED TEAM', value: 'RED', color: 'red', textColor: 'red' },
                    { label: blue+' - BLUE TEAM', value: 'BLUE', color: 'blue', textColor: 'blue' },
                    { label: 'DRAW', value: 'DRAW', color: 'yellow', textColor: 'yellow' }
                ]
                },
                icon: 'warning',
                ok: 'PROCEED TO RECORD WINNING TEAM',
                persistent: true,
            }).onOk(async (DATA)=> {     
                options.winningTeam = DATA
                options.dateEnded = new Date()
                await this.saveOptionsEndedGame(options)
                this.$q.dialog({
                    title: `GAME BETOPTIONS ENDED SUCCESS`,
                    message: 'You can now compute for the winnings and commissions of players and agents.',
                    color: 'grey',
                    textColor: 'white',
                    persistent: true,
                    icon: 'warning',
                    dark: true,
                    ok: 'Ok'
                })  
            })

        },
        async cancelGameOptionsRecords(){
            let options = {...this.selectedOptions}
            let red = options.teamRed.team
            let blue = options.teamBlue.team
            let oddsRed = this.returnPayoutOption(options.totalBets,options.totalRed)
            let oddsBlue = this.returnPayoutOption(options.totalBets,options.totalRed)
            options.endingOddBets = {
                teamRed: {
                    odds: oddsRed,
                    totalBets: options.totalRed,
                },
                teamBlue: {
                    odds: oddsBlue,
                    totalBets: options.totalBlue,
                }
            }
            options.companyCommission = this.returnCompanyCommissionOptions(options.totalRed,options.totalBlue),
            options.totalMoneyBox = options.returnTotalMoneyBox    
            options.dateEnded = new Date()
            await this.saveOptionsCancelledGame(options)
            this.$q.dialog({
                title: `GAME BETOPTIONS CANCELLED SUCCESS`,
                message: 'You can now compute for the refund bets of players for the betOPTIONS. Please also update status for the OTHER bet options. Thank you.',
                color: 'grey',
                textColor: 'white',
                persistent: true,
                icon: 'warning',
                dark: true,
                ok: 'Ok'
            }) 
        },
        async cancelGameRecords(){
            console.log('CODE GO HERE - CANCEL')
            let live = {...this.LiveGames}
            live.endingOddBets = {
                teamRed: {
                    odds: this.returnPayoutRed.toFixed(2),
                    totalBets: this.MoneyBox.totalRed,
                },
                teamBlue: {
                    odds: this.returnPayoutBlue.toFixed(2),
                    totalBets: this.MoneyBox.totalBlue,
                }
            }
            live.companyCommission = this.returnCompanyCommission,
            live.totalMoneyBox = this.returnTotalMoneyBox    
            live.dateEnded = new Date()
            delete live['.key']
            console.log(live,'live')
            await this.updateTrends('CANCELLED',live.gameKey,live.scheduleKey)
            .then(async ()=>{
                await this.saveCancelledGame(live)   
                this.$q.dialog({
                    title: `GAME CANCELLED SUCCESS`,
                    message: 'You can now compute for the refund bets of players for the main bet. Please also update status for the bet options. Thank you.',
                    color: 'grey',
                    textColor: 'white',
                    persistent: true,
                    icon: 'warning',
                    dark: true,
                    ok: 'Ok'
                })  
            })   
        },
        endGameRecords(){
            console.log('CODE GO HERE')
            let live = {...this.LiveGames}
            let red = live.teamRed.team
            let blue = live.teamBlue.team
            live.endingOddBets = {
                teamRed: {
                    odds: this.returnPayoutRed.toFixed(2),
                    totalBets: this.MoneyBox.totalRed,
                },
                teamBlue: {
                    odds: this.returnPayoutBlue.toFixed(2),
                    totalBets: this.MoneyBox.totalBlue,
                }
            }
            live.companyCommission = this.returnCompanyCommission,
            live.totalMoneyBox = this.returnTotalMoneyBox
            
            this.$q.dialog({
                title: `Record the Winning Team`,
                message: 'Please be sure before you proceed. You cannot undo this action later. Please note that the draw value is only applicable to some of the games.',
                type: 'primary',
                color: 'primary',
                dark: true,
                textColor: 'white',
                options: {
                type: 'radio',
                model: '',
                // inline: true
                items: [
                    { label: red+' - RED TEAM', value: 'RED', color: 'red', textColor: 'red' },
                    { label: blue+' - BLUE TEAM', value: 'BLUE', color: 'blue', textColor: 'blue' },
                    { label: 'DRAW', value: 'DRAW', color: 'yellow', textColor: 'yellow' }
                ]
                },
                icon: 'warning',
                ok: 'PROCEED TO RECORD WINNING TEAM',
                persistent: true,
            }).onOk(async (DATA)=> {     
                live.winningTeam = DATA
                live.dateEnded = new Date()
                delete live['.key']
                console.log(live,'live')
                await this.updateTrends(DATA,live.gameKey,live.scheduleKey)
                .then(async ()=>{
                    await this.saveEndedGame(live)
                    .then(async ()=>{
                        await this.endAllBetOptions()
                        this.$q.dialog({
                            title: `GAME ENDED SUCCESS`,
                            message: 'You can now compute for the winnings and commissions of players and agents.',
                            color: 'grey',
                            textColor: 'white',
                            persistent: true,
                            icon: 'warning',
                            dark: true,
                            ok: 'Ok'
                        })
                    }).catch(err=>{
                    console.log(err,'endAllBetOptions')
                }   )
                }).catch(err=>{
                    console.log(err,'endGameRecords')
                })
            })          
        },
        async updateTrends(teamColorStatus,gameCategoryKey,scheduleKey){
            let self = this
            let document = await this.$db.collection(`TrendsHistory`).doc(gameCategoryKey).get();
            if (document && document.exists) {
                await self.getTrendsHistory(gameCategoryKey);

                let trends = [...self.TrendsHistory.trends]
                console.log(trends,'before update')
                let lastTrend = trends[trends.length-1]
                let team = lastTrend.split('_')
                if(team[1] == teamColorStatus){
                    let add = parseInt(team[0]) + 1
                    trends[trends.length-1] = `${add}_${teamColorStatus}_${scheduleKey}`
                    console.log(trends,'after add')
                } else {
                    let push = `1_${teamColorStatus}_${scheduleKey}`
                    trends.push(push)
                    console.log(trends,'after push')
                }

                await document.ref.set({
                    trends: trends
                });     
                 console.log('%c SUCCESS_UPDATE_TRENDS_HISTORY','background: #222; color: #bada55')           

            } else {    
                await document.ref.set({
                    trends: [
                        `1_${teamColorStatus}_${scheduleKey}`
                    ]
                });
                console.log('%c SUCCESS_CREATE_TRENDS_HISTORY','background: #222; color: #bada55')                
            }        

        },
        async getTrendsHistory(gameCategoryKey){
            await this.$binding("TrendsHistory", this.$db.collection("TrendsHistory").doc(gameCategoryKey))
            .then((trends) => {
                console.log(trends,'trends') // => __ob__: Observer
            }).catch(err => {
                console.error(err)
            }) 
        },
        async saveEndedGame(live){
            await this.$db.collection(`EndGames`).doc(live.scheduleKey).set(live)
            .then(()=>{
                console.log('%c SUCCESS_SAVED_ENDGAME','background: #222; color: #bada55') 
            }).catch(err=>{
                console.log(err,'err')
            })
        },
        async saveCancelledGame(live){
            await this.$db.collection(`CancelledGames`).doc(live.scheduleKey).set(live)
            .then(()=>{
                console.log('%c SUCCESS_SAVED_CANCELLEDGAME','background: #222; color: #bada55') 
            }).catch(err=>{
                console.log(err,'err')
            })
        },
        async saveOptionsEndedGame(options){
            let bet = {...options}
            bet.status = 'ENDGAME'
            delete bet['.key']
            await this.$db.collection(`BetOptionsEndGames`).doc(options['.key']).set(bet)
            .then(()=>{
                console.log('%c SUCCESS_SAVED_ENDGAME_OPTIONS','background: #222; color: #bada55') 
            }).catch(err=>{
                console.log(err,'err')
            })
        },
        async saveOptionsCancelledGame(options){
            let bet = {...options}
            bet.status = 'ENDGAME'
            delete bet['.key']
            await this.$db.collection(`BetOptionsCancelledGames`).doc(options['.key']).set(bet)
            .then(()=>{
                console.log('%c SUCCESS_SAVED_CANCELLEDGAME_OPTIONS','background: #222; color: #bada55') 
            }).catch(err=>{
                console.log(err,'err')
            })
        },
        async endAllBetOptions(){
            let betOptionsControl = this.BetOptionsLiveControl
            betOptionsControl.forEach(async a=>{
                if(a.status !== 'CANCELLED'){
                    await this.$db.collection(`BetOptionsLiveControl`).doc(a['.key']).update({status: 'ENDGAME'})
                    .then(async()=>{
                        console.log('%c SUCCESS_UPDATED_BETOPTIONS_TO_ENDGAME','background: #222; color: #bada55')
                        let options = {...a}
                        options.status = 'ENDGAME'
                        delete options['.key']
                        await this.$db.collection(`BetOptionsEndGames`).doc(a['.key']).set(options)
                        console.log('%c SUCCESS_BETOPTIONS_ENDGAME_SAVING','background: #222; color: #bada55')
                    }).catch(err=>{
                        console.log(err,'BetOptionsLiveControl Update Error - End Game')
                    })
                }
            })
        }  
    }
}
</script>