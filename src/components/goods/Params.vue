<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加动态或者静态参数 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="dialogVisible"
      width="30%"
      @close="closeAdd"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="ruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改动态或者静态参数 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="modifydialogVisible"
      width="30%"
      @close="closemodify"
    >
      <el-form
        :model="modifyruleForm"
        :rules="rules"
        ref="modifyFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="modifyruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifydialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify">确 定</el-button>
      </span>
    </el-dialog>
    <el-card>
      <el-alert
        title="注意：只允许为第三级分类设置参数"
        type="warning"
        show-icon
      >
      </el-alert>
      <el-row>
        <el-col>
          选择商品分类：
          <el-cascader
            v-model="select"
            :options="allCates"
            :props="props"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleclick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button
                type="primary"
                size="mini"
                :disabled="controlDisabled"
                @click="dialogVisible = true"
                >添加参数</el-button
              >
            </el-col>
          </el-row>
          <el-table :data="manyParams" style="width: 100%" border>
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteAttrVal(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  class="tag-input"
                >
                </el-input>
                <el-button
                  v-else
                  size="small"
                  @click="showInputVisible(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="modifyAttr(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteAttr(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button
                type="primary"
                size="mini"
                :disabled="controlDisabled"
                @click="dialogVisible = true"
                >添加属性</el-button
              >
            </el-col>
          </el-row>
          <el-table :data="onlyParams" style="width: 100%" border>
            <el-table-column type="expand" width="50">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="deleteAttrVal(scope.row, i)"
                  >{{ item }}</el-tag
                >
                <el-input
                  v-if="scope.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInputRef"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                  class="tag-input"
                >
                </el-input>
                <el-button
                  v-else
                  size="small"
                  @click="showInputVisible(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="modifyAttr(scope.row)"
                  >修改</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteAttr(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      select: [],
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      allCates: [],
      activeName: 'many',
      manyParams: [],
      onlyParams: [],
      dialogVisible: false,
      rules: {
        attr_name: {
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }
      },
      ruleForm: {
        attr_name: ''
      },
      modifydialogVisible: false,
      modifyruleForm: {},
      // inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    showInputVisible(attr) {
      attr.inputVisible = true
      this.inputValue = ''
      this.$nextTick(_ => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    async handleInputConfirm(attr) {
      if (!this.inputValue.trim()) {
        attr.inputVisible = false
        return false
      } else {
        attr.attr_vals.push(this.inputValue.trim())
        const { data: res } = await this.$http.put(
          `/categories/${attr.cat_id}/attributes/${attr.attr_id}`,
          {
            attr_name: attr.attr_name,
            attr_sel: this.activeName,
            attr_vals: attr.attr_vals.join(' ')
          }
        )
        if (res.meta.status !== 200) {
          attr.inputVisible = false
          attr.attr_vals.pop()
          return this.$message.error('参数值添加失败')
        } else {
          attr.inputVisible = false
          return this.$message.success('参数值添加成功')
        }
      }
    },
    async deleteAttr(attr) {
      const rs = await this.$confirm('是否删除该参数？', '', {
        confirmButtonTest: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (rs == 'confirm') {
        const { data: res } = await this.$http.delete(
          `/categories/${attr.cat_id}/attributes/${attr.attr_id}`
        )
        if (res.meta.status !== 200) return this.$message.error('删除参数失败')
        this.$message.success('参数删除成功')
        this.queryParams()
      } else {
        return this.$message.info('已取消删除')
      }
    },
    async modifyAttr(attr) {
      const { data: res } = await this.$http.get(
        `/categories/${attr.cat_id}/attributes/${attr.attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('参数查询失败')
      }
      this.modifyruleForm = res.data
      this.modifydialogVisible = true
    },
    submitModify() {
      this.$refs.modifyFormRef.validate(async v => {
        if (!v) return false
        console.log(this.modifyruleForm)
        const { data: res } = await this.$http.put(
          `categories/${this.modifyruleForm.cat_id}/attributes/${this.modifyruleForm.attr_id}`,
          {
            attr_name: this.modifyruleForm.attr_name,
            attr_sel: this.activeName,
            attr_vals: this.modifyruleForm.attr_vals
          }
        )
        if (res.meta.status !== 200) return this.$message.error('更新参数失败')
        this.$message.success('更新参数成功')
        this.queryParams()
        this.modifydialogVisible = false
      })
    },
    closemodify() {
      this.$refs.modifyFormRef.resetFields()
    },
    submitAdd() {
      this.$refs.ruleFormRef.validate(async v => {
        if (!v) return false
        const { data: res } = await this.$http.post(
          `categories/${this.select[2]}/attributes`,
          {
            attr_name: this.ruleForm.attr_name,
            attr_sel: this.activeName
          }
        )
        if (res.meta.status !== 201) return this.$message.error('添加参数失败')
        this.$message.success('参数添加成功')
        this.queryParams()
        this.modifydialogVisible = false
      })
    },
    handleChange() {
      this.manyParams = []
      this.onlyParams = []
      if (this.select.length !== 3) {
        this.select = []
        return false
      }
      this.queryParams()
    },
    async queryCates() {
      const { data: res } = await this.$http.get('/categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类列表获取失败')
      }
      this.allCates = res.data
    },
    handleclick() {
      this.manyParams = []
      this.onlyParams = []
      if (this.select.length !== 3) return false
      console.log(this.activeName)
      this.queryParams()
    },
    async queryParams() {
      const { data: res } = await this.$http.get(
        `/categories/${this.select[2]}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类列表获取失败')
      }
      console.log(res.data)
      res.data.forEach(e => {
        e.attr_vals = e.attr_vals === '' ? [] : e.attr_vals.split(' ')
        e.inputVisible = false
      })
      if (this.activeName === 'many') this.manyParams = res.data
      else this.onlyParams = res.data
    },
    async deleteAttrVal(cate, index) {
      cate.attr_vals.splice(index, 1)
      const { data: res } = await this.$http.put(
        `categories/${cate.cat_id}/attributes/${cate.attr_id}`,
        {
          attr_name: cate.attr_name,
          attr_sel: cate.attr_sel,
          attr_vals: cate.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除该参数的值失败')
      }
      this.$message.success('删除该参数的值成功')
    },
    closeAdd() {
      this.$refs.ruleFormRef.resetFields()
    }
  },
  created() {
    this.queryCates()
  },
  computed: {
    controlDisabled: function() {
      if (this.select.length === 3) return false
      else return true
    },
    titleText() {
      return this.activeName === 'many' ? '动态参数' : '静态属性'
    }
  }
}
</script>
<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}
.el-tag {
  margin: 0 7px;
}
.tag-input {
  width: 150px;
}
</style>
