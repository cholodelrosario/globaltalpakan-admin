<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <div class="q-pa-md row q-gutter-md">
                <strong>From:</strong><q-input dark v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
                <strong>To:</strong><q-input dark v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
                <q-card class="q-ma-md bg-secondary text-white" style="width: 300px; height: 50px">
                    <q-item>
                        <q-item-section>
                        <q-item-label><strong>Total Comms. Amount:</strong></q-item-label>
                        </q-item-section>
                        <q-item-section side>
                        <q-item-label><strong><b>php</b></strong></q-item-label>
                        </q-item-section>
                    </q-item>
                </q-card>
            </div>
        </div>
        <div class="q-pa-md">
            <q-table title="Sales Reports" class="bg-secondary text-white" :data="Commission" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="gameName" :props="props"></q-td>
                        <q-td key="teamName" :props="props"></q-td>
                        <q-td key="dateTime" :props="props"></q-td>
                        <q-td key="totalBet" :props="props"></q-td>
                        <q-td key="comms" :props="props"></q-td>
                        <q-td key="addComms" :props="props"></q-td>
                        <q-td key="totalComms" :props="props"></q-td>
                    </q-tr>
                </template>
            </q-table>
        </div>
    </q-page>
</template>
<script>
import { date } from 'quasar'
export default {
    methods: {
        
    },
    data(){
        return{
            fromdate:  '',
            todate:  '',
            Commission: [],
            filter: '',
            columns: [
                { name: 'gameName', align: 'center', required: true, label: 'Games Name', field: 'gameName', sortable: true },
                { name: 'teamName', align: 'center', required: true, label: 'Teams', field: 'teamName', sortable: true },
                { name: 'dateTime', align: 'center', required: true, label: 'Date & Time', field: 'dateTime', sortable: true },
                { name: 'totalBet', align: 'center', label: 'Total Bet', field: 'totalBet', sortable: true },
                { name: 'comms', align: 'center', label: '5.5% Comms.', field: 'comms', sortable: true },
                { name: 'addComms', align: 'center', label: 'Extra Add. Comms.', field: 'addComms', sortable: true },
                { name: 'totalComms', align: 'center', label: 'Total Comms.', field: 'totalComms', sortable: true },
            ]
        }
    },
    computed: {
        
    },
    mounted() {
      
    }
}
</script>
