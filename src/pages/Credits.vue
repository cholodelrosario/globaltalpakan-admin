<template>
  <q-page class="bg-dark">
    <div>
        <div full-width>
        <q-tabs
            v-model="tab"
            inline-label
            flat
            class="bg-secondary text-white shadow-2 col-12"
        >
            <q-tab class="col-4" name="magents" label="Master Agents" icon="mdi-account-multiple" />
            
        </q-tabs>
            <div class="q-pa-md">
                <q-table class="bg-secondary text-white" title="Send Credits to Master Agents" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td v-if="tab == 'players' || tab == 'agents'" key="accountName" :props="props">{{props.row.accountName}}</q-td>
                            <q-td v-else key="accountFirstName" :props="props">{{props.row.accountFirstName + ' ' + props.row.accountLastName}}</q-td>
                            <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                            <q-td key="action" :props="props">
                                <q-btn icon="send" @click="openEditDialog(props.row)" color="yellow" />
                            </q-td>  
                        </q-tr>
                    </template>
                    <template v-slot:top-right>
                        <q-input borderless outlined dark dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>  
                </q-table>
            </div>
        </div>
    </div>
        <q-dialog v-model="sendCredits">
            <q-card class="bg-secondary text-white">
                <q-card-section>
                <div class="text-h6">Send Credits</div>
                </q-card-section>
                <q-separator />
                <q-card-section style="max-height: 50vh">   
                    <div padding="none" class="row q-gutter-md">
                        <div class="q-pt-md">
                            <b class="col text-h6">Amount:</b>
                            <q-input v-model="amount" dark dense  mask="#.##" fill-mask="0" reverse-fill-mask hint="Mask: #.##" input-class="text-right" type="number" outlined style="width: 200px" />
                        </div>
                        <div class="q-pt-md">
                            <b class="col text-h6">Recipient No.:</b>
                            <q-input v-model="number" dark dense type="number" outlined style="width: 200px" />
                        </div>
                    </div>
                    <div padding="none" class="row q-gutter-md flex flex-center">
                        <div padding="none" class="q-pt-md text-center">
                            <b class="col text-h6">Name: &nbsp;&nbsp;</b>
                            <b class="text-overline">{{this.name}}</b>
                        </div>
                    </div>
                </q-card-section>
                <q-separator />

                <q-card-actions align="right">
                <q-btn flat label="cancel" color="primary" v-close-popup />
                <q-btn flat label="Send" @click="sendCreditsToPlayer()" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
  </q-page>
</template>

