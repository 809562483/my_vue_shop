<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 订单地址修改 -->
    <el-dialog
      title="修改地址"
      :visible.sync="modifyDialogVisible"
      @close="closeModify"
      ref="ruleForm"
      label-width="100px"
      width="30%"
    >
      <el-form
        :model="modifyForm"
        ref="modifyFormRef"
        :rules="modifyRules"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="location">
          <el-cascader
            v-model="modifyForm.location"
            :options="options"
            :props="props"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="details">
          <el-input v-model="modifyForm.details"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 订单地址查看 -->
    <el-dialog title="物流进度" :visible.sync="showDialogVisible" width="30%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in wuliu"
          :key="index"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>

      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="showDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            class="input-with-select"
            clearable
            @clear="queryOrders"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryOrders"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="ordersList" border stripe>
        <el-table-column type="index" width="50px"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格"
          width="100px"
        ></el-table-column>
        <el-table-column label="是否付款" width="100px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.order_pay == '0'">
              未付款
            </el-tag>
            <el-tag type="success" v-else>
              已付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          width="100px"
        ></el-table-column>
        <el-table-column label="下单时间" width="250px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="modifyDialogVisible = true"
            ></el-button>
            <el-button
              type="success"
              size="mini"
              icon="el-icon-location"
              @click="showInfo(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[2, 4, 5, 10]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
import citydata from './citydata'
export default {
  data() {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      ordersList: [],
      total: 0,
      modifyDialogVisible: false,
      modifyForm: {
        location: [],
        details: ''
      },
      modifyRules: {
        location: [
          { required: true, message: '请输入省市县', trigger: 'blur' }
        ],
        details: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      props: {
        expandTrigger: 'hover'
      },
      options: citydata,
      showDialogVisible: false,
      wuliu: []
    }
  },
  methods: {
    closeModify() {
      this.$refs.modifyFormRef.resetFields()
    },
    // 查询订单列表
    async queryOrders() {
      const { data: res } = await this.$http.get('/orders', {
        params: this.queryParams
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // pagesize发生改变
    handleSizeChange(v) {
      this.queryParams.pagesize = v
      this.queryOrders()
    },
    // pagenum发生改变
    handleCurrentChange(v) {
      this.queryParams.pagenum = v
      this.queryOrders()
    },
    // 展示物流信息
    async showInfo(v) {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')

      if (res.meta.status !== 200)
        return this.$message.error('物流信息查询失败')
      console.log(res)
      this.wuliu = res.data
      this.showDialogVisible = true
    }
  },
  created() {
    this.queryOrders()
  }
}
</script>
<style lang="less" scoped></style>
