<template>
  <q-page class="bg-white">
    <div>
        <div full-width>
        <q-tabs
            v-model="tab"
            inline-label
            class="bg-yellow shadow-2 col-12"
        >
            <q-tab class="col-3" name="players" label="Players" icon="mdi-human-greeting" />
            <q-tab class="col-3" name="agents" label="Agents" icon="mdi-face-agent" />
            <q-tab class="col-3" name="magents" label="Master Agents" icon="mdi-account-multiple" />
            <q-tab class="col-3" name="withdraw" label="Withdrawal" icon="mdi-cash-register" />
            
        </q-tabs>
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="players">
                <q-table title="Send Credits to Players" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                            <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                            <q-td key="action" :props="props">
                                <q-btn icon="send" @click="openEditDialog(props.row)" color="accent" />
                            </q-td>  
                        </q-tr>
                    </template>
                    <template v-slot:top-right>
                        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>  
                </q-table>
          </q-tab-panel>

          <q-tab-panel name="agents">
                <q-table title="Send Credits to Agents" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td key="accountName" :props="props">{{props.row.accountName}}</q-td>
                            <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                            <q-td key="action" :props="props">
                                <q-btn icon="send" @click="openEditDialog(props.row)" color="accent" />
                            </q-td>  
                        </q-tr>
                    </template>
                    <template v-slot:top-right>
                        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>  
                </q-table>
          </q-tab-panel>

          <q-tab-panel name="magents">
                <!-- <div class="q-pa-md my-card" flat bordered>
                    <div class="row item-start q-gutter-md col-6" >
                        <q-btn class="col-3 q-pa-xs" color="accent" icon="send">
                            <q-tooltip> Send Coins </q-tooltip>
                        </q-btn>
                        <q-btn class="col-3 q-pa-xs" color="green" icon="mdi-cash-multiple" >
                            <q-tooltip> View Withdrawals </q-tooltip>
                        </q-btn>
                    </div>
                </div> -->
                <q-table title="Send Credits to Master Agents" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                    <template v-slot:body="props">
                        <q-tr :props="props">
                            <q-td key="accountFirstName" :props="props">{{props.row.accountFirstName}}&nbsp;{{props.row.accountLastName}}</q-td>
                            <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                            <q-td key="action" :props="props">
                                <q-btn icon="send" @click="openEditDialog(props.row)" color="accent" />
                            </q-td>  
                        </q-tr>
                    </template>
                    <template v-slot:top-right>
                        <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                            <template v-slot:append>
                                <q-icon name="search" />
                            </template>
                        </q-input>
                    </template>  
                </q-table>
          </q-tab-panel>

          <q-tab-panel name="withdraw">
                <q-splitter reverse v-model="splitterModel" style="height: 1000px" >

                <template v-slot:after>
                    <q-tabs v-model="withdrawTab" vertical class="text-black" >
                    <q-tab name="mails" icon="mdi-human-greeting" label="Players" />
                    <q-tab name="alarms" icon="mdi-face-agent" label="Agents" />
                    <q-tab name="movies" icon="mdi-account-multiple" label="Master Agent" />
                    </q-tabs>
                </template>

                <template v-slot:before>
                    <q-tab-panels v-model="withdrawTab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up" >
                    <q-tab-panel name="mails">
                        <div class="text-h4 q-mb-md">Mails</div>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                    </q-tab-panel>

                    <q-tab-panel name="alarms">
                        <div class="text-h4 q-mb-md">Alarms</div>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                    </q-tab-panel>

                    <q-tab-panel name="movies">
                        <div class="text-h4 q-mb-md">Movies</div>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                    </q-tab-panel>
                    </q-tab-panels>
                </template>

                </q-splitter>
          </q-tab-panel>
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
            tab: 'players',
            splitterModel: 20,
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
