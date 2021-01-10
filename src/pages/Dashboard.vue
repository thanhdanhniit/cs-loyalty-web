<template>
  <div>
    <div class="row">
      <div class="col-lg-6 col-md-12" :class="{'text-right': isRTL}">
        <card type="chart">
          <template slot="header">
            <h5 class="card-category">{{$t('dashboard.totalRevenue')}}</h5>
            <h3 class="card-title"><i class="tim-icons icon-bell-55 text-primary "></i> {{totalRevenueStr}}</h3>
          </template>
          <div class="chart-area">
            <line-chart style="height: 100%"
                        v-if="loaded"
                        :chart-data="chartdata"
                        :gradient-stops="revenueLineChartOpts.gradientStops"
                        :extra-options="revenueLineChartOpts.extraOptions"
                        chart-id="revenue-line-chart">
            </line-chart>
          </div>
        </card>
      </div>

    </div>
    
    <div class="row">
      <div class="col-lg-6 col-md-12">
        <card class="card" :header-classes="{'text-right': isRTL}">
          <h4 slot="header" class="card-title">{{$t('dashboard.revenueCustomerTable')}}</h4>
          <div class="table-responsive" style="max-height:465px;">
            <revenue-customer-table></revenue-customer-table>
          </div>
        </card>
      </div>

      <div class="col-lg-6 col-md-12">
        <card class="card" :header-classes="{'text-right': isRTL}">
          <h4 slot="header" class="card-title">{{$t('dashboard.revenueTable')}}</h4>
          <div class="table-responsive" style="max-height:480px;">
            <revenue-table></revenue-table>
          </div>
        </card>
      </div>
    </div>

  </div>
</template>
<script>
  import LineChart from '@/components/Charts/LineChart';
  import * as chartConfigs from '@/components/Charts/config';
  import RevenueTable from './Dashboard/RevenueTable';
  import RevenueCustomerTable from './Dashboard/RevenueCustomerTable';

  import config from '@/config';
  import axios from "axios"

  export default {
    components: {
      LineChart,
      RevenueTable,
      RevenueCustomerTable
    },
    data() {
      return {
        loaded: false,
        chartdata: null,
        totalRevenueStr: '',

        revenueLineChartOpts: {
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.2, 0],
        },
      }
    },
    computed: {
     isRTL() {
        return this.$rtl.isRTL;
      },
    },
    methods: {
      formatToMillion (labelValue) {
        return labelValue / 1000000
      },
      formatPrice (labelValue) {
        // Nine Zeroes for Billions
        return Math.abs(Number(labelValue)) >= 1.0e+9
    
        ? Math.abs(Number(labelValue)) / 1.0e+9 + "B"
        // Six Zeroes for Millions 
        : Math.abs(Number(labelValue)) >= 1.0e+6
    
        ? Math.abs(Number(labelValue)) / 1.0e+6 + "M"
        // Three Zeroes for Thousands
        : Math.abs(Number(labelValue)) >= 1.0e+3
    
        ? Math.abs(Number(labelValue)) / 1.0e+3 + "K"
    
        : Math.abs(Number(labelValue));
      }, 
    },
    async mounted() {
      this.i18n = this.$i18n;
      
      this.loaded = false
      try {
        let result = await axios.get(`${config.api.url}/dashboard/revenueByMonth`);

        let priceData = [];
        let totalRevenue = 0.0;
        result.data.data.forEach(e => {
          totalRevenue += e;
          priceData.push(this.formatToMillion(e))
        });
        this.totalRevenueStr = this.formatPrice(totalRevenue);

        this.chartdata = {
          labels: result.data.labels,
          datasets: [{
            label: "Data",
            fill: true,
            borderColor: config.colors.primary,
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: config.colors.primary,
            pointBorderColor: 'rgba(255,255,255,0)',
            pointHoverBackgroundColor: config.colors.primary,
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 4,
            data: priceData,
          }]
        };

        this.loaded = true
      } catch (e) {
        console.error(e)
      }

    },
    beforeDestroy() {
      if (this.$rtl.isRTL) {
        this.i18n.locale = 'en';
        this.$rtl.disableRTL();
      }
    }
  };
</script>
<style>
</style>
