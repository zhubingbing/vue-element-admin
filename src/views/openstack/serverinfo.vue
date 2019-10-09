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
    <el-button type="text" @click="getData">创建实例Dialog</el-button>
    <el-dialog :visible.sync="dialogFormVisible" title="创建虚拟机">
      <el-form :model="instance">
        <el-form-item :label-width="formLabelWidth" label="虚拟机名称">
          <el-input v-model="instance.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="数量">
          <el-input v-model="instance.count" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="网络">
          <el-select v-model="instance.networkid" multiple placeholder="networkid">
            <el-option v-for="(items,index) in networklist" :key="index" :label="items.name" :value="items.id">
              <span>{{ items.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="flavor">
          <el-select v-model="instance.flavor" placeholder="flavor">
            <el-option v-for="(items,index) in flavorlist" :key="index" :label="items.name" :value="items.id">
              <span>{{ items.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="keyname">
          <el-select v-model="instance.key" placeholder="key">
            <el-option v-for="(items,index) in keylist" :key="index" :label="items.name" :value="items.name">
              <span>{{ items.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="zone">
          <el-select v-model="instance.zone" placeholder="zone name">
            <el-option v-for="(items,index) in zonelist" :key="index" :label="items.zoneName" :value="items.zoneName">
              <span>{{ items.zoneName }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="image">
          <el-select v-model="instance.image" placeholder="image name">
            <el-option v-for="(items,index) in imagelist" :key="index" :label="items.Name" :value="items.ID">
              <span>{{ items.Name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createInstance(instance)">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @row-click="getServer">
      <!-- el-table-column  type="selection" width="55"/-->
      <el-table-column type="expand" width="55" >
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item :label="$t('openstack.instance_name')">
              <span>{{ scope.row.Name }}</span>
            </el-form-item>
            <el-form-item :label="$t('openstack.id')">
              <span>{{ scope.row.ID }}</span>
            </el-form-item>
            <el-form-item :label="$t('openstack.image_name')">
              <span>{{ scope.row.Images.name }}</span>
            </el-form-item>
            <el-form-item :label="$t('openstack.status')">
              <span>{{ scope.row.Status }}</span>
            </el-form-item>
            <el-form-item :label="$t('openstack.attachvolume')">
              <span v-for="(item) in scope.row.Volume" :key="item.index"><strong>{{ item.name }}/{{ item.id }}</strong> {{ item.status }} on {{ item.device }} Size {{ item.size }}G  <br>AvailabilityZone {{ item.availability_zone }} volumeType {{ item.volume_type }}<br></span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column :label="$t('openstack.instance_name')" align="center" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.Name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('openstack.image_name')" sortable="custom" align="center" width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.Images.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('openstack.status')" sortable="custom" align="center" width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.Status }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('openstack.key')" sortable="custom" align="center" width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.key_name }}</span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('openstack.ip')" sortable="custom" align="left" >
        <template slot-scope="scope">
          <span v-for="(item, index) in scope.row.Addresses" :key="item.index"><strong>{{ index }}</strong> {{ item[0]['addr'] }}<br></span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('openstack.attachvolume')" sortable="custom" align="center" >
        <template slot-scope="scope">
          <span v-for="(item) in scope.row.Volume" :key="item.index"><strong>{{ item.id }}</strong> on {{ item.device }}<br></span>
        </template>
      </el-table-column>

      <el-table-column :label="$t('openstack.project')" sortable="custom" align="center" width="165">
        <template slot-scope="scope">
          <span>{{ scope.row.Project.name }}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { getList, getNetworks, getFlavor, getKey, getZone, createServer, getImage } from '@/api/osinstance'

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
      getList().then(response => {
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
