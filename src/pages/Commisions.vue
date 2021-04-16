<template>
    <q-page>
        <div class="q-pa-md">
            <div class="q-pa-md row q-gutter-md">
                <strong>From:</strong><q-input v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
                <strong>To:</strong><q-input v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
                <q-btn class="col column" color="accent" label="Create MA Account" @click="$router.push('/maccount')"/>
            </div>
        </div>
        <div class="q-pa-md">
            <q-table title="Top Master Agent" :data="MasterAgent" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="gameName" :props="props"></q-td>
                        <q-td key="agentNo" :props="props"></q-td>
                        <q-td key="viewAgent" :props="props"></q-td>
                        <q-td key="totalComms" :props="props"></q-td>
                        <q-td key="sendCoins" :props="props"></q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </q-page>
</template>
<script>
export default {
    methods: {
        
    },
    data(){
        return{
            fromdate:  '',
            todate:  '',
            MasterAgent: [],
            filter: '',
            columns: [
                { name: 'gameName', align: 'center', required: true, label: 'MA Name', field: 'gameName', sortable: true },
                { name: 'agentNo', align: 'center', required: true, label: 'Number', field: 'agentNo', sortable: true },
                { name: 'viewAgent', align: 'center', label: 'View Agent', field: 'viewAgent', sortable: true },
                { name: 'totalComms', align: 'center', label: 'Total Comms.', field: 'totalComms', sortable: true },
                { name: 'sendCoins', align: 'center', label: 'Send Coins.', field: 'sendCoins', sortable: true },
            ]
        }
    },
    computed: {
        
    },
    mounted() {

    }
}
</script>

// async creditWallet () {
//             // payload structure
//             // downlineID, to(account), credits 
//             this.$q.dialog({
//                 title: 'Send Credits',
//                 message: 'Send This Credit?',
//                 ok: 'Yes',
//             })
//             .onOk(async ()=>{
//                     await addCredits()
//                     .then(async ()=>{
//                         await recordHistory()
//                         .then(async ()=>{
//                             await updateLastTransaction()
//                             Dialog.create({
//                                 title: `Sending Credits Successful !`,
//                                 message: `${this.amount} CREDITS `,
//                                 type: 'info',
//                                 color: 'primary',
//                                 textColor: 'white',
//                                 icon: 'info',
//                                 ok: 'close',
//                                 dark: true,
//                             })
//                         })
//                     })
//                 })
//         },
//         async addCredits(task){
//             try {
//                 const increment = firebase.firestore.FieldValue.increment(this.amount);
//                 const response = await firebaseDb.collection('Wallet').doc(task['.key']).update({ creditsAmount: increment });
//                 if(response) { console.log('%c SUCCESS_CREDITS_ADD','background: #222; color: #bada55') }
//             } catch (error) {
//                 console.log(error,'error')
//                 console.log('%c ERROR_CREDITS_ADD','background: #D50000; color: #fff')
//             }   
//         },
//         async recordHistory(task){
//             console.log(task, 'receivers')
//             try {
//                 let reciever = {...task}
//                 let recieverID = reciever['.key']
//                 delete reciever['.key']
//                 reciever.accountID = recieverID

//                 let user = this.$store.getters['useraccount/isAuthenticated']
//                 console.log(user,'user')
//                 let sender = {...user}
//                 let senderID = sender.userDBKey
//                 delete sender['.key']
//                 sender.accountID = senderID
//                 console.log(reciever, 'ID')
//                 const response = await firebaseDb.collection('CreditHistory').add({to:reciever,from:sender,amount:this.amount,timestamp: new Date()})
//                 if(response) { console.log('%c SUCCESS_CREDITS_HISTORY','background: #222; color: #bada55') }
//             } catch (error) {
//                 console.log(error,'error')
//                 console.log('%c ERROR_CREDITS_HISTORY','background: #D50000; color: #fff')
//             }      
//         },
//         async updateLastTransaction(){
//             try {
//                 const response = await firebaseDb.collection('MasterAgents').doc(this.coinsID).update({ lastTransaction: new Date() })
//                 if(response) { console.log('%c SUCCESS_LAST_TRANSACTION','background: #222; color: #bada55') }
//             } catch (error) {
//                 console.log(error,'error')
//                 console.log('%c ERROR_LAST_TRANSACTION','background: #D50000; color: #fff')
//             }      
//         },