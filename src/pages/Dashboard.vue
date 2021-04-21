<template>
  <q-page class="bg-dark">
    <div class="q-pa-md row q-gutter-md">
        <q-card bordered class="bg-secondary text-white my-card col column justify-between">
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon name="mdi-cash-100" style="font-size: 30px;" />
                    </q-item-section>
                    <q-item-section class="text-right text-white"> 
                      <q-item-label caption class="text-white">Current Networt</q-item-label>
                      <q-item-label class="text-h6">999,999 php</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-actions align="center"> 
                <q-btn color="white" class="full-width" label="VIEW DAILY NETWORT" outline/>
            </q-card-actions>
        </q-card>

        <q-card bordered class="bg-secondary text-white my-card col column justify-between">
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon name="mdi-cash-100" style="font-size: 30px;" />
                    </q-item-section>
                    <q-item-section class="text-white text-right"> 
                        <q-item-label caption class="text-white">Monthly Networt</q-item-label>
                        <q-item-label class="text-h6 ">999,999 php</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-actions align="center"> 
                <q-btn color="white" class="full-width" label="VIEW MONTHLY NETWORT" outline/>
            </q-card-actions>
        </q-card>

        <q-card bordered class="bg-secondary text-white my-card col column justify-between">
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon name="mdi-cash-100" style="font-size: 30px;" />
                    </q-item-section>
                    <q-item-section class="text-white text-right"> 
                        <q-item-label caption class="text-white">Monthly Networt</q-item-label>
                        <q-item-label class="text-h6 ">999,999 php</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-actions align="center"> 
                <q-btn color="white" class="full-width" label="VIEW MONTHLY NETWORT" outline/>
            </q-card-actions>
        </q-card>

        <q-card bordered class="bg-secondary text-white my-card col column justify-between">
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon name="mdi-cash-100" style="font-size: 30px;" />
                    </q-item-section>
                    <q-item-section class="text-white text-right"> 
                        <q-item-label caption class="text-white">Monthly Networt</q-item-label>
                        <q-item-label class="text-h6 ">999,999 php</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-actions align="center"> 
                <q-btn color="white" class="full-width" label="VIEW MONTHLY NETWORT" outline/>
            </q-card-actions>
        </q-card>
    </div>
    <q-separator />
    <div class="q-pa-md row q-gutter-md">
            <q-card bordered class="bg-secondary  my-card col column justify-between" style="height: 378px">
                <q-card-section class="col column justify-between">
                    <div class="text-white"><b>All Sales</b></div>
                    <q-select dark color="white" label-color="white" v-model="type" :options="optionstype" label="View Commissions" dense outlined/>
                </q-card-section>
                <q-card-section>
                    <apexcharts width="450" type="bar" :options="options" :series="series"></apexcharts>
                </q-card-section>
            </q-card>
            <q-card bordered class="bg-secondary  my-card col column justify-between">
                <q-card-section>
                    <b  class="text-white">Sales Distribution Percentage</b>
                </q-card-section>
                <q-card-section class="my-card text-white" bordered>
                    <apexcharts width="450" type="donut" :options="optionsdonut" :series="seriesdonut"></apexcharts>
                </q-card-section>
            </q-card>
    </div>
  </q-page>
</template>

<script>
import VueApexCharts from 'vue-apexcharts'
import VueChart from 'vue-chart-js'
export default {  
    components:{
      VueChart,
      apexcharts: VueApexCharts,
    },  
    data () {
      return {
        type: "",
        optionstype: [
          'Agent', 'Master Agent', 'Company', 'IT Team'
        ],
        optionsdonut: {
          labels: ['Agent', 'Master Agent', 'Company', 'IT Team']
        },
        seriesdonut: [44, 55, 41, 17],
        options: {
          chart: {
            id: 'vuechart-example'
          },
          xaxis: {
            categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
          }
        },
        series: [{
          name: 'series-1',
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }]

      }
    }
  
}
</script>
