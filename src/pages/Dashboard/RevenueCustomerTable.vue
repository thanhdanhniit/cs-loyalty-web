<template>
  <base-table :data="revenueCustomerTable.data"
              :columns="revenueCustomerTable.columns"
              route-column-name="name"
              route-param-name="phone"
              thead-classes="text-primary">
  </base-table>
</template>
<script>
  import { BaseTable } from "@/components";
  import config from '@/config';
  import axios from "axios";
  import util from '@/commonUtils';

  export default {
    components: {
      BaseTable
    },
    props: ['timeRange'],
    data() {
      return {
        revenueCustomerTable: {
          columns: ["Name", "Total", "Count", "District"] ,
          data: [],
        }
      }
    },
    computed: {
    },
    methods: {
      fetchData() {
        if (this.timeRange) {
          const timeTS = this.timeRange.split('&');

          axios
          .get(`${config.api.url}/dashboard/topPurchasedCustomers?start=${timeTS[0]}&end=${timeTS[1]}`)
          .then(response => {
            if(response.data.data) {
              let results = [];
              response.data.data.forEach(element => {
                results.push({name: element.Name, count: element.Count, district: element.District, phone: element.Phone, total: util.formatToShortPrice(element.Total)})
              });

              this.revenueCustomerTable.data = results;
            }
          });
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
