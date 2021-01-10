<template>
  <table class="table tablesorter" :class="tableClass">
    <thead :class="theadClasses">
    <tr>
      <slot name="columns">
        <th v-for="column in columns" :key="column">{{column}}</th>
      </slot>
    </tr>
    </thead>
    <tbody :class="tbodyClasses">
    <tr v-for="(item, index) in data" :key="index">
      <slot :row="item">
        <td v-for="(column, index) in columns"
            :key="index"
            v-if="hasValue(item, column)">
            <router-link :to="{ path: 'search-customers', query: {id: itemValue(item, routeParamName)} }" v-if="routeColumnName && column.toLowerCase() === routeColumnName">{{itemValue(item, column)}}</router-link>
            <span v-else>{{itemValue(item, column)}}</span>
        </td>
        <td v-if="viewAction">
          <a href="#" v-on:click="viewOrderHistory(item.phone)">View Orders</a>
        </td>
      </slot>
    </tr>
    </tbody>
  </table>
</template>
<script>
  export default {
    name: 'base-table',
    props: {
      columns: {
        type: Array,
        default: () => [],
        description: "Table columns"
      },
      data: {
        type: Array,
        default: () => [],
        description: "Table data"
      },
      type: {
        type: String, // striped | hover
        default: "",
        description: "Whether table is striped or hover type"
      },
      theadClasses: {
        type: String,
        default: '',
        description: "<thead> css classes"
      },
      tbodyClasses: {
        type: String,
        default: '',
        description: "<tbody> css classes"
      },
      viewOrders: { type: Function },
      viewAction: {
        type: Boolean,
        default: false
      },
      routeColumnName: {
        type: String
      },
      routeParamName: {
        type: String
      }
    },
    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      }
    },
    methods: {
      hasValue(item, column) {
        return item[column.toLowerCase()] !== "undefined";
      },
      itemValue(item, column) {
        return item[column.toLowerCase()];
      },
      viewOrderHistory(customerID) {
        this.viewOrders(customerID)
      }
    }
  };
</script>
<style>
</style>
