<template>
  <div>
    <div class="btn-toolbar">
      <div class="btn-group">
      <base-dropdown :title="quater.label" title-classes="btn btn-info" >
        <a class="dropdown-item" v-for="item in quaters" :key="item.label" v-on:click="quarterChange({label: item.label, value: item.value})">
          {{item.label}}
        </a>
        <div class="dropdown-divider"></div>
        <a class="dropdown-item" v-on:click="quarterChange({label: 'All', value: getWholeCurrentYearTS()})">All</a>
      </base-dropdown>
      <span class="invisible">i</span>

      <base-dropdown :title="yearTitle" title-classes="btn btn-success">
        <a class="dropdown-item" v-for="item in getYears()" :key="item" v-on:click="yearChange(item)">{{item}}</a>
      </base-dropdown>
      </div>

      <div class="float-right">
       <base-button type="primary" style="margin-top: 0px; position: absolute; right: 15px;" v-on:click="updateRevenueChart">Apply</base-button>
      </div>
    </div>
    
    <p></p>

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
        quater: {
          label: 'Quarter',
          value: '',
        },
        yearTitle: new Date().getFullYear().toString(),

        revenueLineChartOpts: {
          extraOptions: chartConfigs.purpleChartOptions,
          gradientColors: config.colors.primaryGradient,
          gradientStops: [1, 0.2, 0],
        },
        quaters: {
          quater1: {
            label: 'Quater 1',
            value: '@year-01-01 00:00:00&@year-03-31 23:59:59'
          },
          quater2: {
            label: 'Quater 2',
            value: '@year-04-01 00:00:00&@year-06-30 23:59:59'
          },
          quater3: {
            label: 'Quater 3',
            value: '@year-07-01 00:00:00&@year-09-30 23:59:59'
          },
          quater4: {
            label: 'Quater 4',
            value: '@year-10-01 00:00:00&@year-12-31 23:59:59'
          },
        }
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
      quarterChange(item) {
        item.value = item.value.replaceAll('@year', this.yearTitle);
        this.quater = item;
      },
      yearChange(value) {
        this.quater.value = this.quater.value.replaceAll(this.yearTitle, value.toString());
        this.yearTitle = value.toString();
      },
      getYears() {
        let years = [];
        const currentYear = new Date().getFullYear();
        for (let i = currentYear - 2; i <= currentYear; i++) {
          years.push(i);
        }
        return years;
      },
      getWholeCurrentYearTS() {
        return `@year-01-01 00:00:00&@year-12-31 23:59:59`;
      },
      renderRevenueChart(result) {
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
      },
      async updateRevenueChart() {
        this.loaded = false
        try {
          const timeTS = this.quater.value.split('&');
          let result = await axios.get(`${config.api.url}/dashboard/revenueByMonth?start=${timeTS[0]}&end=${timeTS[1]}`);
          this.renderRevenueChart(result);
        } catch (e) {
          console.error(e)
        }
      }
    },
    async mounted() {
      this.i18n = this.$i18n;

      //get current quarter
      const today = new Date();
      const quarter = Math.floor((today.getMonth() + 3) / 3);
      let currentQuarter = this.quaters[`quater${quarter}`];
      this.quarterChange(currentQuarter);
      
      this.updateRevenueChart();
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
