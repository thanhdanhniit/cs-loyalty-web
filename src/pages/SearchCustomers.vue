<template>
    <div class="row">
      <div class="col-12">
        <card >
        <base-input 
                  type="input"
                  v-model="searchTerm"
                  placeholder="input name or phone of customer to search">
        </base-input>
        <base-button type="primary" v-on:click="searchCustomers">Search</base-button>
        </card>
      </div>

      <div class="col-12">
        <card :title="table1.title">
          <div class="table-responsive" style="max-height:350px;">
            <base-table :data="table1.data"
                        :columns="table1.columns"
                        :viewOrders="viewOrders"
                        :viewAction="true"
                        thead-classes="text-primary">
            </base-table>
          </div>
        </card>
      </div>

      <div class="col-12" v-if="table2.data.length > 0">
        <card class="card-plain">
          <div class="text-primary" style="text-transform: uppercase">{{table2.customerName}} - Order History</div>
          <div class="text-info" style="text-transform: uppercase">Purchased times: {{table2.data.length}} - {{table2.total}}</div>

          <div class="table-full-width table-responsive">
            <base-table :title="table2.title" :sub-title="table2.subTitle" :data="table2.data"
                         :columns="table2.columns">

            </base-table>
          </div>
        </card>
      </div>

    </div>
</template>
<script>
import { BaseTable } from "@/components";
import axios from "axios"
import moment from "moment"
import config from '@/config';

const tableColumns = ["Name", "Phone"];
const historyColumns = ["Date", "Cod", "Status"]

export default {
  components: {
    BaseTable
  },
  data() {
    return {
      searchTerm: '',
      table1: {
        title: "Customer List",
        columns: [...tableColumns],
        data: []
      },
      table2: {
        total: '',
        columns: [...historyColumns],
        customerName: '',
        data: []
      }
    };
  },
  methods: {
    searchCustomers(event) {
      if (event) {
        event.preventDefault()
      }
      
      axios
      .get(`${config.api.url}/customers?term=${this.searchTerm}`)
      .then(response => {
        if(response.data.data) {
          let customers = [];
          response.data.data.forEach(element => {
            customers.push({id: element.ID, name: element.Name, phone: element.PhoneNumber})
          });

          this.table1.data = customers;
        }
      })

      //reset input
      this.searchTerm = '';
      this.table2.data = [];
    },
    viewOrders (customerID) {
      // get customer name
      let customers = this.table1.data.filter(e => {
        return e.phone == customerID;
      })
      this.table2.customerName = customers ? customers[0].name : '';

      axios
      .get(`${config.api.url}/customers/${customerID}/orders`)
      .then(response => {
        if(response.data.data) {
          let orders = [];
          let totalPrice = 0.0;

          response.data.data.forEach(element => {
            totalPrice += element.Cod;
            orders.push({name: element.OrderNo, cod: this.formatPrice(element.Cod), date: this.convertDate(element.ConfirmedDate) ,status: element.Status});
          });

          this.table2.total = this.formatPrice(totalPrice);
          this.table2.data = orders;
        }
      })
    },
    convertDate(dateTS) {
      var dateStr = '';

      if (dateTS && dateTS.Valid) {
        dateStr = moment(dateTS.Time).format('DD/MM/YYYY')
      }
      return dateStr;
    },
    formatPrice(price) {
      if (price && price > 0) {
       return  price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
      }
      return price;
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.searchTerm = this.$route.query.id;
      this.searchCustomers();
    }
  }
};
</script>
<style>
</style>
