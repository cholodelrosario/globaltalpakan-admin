<template>
    <q-page>
        <div class="q-pa-md">
            <div class="q-pa-md row q-gutter-md">
                <strong>From:</strong><q-input v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
                <strong>To:</strong><q-input v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
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
