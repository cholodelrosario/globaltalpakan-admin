<template>
  <q-page class="bg-white">
        <!--FLOATING BUTTON-->
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="add" @click="addAccountDialog = true" color="accent" />
            <q-tooltip>
                Add Games
            </q-tooltip>
    </q-page-sticky>  
    <div>
        <div full-width>
        <q-tabs
            v-model="tab"
            inline-label
            class="bg-yellow shadow-2 col-12"
        >
            <q-tab class="col-4" name="gcash" label="G-Cash" icon="mdi-human-greeting" />
            <q-tab class="col-4" name="bank" label="Bank" icon="mdi-face-agent" />
            <q-tab class="col-4" name="cebuanna" label="Cebuanna Lhuiller" icon="mdi-account-multiple" />
            
        </q-tabs>

            <q-table grid :title="this.tab == 'gcash' ? 'G-cash Account' : this.tab == 'bank' ? 'Bank Account' : 'Cebuanna Account'" :data="bankAndGcash" :columns="this.tab == 'gcash' ? columnA : this.tab == 'bank' ? columnB : columnC " row-key="name" :filter="filterA" hide-header>
                <template v-slot:top-right>
                    <q-input outlined dense debounce="300" v-model="filterA" placeholder="Search">
                    <template v-slot:append>
                        <q-icon name="search" />
                    </template>
                    </q-input>
                </template>

                <template v-slot:item="props">
                    <div class="q-pa-xs col-md-4">
                        <q-card class="my-card" flat bordered>
                            <q-card-section class="col-6 flex flex-center" horizontal>
                                <q-card-section class="q-pt-xs">
                                <div class="text-h5 q-mt-sm q-mb-xs row flex flex-center">{{tab == 'gcash' ? props.row.gcashName : tab == 'bank' ? props.row.bankAccountName : props.row.receiversName}}</div>
                                <div class="row flex flex-center">
                                    <div class="text-overline">{{tab == 'gcash' ? props.row.gcashNumber : tab == 'bank' ? props.row.bankNumber : props.row.receiversNumber}}</div>
                                </div>
                                <div v-show="tab == 'bank'" class="row flex flex-center">
                                    <div class="text-overline">{{props.row.bankName}}</div>
                                </div>
                                <div class="row flex flex-center">
                                    <div class="text-overline">status: <q-toggle @input="activate(props.row)" v-model="props.row.activated" :label="props.row.activated == true ? 'Available' : 'Not Available' " color="green"/> </div>
                                </div>
                            </q-card-section>
                            </q-card-section>
                            <q-separator />
                            <q-card-actions align="center">
                                <q-btn label="Edit" padding="none" @click="openEditDialog(props.row)" style="width: 30px" class="col column justify-between" color="accent" icon="mdi-pencil">
                                    <q-tooltip> Edit Account </q-tooltip>
                                </q-btn>
                                <q-btn label="Delete" padding="none" @click="openDeleteDialog(props.row)" style="width: 30px" class=" col column justify-between" color="negative" icon="delete" >
                                    <q-tooltip> Delete Account </q-tooltip>
                                </q-btn>
                            </q-card-actions>
                        </q-card>
                    </div>
                </template>
            </q-table>        
        </div>
    </div>
        <q-dialog v-model="addAccountDialog" persistent>
            <q-card>
                <q-card-section>
                <div class="text-h6">{{this.tab == 'gcash' ? 'Add G-Cash Account' : this.tab == 'bank' ? 'Add Bank Account' : 'Add Cebuanna Account'}}</div>
                </q-card-section>
                <q-separator />
                <q-card-section style="max-height: 50vh">   
                    <div padding="none" class="col q-gutter-md">
                        <div >
                            <b class="col text-h6">{{this.tab == 'gcash' ? 'G-Cash Name' : this.tab == 'bank' ? 'Account Name' : "Receiver's Name"}}</b>
                            <q-input class="q-ma-sm col" v-model="accountName" dense outlined style="width: 300px" />
                        </div>
                        <div>
                            <b class="col text-h6">{{this.tab == 'gcash' ? 'G-Cash No.' : this.tab == 'cebuanna' ? "Receiver's No." : 'Account Number'}}</b>
                            <q-input v-show="this.tab == 'gcash' || this.tab == 'cebuanna'" class="q-ma-sm col"  outlined v-model="accountNumber" dense label="Phone" mask="(####) ### - ####" hint="Mask: (####) ### - ####" />
                            <q-input v-show="this.tab == 'bank'" class="q-ma-sm col"  outlined v-model="accountBankNumber" dense label="Account Number" />
                        </div>
                        <div v-show="this.tab == 'bank'" >
                            <b class="col text-h6">Bank Name</b>
                            <q-input class="q-ma-sm col" v-model="bankName" dense outlined style="width: 300px" />
                        </div>  
                    </div>
                </q-card-section>
                <q-separator />

                <q-card-actions align="right">
                <q-btn flat label="cancel" color="primary" v-close-popup />
                <q-btn flat label="Add Account" @click="addGcashBankAccount()" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
        <q-dialog v-model="editDialog" persistent>
            <q-card>
                <q-card-section>
                <div class="text-h6">{{this.tab == 'gcash' ? 'Add G-Cash Account' : this.tab == 'bank' ? 'Add Bank Account' : 'Add Cebuanna Account'}}</div>
                </q-card-section>
                <q-separator />
                <q-card-section style="max-height: 50vh">   
                    <div padding="none" class="col q-gutter-md">
                        <div >
                            <b class="col text-h6">{{this.tab == 'gcash' ? 'G-Cash Name' : this.tab == 'bank' ? 'Account Name' : "Receiver's Name"}}</b>
                            <q-input class="q-ma-sm col" v-model="updateName" dense outlined style="width: 300px" />
                        </div>
                        <div>
                            <b class="col text-h6">{{this.tab == 'gcash' ? 'G-Cash No.' : this.tab == 'cebuanna' ? "Receiver's No." : 'Account Number'}}</b>
                            <q-input v-show="this.tab == 'gcash' || this.tab == 'cebuanna'" class="q-ma-sm col"  outlined v-model="updateNumber" dense label="Phone" mask="(####) ### - ####" hint="Mask: (####) ### - ####" />
                            <q-input v-show="this.tab == 'bank'" class="q-ma-sm col"  outlined v-model="updateBankNumber" dense label="Account Number" />
                        </div>
                        <div v-show="this.tab == 'bank'" >
                            <b class="col text-h6">Bank Name</b>
                            <q-input class="q-ma-sm col" v-model="updateBankName" dense outlined style="width: 300px" />
                        </div>  
                    </div>
                </q-card-section>
                <q-separator />

                <q-card-actions align="right">
                <q-btn flat label="cancel" color="primary" v-close-popup />
                <q-btn flat label="Update Account" @click="setTask()" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>
  </q-page>
