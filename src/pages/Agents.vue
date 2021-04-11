a<template>
    <q-page>
        <div class="q-pa-md">
            <div class="q-pa-md row q-gutter-md">
                <strong>From:</strong><q-input v-model="fromdate" mask="YYYY/MM/DD" filled type="date"/>
                <strong>To:</strong><q-input v-model="todate" mask="YYYY/MM/DD" filled type="date"/>
                <q-select class="col column" v-model="type" :options="options" label="Select Master Agent" outlined/>
            </div>
        </div>
        <div class="q-pa-md">
            <q-table title="Top Agent" :data="MasterAgent" :columns="columns" row-key="name">
                <template v-slot:body="props">
                    <q-tr>
                        <q-td key="agentName" :props="props"></q-td>
                        <q-td key="agentNo" :props="props"></q-td>
                        <q-td key="maName" :props="props"></q-td>
                        <q-td key="totalComms" :props="props"></q-td>
                        <q-td key="actions" :props="props"></q-td>
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
            options: ['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'],
            fromdate:  '',
            type: '',
            todate:  '',
            MasterAgent: [],
            filter: '',
            columns: [
                { name: 'agentName', align: 'center', required: true, label: 'Agent Name', field: 'agentName', sortable: true },
                { name: 'agentNo', align: 'center', required: true, label: 'Number', field: 'agentNo', sortable: true },
                { name: 'maName', align: 'center', label: 'MA', field: 'maName', sortable: true },
                { name: 'totalComms', align: 'center', label: 'Total Comms.', field: 'totalComms', sortable: true },
                { name: 'actions', align: 'center', label: 'Actions.', field: 'actions', sortable: true },
            ]
        }
    },
    computed: {
        
    },
    mounted() {

    }
}
</script>
