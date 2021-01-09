import { Line, mixins } from 'vue-chartjs';
import * as chartConfigs from '@/components/Charts/config';
import config from '@/config';
import axios from "axios"

export default {
  name: 'line-chart',
  extends: Line,
  mixins: [mixins.reactiveProp],
  props: {
    extraOptions: Object,
    gradientColors: {
      type: Array,
      default: () => ['rgba(72,72,176,0.2)', 'rgba(72,72,176,0.0)', 'rgba(119,52,169,0)'],
      validator: val => {
        return val.length > 2;
      }
    },
    gradientStops: {
      type: Array,
      default: () => [1, 0.4, 0],
      validator: val => {
        return val.length > 2;
      }
    },
    apiUrl: String,
  },
  data() {
    return {
      ctx: null,
    };
  },
  methods: {
    updateGradients(chartData) {
      if(!chartData) return;
      const ctx = this.ctx || document.getElementById(this.chartId).getContext('2d');
      const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

      gradientStroke.addColorStop(this.gradientStops[0], this.gradientColors[0]);
      gradientStroke.addColorStop(this.gradientStops[1], this.gradientColors[1]);
      gradientStroke.addColorStop(this.gradientStops[2], this.gradientColors[2]);
      chartData.datasets.forEach(set => {
        set.backgroundColor = gradientStroke;
      });
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
    formatToMillion (labelValue) {
      return labelValue / 1000000
    },
    getDefaultData() {
      return {
        extraOptions: chartConfigs.purpleChartOptions,
        chartData: {
          labels: [],
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
            data: [],
          }]
        },
        gradientColors: config.colors.primaryGradient,
        gradientStops: [1, 0.2, 0],
      }
    }
  },
  mounted() {
    /*this.$watch('chartData', (newVal, oldVal) => {
      this.updateGradients(this.chartData);
      if (!oldVal) {
        this.renderChart(
          this.chartData,
          this.extraOptions
        );
      }
    }, { immediate: true });*/

    this.$watch('apiUrl', (newVal, oldVal) => {
      if (newVal) {
        console.log("newVal-api", newVal)
        console.log("oldVal-api", oldVal)

        let purpleLineChart = this.getDefaultData();

        axios
          .get(`${config.api.url}/dashboard/revenueByMonth`)
          .then(response => {
            if(response.data) {
              let priceData = [];
              response.data.data.forEach(e => {
                priceData.push(this.formatToMillion(e))
              })
              console.log(priceData)

              purpleLineChart.chartData.labels = response.data.labels;
              purpleLineChart.chartData.datasets[0].data = priceData;

              this.updateGradients(purpleLineChart.chartData);
              this.renderChart(
                purpleLineChart.chartData,
                purpleLineChart.extraOptions
              );
            }
          })
      }
    }, { immediate: true });

  }
};
