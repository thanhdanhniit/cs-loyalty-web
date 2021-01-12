<template>
  <base-table :data="revenueTable.data"
              :columns="revenueTable.columns"
              thead-classes="text-primary">
  </base-table>
</template>
<script>
  import { BaseTable } from "@/components";
  import config from '@/config';
  import axios from "axios";

  export default {
    components: {
      BaseTable
    },
    props: ['initTimeRange', 'timeRange'],
    data() {
      return {
        revenueTable: {
          columns: ["District", "Total"] ,
          data: [],
        }
      }
    },
    computed: {
    },
    methods: {
      formatPrice(price) {
        if (price && price > 0) {
          return  price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        }
        return price;
      },
      fetchData() {
        if (this.timeRange) {
          const timeTS = this.timeRange.split('&');

          axios
          .get(`${config.api.url}/dashboard/revenueByDistrict?start=${timeTS[0]}&end=${timeTS[1]}`)
          .then(response => {
            if(response.data.data) {
              let results = [];
              response.data.data.forEach(element => {
                results.push({district: element.District, total: this.formatPrice(element.Total)})
              });

              this.revenueTable.data = results;
            }
          })
        }
      }
    },
    mounted() {
      this.$watch('timeRange', (newVal, oldVal) => {
        if (newVal) {
          console.log("timeRange-change", newVal);
          this.fetchData();
        }
      });

      this.fetchData();
    },
  }
</script>
<style>
</style>
