<template>
    <q-page class="bg-dark text-white">
        <div class="q-pa-md">
            <q-table title="CREATE MASTER AGENT ACCOUNTS" class="bg-secondary text-white" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
                <template v-slot:body="props">
                    <q-tr :props="props">
                        <q-td key="accountFirstName" :props="props">{{props.row.accountFirstName}}&nbsp;{{props.row.accountLastName}}</q-td>
                        <q-td key="accountEmailAdd" :props="props">{{props.row.accountEmailAdd}}</q-td>
                        <q-td key="accountPhone" :props="props">{{props.row.accountPhone}}</q-td>
                        <q-td key="activated" :props="props">
                            <q-toggle v-if="props.row.accountPosition != 'Admin'" @input="activate(props.row)" v-model="props.row.activated" color="green"/>
                        </q-td>
                        <q-td key="accountPosition" :props="props">{{props.row.accountPosition}}</q-td>
                        <q-td key="action" :props="props">
                            <q-btn v-if="props.row.accountPosition != 'Admin'" icon="edit" size="sm" color="grey" flat label="edit" @click="editUser(props.row)" />
                            <q-btn v-if="props.row.role != 'Admin'" color='grey' flat size="sm" label="remove" icon="delete" @click="removeUser(props)"></q-btn>
                        </q-td>  
                    </q-tr>
                </template>
                <template v-slot:top-right>
                    <q-input borderless dense outlined color="primary" debounce="300" v-model="filter" dark placeholder="Search">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                </template>  
            </q-table>
        </div>
        <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="mdi-account-plus-outline" color="primary" @click="addAccountDialog = true, isEdit = false" />
                <q-tooltip>
                    Create New Account
                </q-tooltip>

        </q-page-sticky>
        <!--Modal For add Food-->
        <q-dialog v-model="addAccountDialog" persistent>
            <q-card style="min-width: 600px">
                <q-card-section>
                    <div style="margin-bottom: -50px" class="text-h6">{{this.isEdit == false ? 'New Account' : 'Edit Account'}}</div>
                </q-card-section>
                <q-card-section>
                    <div class="q-pa-md row" dense>
                        <q-input class="q-ma-sm col" outlined v-model="newUser.accountFirstName" label="First Name"/>
                        <q-input class="q-ma-sm col" outlined v-model="newUser.accountLastName" label="Last Name"/>
                    </div>
                    <div class="q-pa-md row"  dense>
                        <q-input class="q-ma-sm col" :disable="isEdit"  outlined v-model="newUser.accountPhone" label="Phone" mask="(####) ### - ####" hint="Mask: (####) ### - ####" />
                        <!-- <q-select class="q-ma-sm col"  outlined v-model="newUser.accountPosition" :options="options" emit-value map-options label="Position"/> -->
                    </div>
                    
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat color="grey" label="Cancel" @click="clear()" v-close-popup />
                    <q-btn color="primary" class="text-black" label="Add Account" v-if="!isEdit" v-close-popup @click="createAgentAccount" />
                    <q-btn v-if="isEdit" flat v-close-popup @click="updateUser" label="Update"/>
                </q-card-actions>
                <q-inner-loading :visible="loading">
                        <q-spinner-gears size="50px" color="primary"></q-spinner-gears>
                </q-inner-loading>
            </q-card>
        </q-dialog>
    </q-page>
