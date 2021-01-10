<template>
  <base-table :data="revenueCustomerTable.data"
              :columns="revenueCustomerTable.columns"
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
      }
    },
    mounted() {
      axios
      .get(`${config.api.url}/dashboard/topPurchasedCustomers`)
      .then(response => {
        if(response.data.data) {
          let results = [];
          response.data.data.forEach(element => {
            results.push({name: element.Name, count: element.Count, district: element.District, total: this.formatPrice(element.Total)})
          });

          this.revenueCustomerTable.data = results;
        }
      })
    },
  }
</script>
<style>
</style>
