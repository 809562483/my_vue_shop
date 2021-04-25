<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="5">
          <el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            class="input-with-select"
            clearable
            @clear="queryGoods"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="jumpToAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="180">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="150">
        </el-table-column>
        <el-table-column label="创建时间" width="200">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteGoods(scope.row.goods_id)"
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
export default {
  data() {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      goodsList: [],
      total: 0
    }
  },
  methods: {
    // 跳转至商品添加界面
    jumpToAdd() {
      this.$router.push('/goods/add')
    },
    // 删除商品
    async deleteGoods(id) {
      const rs = await this.$confirm('确认删除此商品吗?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (rs !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('/goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除失败')
      this.$message.success('删除成功')
      this.queryGoods()
    },
    // pagesize发生改变
    handleSizeChange(v) {
      this.queryParams.pagesize = v
      this.queryGoods()
    },
    // pagenum发生改变
    handleCurrentChange(v) {
      this.queryParams.pagenum = v
      this.queryGoods()
    },
    async queryGoods() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.queryParams
      })
      if (res.meta.status !== 200)
        return this.$message.error('获取商品列表失败')
      this.goodsList = res.data.goods
      this.total = res.data.total
    }
  },
  created() {
    this.queryGoods()
  }
}
</script>
<style lang="less" scoped></style>
