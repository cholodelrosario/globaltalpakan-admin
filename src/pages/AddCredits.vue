<template>
  <q-page class="flex container q-pa-lg bg-dark">
    <div class="full-width">
        <h5 class="text-primary text-weight-bolder q-mt-none">Buy Credits</h5>
        <q-tabs
            v-model="tab"
            class="bg-dark text-white"
      >
        <q-tab name="GCASH"  label="GCASH" />

        <q-tab name="Cebuana"  label="Cebuana" />
        
        <q-tab name="ML"  label="ML" />
      </q-tabs>

    <q-tab-panels v-model="tab" animated class="bg-dark text-white">
        <q-tab-panel name="GCASH">
            <q-btn color="primary" class="text-black q-mt-md full-width" label="View Cash-In Request"  />

            <q-card class="my-card bg-accent q-mt-md" flat >
            <q-card-section horizontal>
                <q-card-section>
                <div class="text-caption">Send <span class="text-h6 q-ml-sm">200.00</span> to <span class="text-h6 q-ml-sm">10,000.00</span> any numbers below.</div>
                </q-card-section>

                <q-card-section class="col-5 flex flex-center">
                    <q-avatar size="20vw">
                        <img src="~assets/gcash.png">
                    </q-avatar>
                </q-card-section>
            </q-card-section>
            <q-list class="bg-white text-accent text-center">
                <q-item>
                    <q-item-section>
                        <span class="text-weight-bolder">09991234567</span>
                        JOHN A. DOE<br>
                    </q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item>
                    <q-item-section>
                        <span class="text-weight-bolder">09991234568</span>
                        JANE A. DOE<br>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-list class="text-white text-center">
                <q-item>
                    <q-item-section>
                        Our GCASH numbers change every 10 minutes. Please refresh this page before sending.
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section>
                        Fill the reference no, amount, sender, receiver in the form below.
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section>
                        Attach the receipt in the attachment field.
                    </q-item-section>
                </q-item>
            </q-list>
            </q-card>

            <div>
                <h6 class="text-seondary text-center text-weight-bolder q-mb-md">Deposit Form</h6>
                <q-input v-model="cashInAmount" type="number" color="dark" label="Amount" dark standout class="text-capitalize"/>
                <br>
                <q-input v-model="senderName" type="text" color="dark" label="Sender Name" dark standout class="text-capitalize"/>
                <br>
                <q-select standout dark v-model="receiverName" :options="recieverOptions" label="Reciever Name" />
                <br>
                <q-input v-model="transactionNumber" type="text" color="dark" label="Ref No." dark standout class="text-capitalize"/>
                <br>
                <span class="text-caption">Photo of the actual receipt</span>
                <q-input v-model="attachment" type="file" color="dark" dark standout class="text-capitalize"/>
                <br>
                <q-input v-model="notes" type="textarea" color="dark" label="Notes" dark standout class="text-capitalize"/>
                <br>
                <q-btn color="primary" class="text-black q-mt-md full-width" :label="`Submit ${tab}`"  />
            </div>
            <br><br><br>
        </q-tab-panel>
<!-- 0B3C49 -->
        <q-tab-panel name="Cebuana">
            <q-btn color="primary" class="text-black q-mt-md full-width" label="View Cash-In Request"  />

            <q-card class="my-card bg-accent q-mt-md" flat >
            <q-card-section horizontal>
                <q-card-section>
                <div class="text-caption">Send a minumum amount of <span class="text-h6 q-ml-sm">200.00</span> to any person below.</div>
                </q-card-section>

                <q-card-section class="col-5 flex flex-center">
                    <q-avatar size="20vw">
                        <img src="~assets/cebuana.png">
                    </q-avatar>
                </q-card-section>
            </q-card-section>
            <q-list class="bg-white text-accent text-center">
                <q-item>
                    <q-item-section>
                        <span class="text-weight-bolder">JOHN A. DOE</span>
                        Address: <br>
                        Phone: <br>
                    </q-item-section>
                </q-item>
                <q-separator spaced />
                <q-item>
                    <q-item-section>
                        <span class="text-weight-bolder">JOHN A. DOE</span>
                        Address: <br>
                        Phone: <br>
                    </q-item-section>
                </q-item>
            </q-list>
            <q-list class="text-white text-center">
                <q-item>
                    <q-item-section>
                        Fill the control number, amount, sender, receiver in the form below.
                    </q-item-section>
                </q-item>
                <q-separator />
                <q-item>
                    <q-item-section>
                        Attach the receipt in the attachment field.
                    </q-item-section>
                </q-item>
            </q-list>
            </q-card>

            <div>
                <h6 class="text-seondary text-center text-weight-bolder q-mb-md">Deposit Form</h6>
                <q-input v-model="cashInAmount" type="number" color="dark" label="Amount" dark standout class="text-capitalize"/>
                <br>
                <q-input v-model="senderName" type="text" color="dark" label="Sender Name" dark standout class="text-capitalize"/>
                <br>
                <q-select standout dark v-model="receiverName" :options="recieverOptions" label="Reciever Name" />
                <br>
                <q-input v-model="transactionNumber" type="text" color="dark" label="Control No." dark standout class="text-capitalize"/>
                <br>
                <span class="text-caption">Photo of the actual receipt</span>
                <q-input v-model="attachment" type="file" color="dark" dark standout class="text-capitalize"/>
                <br>
                <q-input v-model="notes" type="textarea" color="dark" label="Notes" dark standout class="text-capitalize"/>
                <br>
                <q-btn color="primary" class="text-black q-mt-md full-width" :label="`Submit ${tab}`"  />
            </div>
            <br><br><br>
        </q-tab-panel>

        <q-tab-panel name="ML">
            <q-btn color="primary" class="text-black q-mt-md full-width" label="View Cash-In Request"  />
        <div class="text-h6 text-center q-mt-md"> NOT YET AVAILABLE</div>
        
        </q-tab-panel>
    </q-tab-panels>

    </div>
  </q-page>
</template>

<script>
export default {
    data(){
        return {
            tab: 'GCASH',
            cashInAmount: 0,
            senderName: '',
            receiverName: '',
            transactionNumber: '',
            attachment: null,
            notes: '',
            recieverOptions: [
                'JOHN A. DOE',
                'JANE A. DOE'
            ]
        }
    }
}
</script>