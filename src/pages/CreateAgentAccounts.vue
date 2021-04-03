<template>
  <q-page class="flex q-pa-lg bg-dark">
    <div class="container row full-width">
        <div class="col">
          <h5 class="text-primary text-weight-bolder q-mt-none">Create Agent Account</h5>
          <q-card 
            class="my-card q-ma-lg" 
            flat 
            >
              <q-card-section class="q-gutter-md">
                  <q-input v-model="agentName" type="text" color="white" label="Master Agent Name" standout/>
                  <q-input v-model="mobile" type="text" color="white" label="Mobile Number" standout/>
              </q-card-section>
              <q-card-actions class="q-pa-md">
                  <q-btn color="primary"  class="text-black full-width" label="Create Account" @click="createAgentAccount"/>
              </q-card-actions>
          </q-card>
        </div>
        <div class="col">
            <h6 class="text-secondary q-ma-none">Create Agent Account History</h6>
            <q-list class="text-white" separator>
                <br>
                <q-item clickable v-ripple class="q-py-md" v-for="n in MasterAgents" :key="n['.key']">
                    <q-item-section>
                        <q-item-label>{{n.agentName}}</q-item-label>
                        <q-item-label class="text-secondary" caption lines="2">{{n.Phone}}</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                        <q-item-label class="text-secondary" lines="2" caption>{{n.dateCreated.toDate()}}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
            <br><br><br>
        </div>
    </div>
  </q-page>
</template>

<script>
import { firebaseAuth,firebaseApp,firebaseDb,Auth2 } from 'boot/firebase'
var sri = require('simple-random-id');
export default {
  data(){
    return {
      mobile: '',
      agentName: ''
    }
  },
    firestore(){
      return {
        MasterAgents: this.$db.collection('MasterAgents')
      }
    },
  methods:{
    async createAgentAccount(){
      const password = sri(6);
      let email = `${this.mobile}@gtmasteragent.com`
      await this.createLoginUser(email,this.mobile,password);
    },
    createLoginUser (email, mobile, password) {
      return new Promise(async (resolve) => {
          await this.sendAccountMessage(mobile,password)
          // console.log('sent message')
          Auth2.createUserWithEmailAndPassword(email, password)
            .then(async (data) => {
              // console.log(data, 'data')
              const userID = data.uid
              await firebaseDb.collection('MasterAgents').doc(data.user.uid).set({
                Email: email,
                Phone: mobile,
                agentName: this.agentName,
                changePass: true,
                dateCreated: new Date()
              }).then(async (doc) => {
                this.mobile = ''
                this.agentName = ''
                resolve(doc)
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

      let message = `Welcome GT Partner, login to https://globaltalpakan-agent.web.app/#/ with your mobile number and temporary password = ${password}. You can change your password once you logged in. Thanks. -globaltalpakan.admin`

      await this.$store.dispatch('sms/sendSMS',{number: mobile, message: message})
      .then(()=>{
          this.$q.dialog({
              title: `Account Details Sent`,
              persistent: true,
          })
      }).catch(err=>{
          this.$q.dialog({
              title: `Account Creation Error`,
              message: err,
              persistent: true,
          })
      })
    }
  }

}
</script>
