<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="10">
        <el-col :span="6"
          ><el-input
            placeholder="请输入内容"
            v-model="queryParams.query"
            class="input-with-select"
            clearable
            @clear="queryUsers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="queryUsers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6"
          ><div class="grid-content bg-purple">
            <el-button type="primary" @click="dialogVisible = true"
              >添加用户</el-button
            >
          </div></el-col
        >
      </el-row>
      <!-- 新增用户 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        @close="closeDialog"
      >
        <el-form
          :model="userForm"
          :rules="rules"
          ref="userFormRef"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="userForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="userForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="userForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="userForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="modifyDialogVisible"
        width="30%"
        @close="closeModify"
      >
        <el-form
          :model="modifyForm"
          :rules="modifyRules"
          ref="modifyUserForm"
          label-width="100px"
        >
          <el-form-item label="用户名">
            <el-input v-model="modifyForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="modifyForm.email"></el-input>
          </el-form-item>
          <el-form-item label="用手机" prop="mobile">
            <el-input v-model="modifyForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modifyDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitModify">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户角色授权 -->
      <el-dialog
        title="分配角色"
        :visible.sync="giveRoleDialogVisible"
        width="30%"
        @close="closeGiveRole"
      >
        <p>
          当前的用户：<span>{{ nowuser.username }}</span>
        </p>

        <p>
          当前的角色：<span>{{ nowuser.role_name }}</span>
        </p>
        <p>
          分配新角色：<el-select
            v-model="select"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option
              :label="item.roleName"
              :value="item.id"
              v-for="item in options"
              :key="item.id"
            ></el-option>
          </el-select>
        </p>
        <span slot="footer" class="dialog-footer">
          <el-button @click="giveRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitGiveRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户展示 -->
      <el-table :data="tableData" style="width: 100%" border stripe>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="info">
            <el-switch
              v-model="info.row.mg_state"
              @change="modifyStatus(info.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="175px">
          <template slot-scope="info">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="modifyUser(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteUser(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-s-tools"
                size="mini"
                @click="openGiveRole(info.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="pageSizes"
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
  data: function() {
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
      if (!regEmail.test(value)) {
        return cb(new Error('邮箱格式不符合规则'))
      } else cb()
    }
    var checkMobile = (rule, value, cb) => {
      const regPhone = /^1[3|4|5|7|8]\d{9}$/
      if (!regPhone.test(value)) {
        return cb(new Error('手机号格式不符合规则'))
      } else cb()
    }
    return {
      tableData: [],
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      total: 0,
      pageSizes: [1, 2, 4, 5],
      dialogVisible: false,
      userForm: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      modifyDialogVisible: false,
      modifyForm: {},
      modifyRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      giveRoleDialogVisible: false,
      nowuser: {},
      select: '',
      options: []
    }
  },
  methods: {
    async openGiveRole(user) {
      this.nowuser = user
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200)
        return this.$message.error('角色列表获取失败')
      this.options = res.data
      this.giveRoleDialogVisible = true
    },
    closeGiveRole() {
      this.select = ''
      this.nowuser = {}
    },
    async submitGiveRole() {
      console.log(this.select)
      const { data: res } = await this.$http.put(
        `/users/${this.nowuser.id}/role`,
        {
          rid: this.select
        }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败')
      }
      this.$message.success('分配角色成功')
      this.queryUsers()
      this.giveRoleDialogVisible = false
    },
    async queryUsers() {
      const { data: res } = await this.$http.get('/users', {
        params: this.queryParams
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.tableData = res.data.users
      this.total = res.data.total
    },
    async modifyStatus(user) {
      const { data: res } = await this.$http.put(
        `/users/${user.id}/state/${user.mg_state}`
      )
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state
        return this.$message.error('用户状态修改失败')
      }
      this.$message.success('用户状态修改成功')
      this.queryUsers()
    },
    handleSizeChange(pgsize) {
      this.queryParams.pagesize = pgsize
      this.queryUsers()
    },
    handleCurrentChange(currpg) {
      this.queryParams.pagenum = currpg
      this.queryUsers()
    },
    closeDialog() {
      this.$refs.userFormRef.resetFields()
    },
    addUser() {
      this.$refs.userFormRef.validate(async v => {
        if (!v) return false
        const { data: res } = await this.$http.post('/users', this.userForm)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          this.dialogVisible = false
          this.queryUsers()
        }
      })
    },
    async modifyUser(id) {
      const { data: res } = await this.$http.get(`/users/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('用户信息获取失败')
      }
      this.modifyForm = res.data
      this.modifyDialogVisible = true
    },
    submitModify() {
      this.$refs.modifyUserForm.validate(async v => {
        if (!v) {
          return false
        }
        const { data: res } = await this.$http.put(
          `/users/${this.modifyForm.id}`,
          {
            email: this.modifyForm.email,
            mobile: this.modifyForm.mobile
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('用户信息更新失败')
        } else {
          this.$message.success('用户信息更新成功')
          this.modifyDialogVisible = false
          this.queryUsers()
        }
      })
    },
    closeModify() {
      this.$refs.modifyUserForm.resetFields()
    },
    deleteUser(id) {
      this.$confirm('是否删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`/users/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.queryUsers()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.queryUsers()
  }
}
</script>
<style lang="less" scoped></style>
