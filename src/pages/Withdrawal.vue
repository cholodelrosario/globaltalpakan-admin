<template>
  <q-page class="bg-white">
    <div>
        <div full-width>

        <q-tabs v-model="tab" inline-label class="bg-yellow shadow-2 col-12" >
            <q-tab class="col-4" name="players" label="Players" icon="mdi-human-greeting" />
            <q-tab class="col-4" name="agents" label="Agents" icon="mdi-face-agent" />
            <q-tab class="col-4" name="magents" label="Master Agents" icon="mdi-account-multiple" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
            <!-- for players  -->
          <q-tab-panel name="players">
                <!-- for player tabs -->
                <q-tabs v-model="withdrawPlayerTab" inline-label class="bg-yellow shadow-2 col-12" >
                    <q-tab class="col-6" name="pending" label="Pending" icon="mdi-human-greeting" />
                    <q-tab class="col-6" name="completed" label="Completed" icon="mdi-face-agent" />
                </q-tabs>
                <!-- start tab for player withdrawal -->
                <q-tab-panels v-model="withdrawPlayerTab" animated>
                    <!-- Pending Withdrawal -->
                    <q-tab-panel name="pending">    
                        <q-table title="Players Withdrawal" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                                    <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                                    <q-td key="action" :props="props">
                                        <q-btn icon="send" label="Approve" dense @click="openEditDialog(props.row)" color="accent" />
                                        <q-btn icon="delete" class="q-ma-xs" label="Decline" dense @click="openEditDialog(props.row)" color="negative" />
                                    </q-td>  
                                </q-tr>
                            </template>
                            <template v-slot:top-right>
                                <q-input borderless outlined dense debounce="300" v-model="filter" placeholder="Search">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>  
                        </q-table>
                    </q-tab-panel>
                    <!-- End for Pending Withdrawal -->
                    <!-- Completed Withdrawal -->
                    <q-tab-panel name="completed">    
                        <q-table title="Players Withdrawal" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                                    <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                                    <q-td key="action" :props="props">
                                        <q-btn icon="send" label="Approve" dense @click="openEditDialog(props.row)" color="accent" />
                                        <q-btn icon="delete" class="q-ma-xs" label="Decline" dense @click="openEditDialog(props.row)" color="negative" />
                                    </q-td>  
                                </q-tr>
                            </template>
                            <template v-slot:top-right>
                                <q-input borderless outlined dense debounce="300" v-model="filter" placeholder="Search">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>  
                        </q-table>
                    </q-tab-panel>
                     <!-- end for completed withdrawal -->
                </q-tab-panels>   
                <!-- end tab for players withdrawal -->
          </q-tab-panel>

           <!-- end for players  -->
            <!-- for agent  -->

          <q-tab-panel name="agents">
                <!-- for Agents tabs -->
                <q-tabs v-model="withdrawAgentTab" inline-label class="bg-yellow shadow-2 col-12" >
                    <q-tab class="col-6" name="pending" label="Pending" icon="mdi-human-greeting" />
                    <q-tab class="col-6" name="completed" label="Completed" icon="mdi-face-agent" />
                </q-tabs>
                <!-- start tab for Agents withdrawal -->
                <q-tab-panels v-model="withdrawAgentTab" animated>
                    <!-- Pending Withdrawal -->
                    <q-tab-panel name="pending">    
                        <q-table title="Agents Withdrawal" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                                    <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                                    <q-td key="action" :props="props">
                                        <q-btn icon="send" label="Approve" dense @click="openEditDialog(props.row)" color="accent" />
                                        <q-btn icon="delete" class="q-ma-xs" label="Decline" dense @click="openEditDialog(props.row)" color="negative" />
                                    </q-td>  
                                </q-tr>
                            </template>
                            <template v-slot:top-right>
                                <q-input borderless outlined dense debounce="300" v-model="filter" placeholder="Search">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>  
                        </q-table>
                    </q-tab-panel>
                    <!-- End for Pending Withdrawal -->
                    <!-- Completed Withdrawal -->
                    <q-tab-panel name="completed">    
                        <q-table title="Players Withdrawal" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                                    <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                                    <q-td key="action" :props="props">
                                        <q-btn icon="send" label="Approve" dense @click="openEditDialog(props.row)" color="accent" />
                                        <q-btn icon="delete" class="q-ma-xs" label="Decline" dense @click="openEditDialog(props.row)" color="negative" />
                                    </q-td>  
                                </q-tr>
                            </template>
                            <template v-slot:top-right>
                                <q-input borderless outlined dense debounce="300" v-model="filter" placeholder="Search">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>  
                        </q-table>
                    </q-tab-panel>
                     <!-- end for completed withdrawal -->
                </q-tab-panels>   
                <!-- end tab for Agents withdrawal -->
          </q-tab-panel>

           <!-- end for agent  -->
           <!-- for MA -->

          <q-tab-panel name="magents">
                <!-- for Master Agent tabs -->
                <q-tabs v-model="withdrawMATab" inline-label class="bg-yellow shadow-2 col-12" >
                    <q-tab class="col-6" name="pending" label="Pending" icon="mdi-human-greeting" />
                    <q-tab class="col-6" name="completed" label="Completed" icon="mdi-face-agent" />
                </q-tabs>
                <!-- start tab for Master Agent withdrawal -->
                <q-tab-panels v-model="withdrawMATab" animated>
                    <!-- Pending Withdrawal -->
                    <q-tab-panel name="pending">    
                        <q-table title="Master Agents Withdrawal" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="accountFirstName" :props="props">{{props.row.accountFirstName}}&nbsp;{{props.row.accountLastName}}</q-td>
                                    <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                                    <q-td key="action" :props="props">
                                        <q-btn icon="send" label="Approve" dense @click="openEditDialog(props.row)" color="accent" />
                                        <q-btn icon="delete" class="q-ma-xs" label="Decline" dense @click="openEditDialog(props.row)" color="negative" />
                                    </q-td>  
                                </q-tr>
                            </template>
                            <template v-slot:top-right>
                                <q-input borderless outlined dense debounce="300" v-model="filter" placeholder="Search">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>  
                        </q-table>
                    </q-tab-panel>
                    <!-- End for Pending Withdrawal -->
                    <!-- Completed Withdrawal -->
                    <q-tab-panel name="completed">    
                        <q-table title="Master Agents Withdrawal" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="accountFirstName" :props="props">{{props.row.accountFirstName}}&nbsp;{{props.row.accountLastName}}</q-td>
                                    <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                                    <q-td key="action" :props="props">
                                        <q-btn icon="send" label="Approve" dense @click="openEditDialog(props.row)" color="accent" />
                                        <q-btn icon="delete" class="q-ma-xs" label="Decline" dense @click="openEditDialog(props.row)" color="negative" />
                                    </q-td>  
                                </q-tr>
                            </template>
                            <template v-slot:top-right>
                                <q-input borderless outlined dense debounce="300" v-model="filter" placeholder="Search">
                                    <template v-slot:append>
                                        <q-icon name="search" />
                                    </template>
                                </q-input>
                            </template>  
                        </q-table>
                    </q-tab-panel>
                     <!-- end for completed withdrawal -->
                </q-tab-panels>   
                <!-- end tab for Master Agent withdrawal -->
          </q-tab-panel>

            <!-- end for MA -->

        </q-tab-panels>
        </div>
    </div>
        <q-dialog v-model="sendCredits">
            <q-card>
                <q-card-section>
                <div class="text-h6">Send Credits</div>
                </q-card-section>
                <q-separator />
                <q-card-section style="max-height: 50vh">   
                    <div padding="none" class="row q-gutter-md">
                        <div class="q-pt-md">
                            <b class="col text-h6">Amount:</b>
                            <q-input v-model="amount" dense type="number" outlined style="width: 200px" />
                        </div>
                        <div class="q-pt-md">
                            <b class="col text-h6">Recipient No.:</b>
                            <q-input v-model="number" dense type="number" outlined style="width: 200px" />
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
                <q-btn flat label="Send" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
  </q-page>
</template>

<script>
export default {
    data(){
        return {
            withdrawMATab: 'pending',
            withdrawAgentTab: 'pending',
            withdrawTab: 'mails',
            table: false,
            selectNumber: 0,
            name: '',
            number: 0,
            amount: 0,
            sendCredits: false,
            filter: '',
            MasterAgents: [],
            Players: [],
            Agents: [],
            columnsP: [
                { name: 'accountName', required: true, label: 'Full Name', align: 'left', field: 'accountName', sortable: true },
                { name: 'accountPhone', required: true, label: 'Phone Number', align: 'right', field: 'accountPhone', sortable: true },
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
            tab: 'players',
            withdrawPlayerTab: 'pending',
        }
    },
    mounted() {
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
        openEditDialog (task) {
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
