<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 图片预览功能 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="30%">
      <img :src="imgURL" alt="#" />
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="imgDialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="imgDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <el-steps :active="active - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="active"
          :tab-position="'left'"
          :before-leave="jumpGuard"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_number">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="props"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyParams"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals" @change="showChange">
                <el-checkbox
                  :label="param"
                  v-for="(param, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyParams"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headers"
              list-type="picture"
              :on-success="onLoad"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- Two-way Data-Binding -->
            <quill-editor
              ref="myQuillEditor"
              v-model="addForm.goods_introduce"
            />
            <el-button type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 分类列表
      cateList: [],
      active: '0',
      addForm: {
        goods_name: '',
        goods_price: 1,
        goods_weight: 1,
        goods_number: 1,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      manyParams: [],
      onlyParams: [],
      fileList: [],
      headers: {
        Authorization: window.sessionStorage.getItem('token')
      },
      imgDialogVisible: false,
      imgURL: ''
    }
  },
  computed: {
    cateId: function() {
      if (this.addForm.goods_cat.length == 3) return this.addForm.goods_cat[2]
      else return null
    }
  },
  methods: {
    // 复选框发生改变
    showChange() {
      console.log(this.manyParams)
    },
    // tab标签点击事件
    async tabClick() {
      if (this.active == '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('商品参数值获取失败')
        }

        res.data.forEach(e => {
          e.attr_vals = !e.attr_vals ? [] : e.attr_vals.split(' ')
        })
        this.manyParams = res.data
        console.log(this.manyParams)
      } else if (this.active == '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' }
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('商品参数值获取失败')
        }

        this.onlyParams = res.data
        console.log(this.onlyParams)
      }
    },
    jumpGuard(to, from) {
      if (from == '0') {
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请先选择商品分类')
          return false
        }
      }
    },
    // 级联选择框钩子
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) this.addForm.goods_cat = []
    },
    // 查询分类参数列表
    async queryCates() {
      const { data: res } = await this.$http.get('/categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data
    },
    handleRemove(file, fileList) {
      const index = this.addForm.pics.findIndex(
        e => e.pic == file.response.tmp_path
      )
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm)
    },
    handlePreview(file) {
      this.imgURL = file.response.data.url
      this.imgDialogVisible = true
    },
    onLoad(response, file, fileList) {
      console.log(response)
      const picInfo = { pic: response.data.tmp_path }
      this.addForm.pics.push(picInfo)
    },
    // 添加商品
    addGoods() {
      this.$refs.addFormRef.validate(async v => {
        if (!v) return false
        const newForm = _.cloneDeep(this.addForm)
        newForm.goods_cat = newForm.goods_cat.join(',')
        this.manyParams.forEach(e => {
          const param = {
            attr_id: e.attr_id,
            attr_value: e.attr_vals.join(' ')
          }
          newForm.attrs.push(param)
        })
        this.onlyParams.forEach(e => {
          const param = {
            attr_id: e.attr_id,
            attr_value: e.attr_vals
          }
          newForm.attrs.push(param)
        })
        console.log(newForm)
        const { data: res } = await this.$http.post('/goods', newForm)
        if (res.meta.status !== 201) return this.$message.error('商品添加失败')
        this.$message.success('商品添加成功')
        this.$router.push('/goods')
      })
    }
  },
  created() {
    this.queryCates()
  }
}
</script>
<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.el-dialog {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