</template>
<script>
import { firebaseAuth,firebaseApp,firebaseDb,Auth2 } from 'boot/firebase'
var sri = require('simple-random-id');
export default {
    data() {
        return {
                isPwd: true,
                options: ['Agent','Master Agent'],
    			isEdit: false,
                MasterAgents: [],
                loading: false,
                addAccountDialog: false,
                newUser: {
                    accountFirstName: '',
                    accountLastName: '',
                    accountPhone: '',
                    activated: false,
                },
                filter: '',
                columns: [
                    { name: 'accountFirstName', required: true, label: 'Full Name', align: 'center', field: 'accountFirstName', sortable: true },
                    // { name: 'accountEmailAdd', required: true, label: 'Email Address', align: 'center', field: 'accountEmailAdd', sortable: true },
                    { name: 'accountPhone', required: true, label: 'Phone Number', align: 'center', field: 'accountPhone', sortable: true },
                    { name: 'activated', required: true, label: 'Account Status', align: 'center', field: 'activated', sortable: true },
                    // { name: 'accountPosition', required: true, label: 'Account Position', align: 'center', field: 'accountPosition', sortable: true },
                    { name: 'action', align: 'center', label: 'Action' }
                ]
        }
    },
    mounted() {
        this.$binding('MasterAgents', this.$db.collection('MasterAgents'))
            .then(MasterAgents => {
            console.log(MasterAgents, 'MasterAgents')
        })
    },
    computed: {
        getUsers () {
			try {
				return this.MasterAgents
			} catch {
				return []
			}
		}
    },
    methods: {
        clear() {
            this.newUser.accountFirstName = '',
            this.newUser.accountLastName = '',
            this.newUser.accountPhone = '',
            this.newUser.accountPosition = '',
            this.newUser.accountPassword = '',
            this.newUser.accountEmailAdd = '',
            this.newUser.accountConfirmPassword = ''
        },
        removeUser (p) {
                this.$q.dialog({
                title: 'REMOVE THIS ACCOUNT??',
                message: 'Delete Account??',
                type: 'negative',
                color: 'negative',
                textColor: 'red',
                icon: 'info',
                ok: 'Ok',
                cancel: 'Cancel'
            }).onOk(async ()=>{
			console.log('p', p)
			let lName = p.row.accountLastName
            let userKey = p.row['.key']
            await this.deleteAccountAPICALL(userKey).then(()=>{
                this.$db.collection('MasterAgents').doc(userKey).delete()
                //this.$database.ref(`users`).child(userKey).remove()
                    .then(() => {
                        this.$q.notify({
                            message: `${lName} has been deleted`,
                            type: 'info',
                            color: 'info',
                            textColor: 'white',
                            icon: 'info'
                        })
                    }).catch(err => {
					    this.$q.notify({
                            message: `An error occur ${err}`,
                            type: 'negative',
                            color: 'negative',
                            textColor: 'white',
                            icon: 'info'
                        })
				    })
                })
          }).onCancel(()=>{
              addAccountDialog = true
          })
		},
        updateUser () {
			this.$q.dialog({
				title: 'Confirm',
			  message: 'Do you want to update user?',
			  ok: 'Update',
			  cancel: 'Cancel'
			})
			//   .then(() => {
			    // Picked "OK"
			//   })
			//   .catch(() => {
			    // Picked "Cancel" or dismissed
            //   })
            // let key = data['.key']
            // let update = {...data}
            // delete update['.key']
			let data = {...this.newUser}
			var key = data['.key']
			delete data.__index
			delete data['.key']
            console.log('user', data)
            this.$db.collection('MasterAgents').doc(key).set(data)
			// this.$database.ref(`users/${key}`).set(data)
			.onOk(() => {
		    this.$q.notify({
            message: `${data.accountLastName} has been updated`,
            type: 'positive',
            color: 'positive',
            textColor: 'white',
            icon: 'info'
            })  
		
			this.newUserModal = false
            this.isEdit = false
            })
        },
        editUser (u) {
			let data = {...u}
			this.newUser = data
			this.addAccountDialog = true
			this.isEdit = true
		},
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
            this.$db.collection(`MasterAgents`).doc(key).set(update)
				.then(() => {
			this.$q.notify({
            message: status ? `${data.accountLastName} has been activated`: `${data.accountLastName} has been deactivated`,
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
        async createAgentAccount(){
            this.$q.dialog({
			  title: 'Confirm',
			  message: 'Do you want to save this master agent account?',
			  ok: 'Save',
			  cancel: 'Cancel' 
			})
            .onOk(async () => {
                let data = this.newUser
                data.accountPhone = this.newUser.accountPhone.replace(/[^A-Z0-9]+/ig, "")
                const password = sri(6);
                const mobile = this.newUser.accountPhone.replace(/[^A-Z0-9]+/ig, "")
                let email = `${mobile}@gtmasteragent.com`
                await this.createLoginUser(email, mobile ,password, data);
            })
        },
        createLoginUser (email, mobile, password, dbData) {
        return new Promise(async (resolve) => {
            await this.sendAccountMessage(mobile,password)
            // console.log('sent message')
            Auth2.createUserWithEmailAndPassword(email, password)
                .then(async (data) => {
                // console.log(data, 'data')
                const userID = data.uid
                await firebaseDb.collection('MasterAgents').doc(data.user.uid).set({
                    ...dbData,
                    inviteLink: sri(6),
                    changePass: true,
                    dateCreated: new Date()
                }).then(async (doc) => {
                    await this.createWallet(data.user.uid, function(walletError,walletResponse){
                        if(walletError){
                            console.log(walletError,'walletError')
                        }
                        resolve(doc)
                    })
                    this.mobile = ''
                    this.agentName = ''
                }).catch((err) => {
                    console.log(err)
                })
                
                })
                .catch(err => {
                console.log(err)
                })          
        })
        },
        async sendAccountMessage(mobile,password){

        let message = `Welcome GT Partner, login to https://globaltalpakandev-masteragent.web.app/#/ with your mobile number and temporary password = ${password}. You can change your password once you logged in. Thanks. -globaltalpakan.admin`
        console.log(message,'message');
        await this.$store.dispatch('sms/sendSMS',{number: mobile, message: message})
        .then(()=>{
            this.$q.dialog({
                title: `Account Details Sent . use this password - ${password}`,
                persistent: true,
            })
        }).catch(err=>{
            this.$q.dialog({
                title: `Account Creation Error`,
                message: err,
                persistent: true,
            })
        })
        },
        async deleteAccountAPICALL(uid){
            await this.$axios({
                method: 'post',
                // url: 'https://www.itexmo.com/php_api/api.php',
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                url: 'https://global-talpakan-backend.herokuapp.com/users/deleteUser',
                data: {uid: uid}
            })
            .then(function (response) {
                console.log(response)
                console.log(response.data,'- Delete User Response')
            })
            .catch(function (error) {
                console.log(error,'- Delete User Error')
            })            
        },
        async createWallet(uid,done){
            let wallet = {
                creditsAmount: 0
            }
            console.log('code pass thru')
            await firebaseDb.collection('Wallet').doc(uid).set(wallet).then((doc)=>{
                console.log(doc,'if meron')
                done(null,doc)
            }).catch((err) => {
                console.log('wallet ERR',err)
                done(err)
            })
        }
    }
}
</script>