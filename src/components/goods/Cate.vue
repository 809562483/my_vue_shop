<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="AddDialogVisible"
      width="30%"
      @close="closeAdd"
    >
      <el-form
        :model="AddForm"
        :rules="AddRules"
        ref="AddRoleForm"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="AddForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="select"
            :options="parentCate"
            :props="props"
            @change="handleChange"
            clearable
            style="width:100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAdd">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        class="treeTable"
        ref="catesTable"
        :data="catesList"
        :columns="columns"
        show-index
        index-text="#"
        :show-row-hover="false"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <template slot="cat_deleted" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="!scope.row.cat_deleted"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template slot="cat_level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level == 1" type="success"
            >二级</el-tag
          >
          <el-tag v-else type="warning">三级</el-tag>
        </template>

        <template slot="action" slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="editCate(scope.row)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="deleteCate(scope.row)"
            >删除</el-button
          >
        </template>
      </tree-table>
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
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      catesList: [],
      total: 0,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'cat_deleted'
        },
        {
          label: '排序',
          type: 'template',
          template: 'cat_level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'action'
        }
      ],
      AddForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },
      AddDialogVisible: false,
      AddRules: {
        cat_name: [
          { required: true, message: '请请输入分类名称', trigger: 'blur' }
        ]
      },
      select: [],
      parentCate: [],
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true
      }
    }
  },
  methods: {
    submitAdd() {
      this.$refs.AddRoleForm.validate(async v => {
        if (!v) return false
        const { data: res } = await this.$http.post('/categories', this.AddForm)
        if (res.meta.status !== 201) return this.$message.error('添加分类失败')
        this.$message.success('添加分类成功')
        this.queryCates()
        this.AddDialogVisible = false
      })
    },
    handleChange() {
      this.AddForm.cat_pid = this.select[this.select.length - 1]
      this.AddForm.cat_level = this.select.length
      console.log(this.AddForm)
    },
    async showAdd() {
      const { data: res } = await this.$http.get('/categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败')
      }
      this.parentCate = res.data
      this.AddDialogVisible = true
    },
    closeAdd() {
      this.$refs.AddRoleForm.resetFields()
      this.AddForm.cat_pid = 0
      this.AddForm.cat_level = 0
      this.select = []
    },
    async queryCates() {
      const { data: res } = await this.$http.get('/categories', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类列表获取失败')
      }
      this.catesList = res.data.result
      this.total = res.data.total
      console.log(this.catesList)
    },
    editCate() {
      this.$message.warning('功能暂未开发')
    },
    deleteCate() {
      this.$message.warning('功能暂未开发')
    },
    handleSizeChange(v) {
      this.queryParams.pagesize = v
      this.queryCates()
    },
    handleCurrentChange(v) {
      this.queryParams.pagenum = v
      this.queryCates()
    }
  },
  created() {
    this.queryCates()
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
