<style scoped>
.demo-table-expand {
    font-size: 0;
  }
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input :placeholder="$t('openstack.instance_name')" v-model="name" style="width: 200px;" class="filter-item"/>
    </div>
    <!-- Form -->

    <el-table
      v-loading="listLoading"
      :row-class-name="tableRowClassName"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;">
      <!-- el-table-column  type="selection" width="55"/-->
      <el-table-column :label="$t('table.id')" prop="id" sortable="custom" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.Labels.alertname }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.date')" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.activeAt | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.title')" min-width="150px">
        <template slot-scope="scope">
          <span> {{ scope.row.Annotations.description }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.title')" min-width="150px">
        <template slot-scope="scope">
          <span> {{ scope.row.State }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<style>
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
</style>

<script>
import { getAlerts, getList, getNetworks, getFlavor, getKey, getZone, createServer, getImage } from '@/api/osinstance'

export default {
  data() {
    return {
      list: [],
      networklist: [],
      flavorlist: [],
      keylist: [],
      zonelist: [],
      imagelist: [],
      name: '',
      rules: {
        Name: [{ required: true, message: '请输入中文姓名', trigger: 'blur' }]
        // Email: [{ required: true, message: '请输入公司邮箱', trigger: 'blur' }]
      },
      listLoading: false,
      search: '',
      networkid: '',
      instancename: '',
      jsonlist: null,
      instance: {
        name: '',
        image: '',
        network: '',
        flavor: '',
        subnet: '',
        port: '',
        key: '',
        zone: '',
        count: ''
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      postdata: { 'Name': '', 'Email': '', 'dept': '', 'post': '', 'IP': '', 'MAC': '', 'src': '' }
    }
  },
  watch: {
    name(newname) {
      if (newname === '') {
        this.list = this.jsonlist
      } else {
        this.list = []
        for (const x in this.jsonlist) {
          if (this.jsonlist[x].Name.indexOf(newname) !== -1) {
            this.list.push(this.jsonlist[x])
          }
        }
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    createInstance(instance) {
      createServer(instance).then(response => {
        this.$message({
          message: response.data,
          type: 'success'
        })
        this.dialogFormVisible = false
        console.log(instance)
        getList().then(response => {
          this.jsonlist = response.data
          this.list = this.jsonlist
          this.listLoading = false
        })
      })
    },
    fetchData() {
      this.listLoading = true
      getAlerts().then(response => {
        this.jsonlist = response.data
        this.list = this.jsonlist
        console.log(this.list)
        this.listLoading = false
      })
    },
    getData() {
      this.dialogFormVisible = true
      this.listLoading = true
      getNetworks().then(response => {
        this.networklist = response.data
      })
      getFlavor().then(response => {
        this.flavorlist = response.data
      })
      getKey().then(response => {
        this.keylist = response.data
      })
      getZone().then(response => {
        this.zonelist = response.data
      })
      getImage().then(response => {
        this.imagelist = response.data
      })
    },
    getServer(row) {
      this.$router.push({
        name: 'Hypervisor',
        params: {
          id: row.ID
        }
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.Labels.severity == 'critical') {
        return 'warning-row'
      } else if (row.Labels.severity == 'warning') {
        return 'success-row'
      }
      return ''
    },
    editipinfo(update) {
      this.dialogFormVisible = true
      this.postdata = update
      this.postdata.src = 'WEB'
    },
    upipinfo(postdata) {
      this.$refs[postdata].validate((valid) => {
        if (valid) {
          this.dialogFormVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearinfo(cleardata) {
      this.$confirm('此操作将清除' + cleardata.IP + '的用户信息，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.postdata = cleardata
        this.postdata.Name = ''
        this.postdata.Email = ''
        this.postdata.dept = ''
        this.postdata.post = ''
        this.postdata.src = 'Clear'
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