</template>

<script>
import { date } from 'quasar'
export default {
    data(){
        return {
            activated: false,
            updateBankNumber: '',
            accountBankNumber: '',
            updateBankName: '',
            updateName: '',
            updateNumber: '',
            editDialog: false,
            filterB: '',
            bankName: '',
            table: false,
            selectNumber: 0,
            accountName: '',
            accountNumber: '',
            amount: 0,
            addAccountDialog: false,
            filterA: '',
            MasterAgents: [],
            Players: [],
            Agents: [],
            tab: 'gcash',
            splitterModel: 20,
            CebuannaAccount: [],
            GcashAccount: [],
            BankAccount: [],
            columnA: [
                { name: 'gcashName', required: true, label: 'G-cash Name', align: 'left', field: 'gcashName', sortable: true },
                { name: 'bankNumber', required: true, label: 'G-cash Number', align: 'left', field: 'bankNumber', sortable: true },
                { name: 'action', label: 'Action' }
            ],
            columnB: [
                { name: 'bankAccountName', required: true, label: 'G-cash Name', align: 'left', field: 'bankAccountName', sortable: true },
                { name: 'gcashNumber', required: true, label: 'G-cash Number', align: 'left', field: 'gcashNumber', sortable: true },
                { name: 'bankName', required: true, label: 'G-cash Number', align: 'left', field: 'bankName', sortable: true },
                { name: 'action', label: 'Action' }
            ],
            columnC: [
                { name: 'receiversName', required: true, label: "Receiver's Name", align: 'left', field: 'receiversName', sortable: true },
                { name: 'receiversNumber', required: true, label: "Receiver's Number", align: 'left', field: 'receiversNumber', sortable: true },
                { name: 'action', label: 'Action' }
            ]
        }
    },
    mounted() {
        this.$binding('GcashAccount', this.$db.collection('GcashAccount'))
            .then(GcashAccount => {
            console.log(GcashAccount, 'GcashAccount')
        })
        this.$binding('BankAccount', this.$db.collection('BankAccount'))
            .then(BankAccount => {
            console.log(BankAccount, 'BankAccount')
        })
        this.$binding('CebuannaAccount', this.$db.collection('CebuannaAccount'))
            .then(CebuannaAccount => {
            console.log(CebuannaAccount, 'CebuannaAccount')
        })
    },
    computed: {
        bankAndGcash(){
            if(this.tab == 'gcash'){
                return this.GcashAccount
            }if(this.tab == 'bank'){
                return this.BankAccount
            }if(this.tab == 'cebuanna'){
                return this.CebuannaAccount
            }
        }
    },
    methods:{
        activate(data) {
            this.$q.dialog({
                title: `Enabling and Disabling Accounts`,
                type: 'negative',
                color: 'negative',
                textColor: 'white',
                persistent: true,
                icon: 'warning',
                ok: 'Ok'
            }).onOk(()=> {
                var status = data.activated
                console.log(data, 'data')
                let key = data['.key']
                let update = {...data}
                delete update['.key']
                if(this.tab == 'gcash'){
                    this.$db.collection(`GcashAccount`).doc(key).set(update)
                    .then(() => {
                        this.$q.notify({
                            message: status ? `${data.gcashName} has been activated`: `${data.gcashName} has been deactivated`,
                            type: 'positive',
                            color: 'positive',
                            textColor: 'white',
                            icon: 'info',
                            persistent: true
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
                }else if(this.tab == 'bank'){
                    this.$db.collection(`BankAccount`).doc(key).set(update)
                    .then(() => {
                        this.$q.notify({
                            message: status ? `${data.bankAccountName} has been activated`: `${data.bankAccountName} has been deactivated`,
                            type: 'positive',
                            color: 'positive',
                            textColor: 'white',
                            icon: 'info',
                            persistent: true
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
                }else{
                    this.$db.collection(`CebuannaAccount`).doc(key).set(update)
                    .then(() => {
                        this.$q.notify({
                            message: status ? `${data.receiversName} has been activated`: `${data.receiversName} has been deactivated`,
                            type: 'positive',
                            color: 'positive',
                            textColor: 'white',
                            icon: 'info',
                            persistent: true
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
                }
            })
		},
        setTask(){
            var accountBagoA = {
                gcashName: this.updateName,
                gcashNumber: this.updateNumber,
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            }
            var accountBagoB = {
                bankAccountName: this.updateName,
                bankNumber: this.updateBankNumber,
                bankName: this.updateBankName,
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            }
            var accountBagoC = {
                receiversName: this.updateName,
                receiversNumber: this.updateNumber,
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            }
            if(this.updateName === ''){
                this.$q.dialog({
                title: 'Field Required!',
                message: 'Fill all Requirements?',
                ok: 'Ok',
                cancel: 'Cancel'
                })
            }else
                this.$q.dialog({
                title: 'Update Account',
                message: 'Update This Account?',
                ok: 'Yes',
                cancel: 'Cancel'
            }).onOk(() => { 
                if(this.tab == 'gcash'){
                    this.$db.collection('GcashAccount').doc(this.gcashID).set(accountBagoA)
                }else if(this.tab == 'bank'){
                    this.$db.collection('BankAccount').doc(this.bankID).set(accountBagoB)
                }else{
                    this.$db.collection('CebuannaAccount').doc(this.cebuannaID).set(accountBagoC)
                }
                this.$q.notify({
                        message: 'Account Updated!',
                        icon: 'mdi-update',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.editDialog = false  
            })  
        },
        openEditDialog (task) {
            if(this.tab == 'gcash'){
                this.gcashID = task['.key']
                this.updateName = task.gcashName
                this.updateNumber = task.gcashNumber
                this.editDialog = true
            }else if(this.tab == 'bank'){
                this.bankID = task['.key']
                this.updateName = task.bankAccountName
                this.updateBankNumber = task.bankNumber
                this.updateBankName = task.bankName
                this.editDialog = true
            }else{
                this.cebuannaID = task['.key']
                this.updateName = task.receiversName
                this.updateNumber = task.receiversNumber
                this.editDialog = true
            }
        },
        openDeleteDialog (task) {
          var id = task['.key']
          this.$q.dialog({
            title: 'Delete Account',
            message: 'Delete This Account?',
            ok: 'Yes',
            cancel: 'Cancel'
            }).onOk(() => { 
                if(this.tab == 'gcash'){
                    this.$db.collection('GcashAccount').doc(id).delete()
                }else if(this.tab == 'bank'){
                    this.$db.collection('BankAccount').doc(id).delete()
                }else{
                    this.$db.collection('CebuannaAccount').doc(id).delete()
                }
                this.$q.notify({
                    message: 'Account Deleted!',
                    icon: 'mdi-delete',
                    color: 'negative',
                    textColor: 'white',
                    position: 'center'
                })
            })
        },
        addGcashBankAccount(){
            var newAccountA = {
                gcashName: this.accountName,
                gcashNumber: this.accountNumber,
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            }
            var newAccountB = {
                bankAccountName: this.accountName,
                bankNumber: this.accountBankNumber,
                bankName: this.bankName,
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            }
            var newAccountC = {
                receiversName: this.accountName,
                receiversNumber: this.accountNumber,
                dateCreated: date.formatDate(new Date(), 'YYYY-MM-DD HH:mm'),
            }        
            if(this.accountName === '') {
                this.$q.dialog({
                title: 'Field Required!',
                message: 'Fill all Requirements?',
                ok: 'Ok',
                })
            }else
                this.$q.dialog({
                title: 'Add Account',
                message: 'Add This Account?',
                ok: 'Yes',
            }).onOk(() => { 
                if(this.tab == 'gcash'){
                    this.$db.collection('GcashAccount').add(newAccountA)
                }else if(this.tab == 'bank'){
                    this.$db.collection('BankAccount').add(newAccountB)
                }else{
                    this.$db.collection('CebuannaAccount').add(newAccountC)
                }
                this.$q.notify({
                        message: 'Account Added!',
                        icon: 'mdi-folder-plus-outline',
                        color: 'positive',
                        textColor: 'white',
                        position: 'center'
                    })
                    this.accountName = ''
                    this.accountNumber = ''
                    this.bankName = ''
                    this.accountBankNumber = ''
            })
        }
    }
}
</script>
