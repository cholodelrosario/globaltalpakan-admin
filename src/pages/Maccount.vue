<template>
    <q-page>
        <div class="q-pa-md">
            <q-table title="CREATE M/A ACCOUNT" :data="getUsers" :columns="columns" :filter="filter" row-key="name">
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
                            <q-btn v-if="props.row.accountPosition != 'Admin'" icon="edit" size="sm" color="accent" label="edit" @click="editUser(props.row)" />
                            <q-btn v-if="props.row.role != 'Admin'" color='negative' size="sm" label="remove" icon="delete" @click="removeUser(props)"></q-btn>
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
        </div>
        <!--FLOATING BUTTON-->
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn fab icon="mdi-account-plus-outline" color="accent" @click="addAccountDialog = true, isEdit = false" />
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
                        <q-input class="q-ma-sm" style="width: 240px" v-model="newUser.accountFirstName" label="Firt Name"/>
                        <q-input class="q-ma-sm" style="width: 240px" v-model="newUser.accountLastName" label="Last Name"/>
                    </div>
                    <div class="q-pa-md row" style="margin-top: -40px" dense>
                        <q-input class="q-ma-sm" style="width: 240px" outlined v-model="newUser.accountPhone" label="Phone" mask="(####) ### - ####" hint="Mask: (####) ### - ####" />
                        <q-select class="q-ma-sm" style="width: 240px" outlined v-model="newUser.accountPosition" :options="options" emit-value map-options label="Position"/>
                    </div>
                    <div style="margin-top: -30px">
                        <q-input v-model="newUser.accountEmailAdd" type="email" prefix="Email:" suffix="@gmail.com" style="width: 530px; margin-left: 10px">
                            <template v-slot:prepend>
                                <q-icon name="mail" />
                            </template>
                        </q-input>
                    </div>
                    <div>
                        <q-input class="q-mt-md" rounded outlined prefix="Password:" v-model="newUser.accountPassword" style="width: 545px" :type="isPwd ? 'password' : 'text'">
                        <template v-slot:append>
                            <q-avatar>
                                    <q-icon
                                    :name="isPwd ? 'visibility_off' : 'visibility'"
                                    class="cursor-pointer"
                                    @click="isPwd = !isPwd"
                                    />
                            </q-avatar>
                        </template>
                    </q-input>
                    <q-input class="q-mt-md" rounded outlined prefix="Confirm Password:" v-model="newUser.accountConfirmPassword" style="width: 545px" :type="isPwd ? 'password' : 'text'">
                        <template v-slot:append>
                            <q-avatar>
                                    <q-icon
                                    :name="isPwd ? 'visibility_off' : 'visibility'"
                                    class="cursor-pointer"
                                    @click="isPwd = !isPwd"
                                    />
                            </q-avatar>
                        </template>
                    </q-input>
                    </div>
                    
                </q-card-section>

                <q-card-actions align="right" class="text-primary">
                    <q-btn flat label="Cancel" @click="clear()" v-close-popup />
                    <q-btn flat label="Add Account" v-if="!isEdit" v-close-popup @click="addNewUser" />
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
export default {
    data() {
        return {
                isPwd: true,
                options: ['Master Agent'],
    			isEdit: false,
                Accounts: [],
                loading: false,
                addAccountDialog: false,
                newUser: {
                    accountFirstName: '',
                    accountLastName: '',
                    accountPhone: '',
                    accountPosition: '',
                    accountPassword: '',
                    accountEmailAdd: '',
                    accountConfirmPassword: '',
                    activated: false,
                },
                filter: '',
                columns: [
                    { name: 'accountFirstName', required: true, label: 'Full Name', align: 'center', field: 'accountFirstName', sortable: true },
                    { name: 'accountEmailAdd', required: true, label: 'Email Address', align: 'center', field: 'accountEmailAdd', sortable: true },
                    { name: 'accountPhone', required: true, label: 'Phone Number', align: 'center', field: 'accountPhone', sortable: true },
                    { name: 'activated', required: true, label: 'Account Status', align: 'center', field: 'activated', sortable: true },
                    { name: 'accountPosition', required: true, label: 'Account Position', align: 'center', field: 'accountPosition', sortable: true },
                    { name: 'action', align: 'center', label: 'Action' }
                ]
        }
    },
    mounted() {
        this.$binding('Accounts', this.$db.collection('Accounts'))
            .then(Accounts => {
            console.log(Accounts, 'Accounts')
        })
    },
    computed: {
        getUsers () {
			try {
				let filterUsers = this.$lodash.filter(this.Accounts, u => {
					return u.accountPosition !== 'Admin'
                })
                console.log(filterUsers, 'users')
				return filterUsers
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
            }).onOk(()=>{
			console.log('p', p)
			let lName = p.row.accountLastName
            let userKey = p.row['.key']
            this.$db.collection('Accounts').doc(userKey).delete()
			//this.$database.ref(`users`).child(userKey).remove()
				.then(() => {
					this.$q.notify({
                    message: `${lName} has been deleted`,
                    type: 'info',
                    color: 'info',
                    textColor: 'white',
                    icon: 'info'
                })
          }).onCancel(()=>{
              addAccountDialog = true
          })
          this.$forceUpdate()
				})
				.catch(err => {
					this.$q.notify({
            message: `An error occur ${err}`,
            type: 'negative',
            color: 'negative',
            textColor: 'white',
            icon: 'info'
          })
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
            this.$db.collection('Accounts').doc(key).set(data)
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
            this.$db.collection(`Accounts`).doc(key).set(update)
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
        addNewUser () {
			this.$q.dialog({
			  title: 'Confirm',
			  message: 'Do you want to save user?',
			  ok: 'Save',
			  cancel: 'Cancel'
			})
			  .onOk(() => {
					let data = this.newUser
		            let self = this
					this.loading = true
		            console.log('create data', data)
		              self.$db.collection('Accounts').add(data)
			          	.then(u => {
				            this.$q.notify({
				              message: `User has been successfully added`,
				              type: 'positive',
				              color: 'positive',
				              textColor: 'white',
				              icon: 'info'
                            })
                            this.loading = false
                            this.newUser.accountFirstName = '',
                            this.newUser.accountLastName = '',
                            this.newUser.accountPhone = '',
                            this.newUser.accountPosition = '',
                            this.newUser.accountPassword = '',
                            this.newUser.accountEmailAdd = '',
                            this.newUser.accountConfirmPassword = '',
                            this.newUser.activated = false,
				            this.addAccountDialog = false
				          })
			            .catch(error => {
			              this.$q.notify({
			                message: `An error occured in adding to database${error}`,
			                type: 'negative',
			                color: 'negative',
			                textColor: 'white',
			                icon: 'warning'
			              })
                          this.loading = false
			            })	
		        	}, 3000)
			  .catch(() => {})
		}
    }
}
</script>