<template>
  <q-page class="bg-white">
    <div class="q-pa-md row q-gutter-md">
        <q-card bordered class="my-card col column justify-between">
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon name="mdi-cash-100" style="font-size: 30px;" />
                    </q-item-section>
                    <q-item-section class="text-right"> 
                      <q-item-label caption>Current Networt</q-item-label>
                      <q-item-label class="text-h6">999,999 php</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-actions align="center"> 
                <q-btn color="black" class="full-width" label="VIEW DAILY NETWORT" outline/>
            </q-card-actions>
        </q-card>

        <q-card bordered class="my-card col column justify-between">
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon name="mdi-cash-100" style="font-size: 30px;" />
                    </q-item-section>
                    <q-item-section class="text-right"> 
                        <q-item-label caption>Monthly Networt</q-item-label>
                        <q-item-label class="text-h6">999,999 php</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-actions align="center"> 
                <q-btn color="black" class="full-width" label="VIEW MONTHLY NETWORT" outline/>
            </q-card-actions>
        </q-card>

        <q-card bordered class="my-card col column justify-between">
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon name="shopping_cart" style="font-size: 30px;" />
                    </q-item-section>
                    <q-item-section class="text-right"> 
                        <q-item-label caption>All Master Agent Commissions</q-item-label>
                        <q-item-label class="text-h6">999,999 php</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-actions align="center"> 
                <q-btn color="black" class="full-width" label="VIEW MASTER AGENTS" outline/>
            </q-card-actions>
        </q-card>

        <q-card bordered class="my-card col column justify-between">
            <q-card-section>
                <q-item>
                    <q-item-section avatar>
                        <q-icon name="shopping_cart" style="font-size: 30px;" />
                    </q-item-section>
                    <q-item-section class="text-right"> 
                        <q-item-label caption>All Agent Commissions</q-item-label>
                        <q-item-label class="text-h6">999,999 php</q-item-label>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-card-actions align="center"> 
                <q-btn color="black" class="full-width" label="VIEW AGENTS" outline/>
            </q-card-actions>
        </q-card>
    </div>
    <q-separator />
    <div class="q-pa-md row q-gutter-md">
            <q-card bordered class="my-card col column justify-between" style="height: 378px">
                <q-card-section class="col column justify-between">
                    <div><b>All Sales</b></div>
                    <q-select v-model="type" :options="optionstype" label="View Commissions" dense outlined/>
                </q-card-section>
                <q-card-section>
                    <apexcharts width="450" type="bar" :options="options" :series="series"></apexcharts>
                </q-card-section>
            </q-card>
            <q-card bordered class="my-card col column justify-between">
                <q-card-section>
                    <b>Sales Distribution Percentage</b>
                </q-card-section>
                <q-card-section class="my-card" bordered>
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
