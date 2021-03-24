<template>
  <q-page class="flex flex-center row bg-dark">
    <div>
    <q-img
        :style="$q.platform.is.desktop ? 'width:30vw;' : 'width:90vw'"
        src="~assets/globaltalpakan-sample.png"
        spinner-color="primary"
        spinner-size="82px"
        contain
        class="col-12"
    />
    <q-card 
        class="bg-white my-card col-12 q-pa-md" 
        flat 
        :style="$q.platform.is.desktop ? 'width:30vw;' : 'width:90vw'"
        v-show="logRegTab"
    >

        <q-card-section class="q-gutter-md">
            <q-input v-model="mobile" type="text" color="white" label="Mobile Number" standout/>
            <q-input v-model="password" :type="isPwd ? 'password' : 'text'" color="white" label="Password" standout>
                <template v-slot:append>
                <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                />
                </template>
            </q-input>
        </q-card-section>
        <q-card-actions align="center">
            <q-btn color="primary" class="text-black full-width" label="Login Account" @click="$router.push('/dashboard')"/>
        </q-card-actions>
            
    </q-card> 
    <!-- phone auth -->


    </div>     
  </q-page>
</template>

<script>
export default {
    data(){
        return {
            mobile: '',
            password: '',
            confirmpassword: '',
            isPwd: true,
            code: '',
            logRegTab: true,
            verifyTab: false,
            tab: 'Login'
        }
    },
    firestore(){
      return {
        DashboardUsers: this.$db.collection('DashboardUsers'),
      }
    }, 
    methods:{
        loginAccount(){
            let index = this.$lodash.findIndex(this.DashboardUsers, a=>{
                return a.mobile == this.mobile
            })
            console.log(index,'index');
            if(index !== -1){
                this.$store.dispatch('useraccount/loginUser',{email: this.mobile, password: this.password})
            } else {
                this.$q.dialog({
                    title: `Access Denied!.`,
                    message: `You have no access to this site.`,
                    persistent: true,
                }).onOk(() => {
                    this.$store.dispatch('notification/createNotifs', {userAttempt: this.mobile, module: 'Login',action: 'User Login Attempt'})
                    this.mobile = ''
                    this.password = ''
                })                   
            }
            
        }
    }  
}
</script>
