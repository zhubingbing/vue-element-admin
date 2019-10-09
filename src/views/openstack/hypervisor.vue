<template>
  <div class="dashboard-editor-container">
    <div class="containers">
      <dl>
        <dt>Name</dt>
        <dd>{{ list.name }}</dd>
      </dl>
    </div>
    <panel-group @handleSetLineChartData="handleSetLineChartData"/>

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData"/>
    </el-row>
  </div>
</template>

<script>

import { getServer } from '@/api/osinstance'
import LineChart from './components/LineChart'


const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'DashboardAdmin',
  components: {
    LineChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      id: this.$route.params.id,
      list: {},
      listLoading: false,
    }
  },
  created() {
    this.fetchData(this.id)
  },
  methods: {
    fetchData(id) {
      console.log(id)
      this.listLoading = true
      getServer(id).then(response => {
        this.list = response.data
        console.log(response.data)
        this.listLoading = false
      })
    },
    
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
