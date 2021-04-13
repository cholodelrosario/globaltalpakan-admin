<template>
    <div class="absolute-center">
        <div id="container"></div>
        <q-btn color="accent" icon="web" size="xl" label="Upload Backup Data" @click="uploadBackup" /><br>
        <!-- <q-btn color="primary" icon="backup" class="q-mt-md" size="xl" label="Backup Data" @click="onClick" /><br> -->
        <q-btn color="secondary" class="q-mt-md" icon="check" size="xl" label="show JSON" @click="jsonShow" />
    </div>
</template>
<script>
const stringifyObject = require('stringify-object');
// import json from '../tmp/Games.json'
export default {
    
    firestore(){
        return {
            Games: this.$db.collection('Games'),
            Team: this.$db.collection('Team'),
            BetOpt: this.$db.collection('BetOpt')
        }
    },
    methods: {
        uploadBackup(){
            let ary = json
            ary.forEach(a=>{
                let obj = {...a}
                let key = a['.key']
                delete obj['.key']
                // obj.timestamp = new Date(a.timestamp.seconds * 1000)
                this.$db.collection('Games').doc(key).set(obj)
                .then(()=>{
                    console.log('success');
                }).catch(err=>{console.error(error,'error');})
            })
        },
        jsonShow(){
            console.log(json);
        },
        async onClick(){
            let obj = this.BetOpt
            this.toFile(obj,'BetOpt')
        },
        toFile(obj,filename = 'data'){
            const pretty = stringifyObject(obj, {
                indent: '  ',
                singleQuotes: true
            });
            var data  = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
        
            var a       = document.createElement('a'); 
            a.href      = 'data:' + data; 
            a.download  = `${filename}.json`; 
            a.innerHTML = 'download .txt file of json'; 
        
            document.getElementById('container').appendChild(a); 
        }
    },
}
</script>