<script>
import { firebase,firebaseAuth,firebaseDb } from 'src/boot/firebase'
import { Dialog } from 'quasar'
export default {
    data(){
        return {
            withdrawTab: 'mails',
            table: false,
            selectNumber: 0,
            name: '',
            number: 0,
            amount: 0,
            sendCredits: false,
            filter: '',
            MasterAgents: [],
            CreditHistory: [],
            Wallet: [],
            Players: [],
            Agents: [],
            columnsP: [
                { name: 'accountName', required: true, label: 'Full Name', align: 'left', field: 'accountName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'left', field: 'accountPhone', sortable: true },
                { name: 'action', align: 'right', label: 'Action' }
            ],
            columnsA: [
                { name: 'accountName', required: true, label: 'Full Name', align: 'left', field: 'accountName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'left', field: 'accountPhone', sortable: true },
                { name: 'action', align: 'right', label: 'Action' }
            ],
            columnsMA: [
                { name: 'accountFirstName', required: true, label: 'Full Name', align: 'left', field: 'accountFirstName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'left', field: 'accountPhone', sortable: true },
                { name: 'action', align: 'right', label: 'Action' }
            ],
            tab: 'magents',
            splitterModel: 20,
        }
    },
    mounted() {
        let user = this.$store.getters['useraccount/isAuthenticated']
        console.log(user,'user')
        this.$binding("accountObj", this.$db.collection("Accounts").doc(user.userDBKey))
        .then((account) => {
            console.log(account,'account') // => __ob__: Observer
        }).catch(err => {
            console.error(err)
        })
        this.$binding('MasterAgents', this.$db.collection('MasterAgents'))
            .then(MasterAgents => {
            console.log(MasterAgents, 'MasterAgents')
        })
        this.$binding('Agents', this.$db.collection('Agents'))
            .then(Agents => {
            console.log(Agents, 'Agents')
        })
        this.$binding('Players', this.$db.collection('Players'))
            .then(Players => {
            console.log(Players, 'Players')
        })
        this.$binding('CreditHistory', this.$db.collection('CreditHistory'))
            .then(CreditHistory => {
            console.log(CreditHistory, 'CreditHistory')
        })
        this.$binding('Wallet', this.$db.collection('Wallet'))
            .then(Wallet => {
            console.log(Wallet, 'Wallet')
        })
    },
    computed: {
        getUsers () {
			try {
                if(this.tab === 'players'){
                    return this.Players
                }else if(this.tab === 'agents'){
                    return this.Agents
                }else{
                    return this.MasterAgents
                }
			} catch {
				return []
			}
		},
        columns(){
            try {
                if(this.tab === 'players'){
                    return this.columnsP
                }else if(this.tab === 'agents'){
                    return this.columnsA
                }else{
                    return this.columnsMA
                }
			} catch {
				return []
			}
        },
        phoneOption(){
            let optionss = this.MasterAgents.map(MasterAgents => {
                return {
                    label: MasterAgents.accountPhone,
                    value: MasterAgents.accountPhone
                }
            })
            console.log(optionss, 'opt')
            return optionss
        }
    },
    methods:{
        sendCreditsToPlayer(){
            let recieverID = this.coinsID
            let credits = this.$lodash.filter(this.Wallet, m => {
                    return m['.key'] == recieverID
            })
            let currentCredits = credits[0].creditsAmount
            let total = parseFloat(currentCredits) + parseFloat(this.amount)
            console.log(credits, 'current')
            console.log(this.amount, 'amount')
            var addCreditsBago = {
                creditsAmount: total
            }
            if(this.amount === '' || this.amount === 0){
                this.$q.dialog({
                    title: 'Field Required!',
                    message: 'Fill all Requirements?',
                    ok: 'Ok',
                    cancel: 'Cancel'
                    })
                }else
                this.$q.dialog({
                    title: 'Update Games',
                    message: 'Update This Games?',
                    ok: 'Yes',
                    cancel: 'Cancel'
                }).onOk(() => { 
                this.$db.collection('Wallet').doc(recieverID).set(addCreditsBago)
                this.recordHistory()
                this.updateLastTransaction()
                this.$q.notify({
                        message: 'Credits Send! Your Transaction Has Been Recorded',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.amount = 0
                    this.sendCredits = false  
            })
        },
        recordHistory(){
                let receiveID = this.coinsID
                let receiverInfo = this.$lodash.filter(this.MasterAgents, m => {
                        return m['.key'] == receiveID
                })
                console.log(receiverInfo, 'receivers')
                let reciever = {...receiverInfo[0]}
                let recieverID = reciever['.key']
                delete reciever['.key']
                reciever.accountID = recieverID

                let user = this.$store.getters['useraccount/isAuthenticated']
                console.log(user,'user')
                let sender = {...user}
                let senderID = sender.userDBKey
                delete sender['.key']
                sender.accountID = senderID
                console.log(reciever, 'ID')
                var newHistory = {
                    amount: this.amount,
                    from: sender,
                    to: reciever,
                    timestamp: new Date(),
                }
                this.$db.collection('CreditHistory').add(newHistory)
        },
        async updateLastTransaction(){
            try {
                const response = await firebaseDb.collection('MasterAgents').doc(this.coinsID).update({ lastTransaction: new Date() })
                if(response) { console.log('%c SUCCESS_LAST_TRANSACTION','background: #222; color: #bada55') }
            } catch (error) {
                console.log(error,'error')
                console.log('%c ERROR_LAST_TRANSACTION','background: #D50000; color: #fff')
            }      
        },
        openEditDialog (task) {
            console.log(task, 'task')
            if(this.tab === 'players'){
                this.coinsID = task['.key']
                this.number = task.accountPhone
                this.name = task.accountName
                this.sendCredits = true
            }else if(this.tab === 'agents'){
                this.coinsID = task['.key']
                this.number = task.accountPhone
                this.name = task.accountName
                this.sendCredits = true
            }else{
                this.coinsID = task['.key']
                this.number = task.accountPhone
                this.name = task.accountFirstName + ' ' + task.accountLastName
                this.sendCredits = true
            }  
        },
    }
}
</script>
