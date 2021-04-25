<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <div class="q-pa-md row q-gutter-md">
                <strong>From:</strong><q-input dark v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
                <strong>To:</strong><q-input dark v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
                <q-btn class="col column" color="accent" label="Create MA Account" @click="$router.push('/maccount')"/>
            </div>
        </div>
        <div class="q-pa-md">
            <q-table title="Top Master Agent" class="bg-secondary text-white" :data="groupComms" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="maName" :props="props">{{props.row.to.accountFirstName}}</q-td>
                        <q-td key="agentNo" :props="props">{{props.row.to.accountPhone}}</q-td>
                        <!-- <q-td key="viewAgent" :props="props">{{props.row.to.accountFirstName}}</q-td> -->
                        <q-td key="totalComms" :props="props">{{props.row.amount}}</q-td>
                        <!-- <q-td key="sendCoins" :props="props">{{props.row.to.accountFirstName}}</q-td> -->
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
            masterAgentComms: [],
            CommissionHistory: [],
            fromdate:  '',
            todate:  '',
            MasterAgents: [],
            filter: '',
            columns: [
                { name: 'maName', align: 'center', required: true, label: 'MA Name', field: 'maName', sortable: true },
                { name: 'agentNo', align: 'center', required: true, label: 'Number', field: 'agentNo', sortable: true },
                // { name: 'viewAgent', align: 'center', label: 'View Agent', field: 'viewAgent', sortable: true },
                { name: 'totalComms', align: 'center', label: 'Total Comms.', field: 'totalComms', sortable: true },
                // { name: 'sendCoins', align: 'center', label: 'Send Coins.', field: 'sendCoins', sortable: true },
            ]
        }
    },
    methods: {
        
    },
    computed: {
        groupComms(){
            try{
                let group = this.$lodash.groupBy(this.CommissionHistory, 'accountID')
                    console.log(group, 'grupo')
                let mapKey = this.$lodash.map(group, function(value, key){
                    
                })
                return mapKey
            }catch(err){
                  console.log(err,'err')
                  return []
            }
        }
    },
    mounted() {
        this.$db.collection('TeamGameAccountBets').where('gameKey',"==",this.$route.params.schedule),
        this.$binding('MasterAgents', this.$db.collection('MasterAgents'))
            .then(MasterAgents => {
            console.log(MasterAgents, 'MasterAgents')
        })
        this.$binding('masterAgentComms', this.$db.collection('CommissionHistory').where('to.masteragentKey',"==",undefined))
            .then(masterAgentComms => {
            console.log(masterAgentComms, 'masterAgentComms')
        })
        this.$binding('CommissionHistory', this.$db.collection('CommissionHistory'))
            .then(CommissionHistory => {
            console.log(CommissionHistory, 'CommissionHistory')
        })
    }
}
</script>