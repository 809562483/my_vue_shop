<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 编辑用户 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="modifyDialogVisible"
      width="30%"
      @close="closeModify"
    >
      <el-form
        :model="modifyForm"
        :rules="modifyRules"
        ref="modifyRoleForm"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="modifyForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="modifyForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModify">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 权限分配 -->
    <el-dialog
      title="权限分配"
      :visible.sync="modifyRoleDialogVisible"
      width="30%"
      @close="closeModifyRole"
    >
      <el-tree
        :data="allRolesList"
        :props="defaultProps"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="checkKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyRole">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 角色模块 -->
    <el-card class="box-card">
      <el-row>
        <el-col><el-button type="primary">添加角色</el-button></el-col>
      </el-row>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand"
          ><template slot-scope="info">
            <el-row
              :gutter="20"
              v-for="(role1, i1) in info.row.children"
              :key="role1.id"
              :class="['aligncenter', 'tag_bottom', i1 == 0 ? 'tag_top' : '']"
            >
              <el-col :span="5">
                <el-tag
                  closable
                  disable-transitions
                  @close="deleteThisRole(info.row, role1.id)"
                  >{{ role1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(role2, i2) in role1.children"
                  :key="role2.id"
                  :class="['aligncenter', i2 == 0 ? '' : 'tag_top']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      disable-transitions
                      @close="deleteThisRole(info.row, role2.id)"
                      >{{ role2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="role3 in role2.children"
                      :key="role3.id"
                      closable
                      disable-transitions
                      @close="deleteThisRole(info.row, role3.id)"
                      >{{ role3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template></el-table-column
        >
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="modifyRole(info.row.id)"
              >编辑</el-button
            >

            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteRole(info.row.id)"
              >删除</el-button
            >

            <el-button
              type="warning"
              icon="el-icon-s-tools"
              size="mini"
              @click="openRolesModify(info.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      modifyDialogVisible: false,
      modifyForm: {},
      modifyRules: {
        roleName: [
          { required: true, message: '请请输入角色名', trigger: 'blur' }
        ]
      },
      modifyRoleDialogVisible: false,
      allRolesList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      checkKeys: [],
      nowid: ''
    }
  },
  methods: {
    findkeys(node, arr) {
      if (!node.children) {
        arr.push(node.id)
        return 0
      }
      node.children.forEach(ele => this.findkeys(ele, arr))
    },
    async openRolesModify(role) {
      const { data: res } = await this.$http.get('/rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.nowid = role.id
      this.findkeys(role, this.checkKeys)
      this.allRolesList = res.data
      this.modifyRoleDialogVisible = true
    },
    closeModifyRole() {
      this.checkKeys = []
    },
    async submitModifyRole() {
      const rights = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$http.post(
        `roles/${this.nowid}/rights`,
        {
          rids: rights.join(',')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('授权失败')
      this.queryRoles()
      this.$message.success('授权成功')
      this.modifyRoleDialogVisible = false
    },
    async queryRoles() {
      const { data: res } = await this.$http.get('/roles')
      this.rolesList = res.data
    },
    closeModify() {
      this.$refs.modifyRoleForm.resetFields()
    },
    async modifyRole(id) {
      const { data: res } = await this.$http.get(`/roles/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('角色信息获取失败')
      }
      this.modifyForm = res.data
      this.modifyDialogVisible = true
    },
    deleteRole(id) {
      this.$confirm('是否删除此角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`/roles/${id}`)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.queryRoles()
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
    },
    submitModify() {
      this.$refs.modifyRoleForm.validate(async v => {
        if (!v) {
          return false
        }
        const { data: res } = await this.$http.put(
          `/roles/${this.modifyForm.roleId}`,
          {
            roleName: this.modifyForm.roleName,
            roleDesc: this.modifyForm.roleDesc
          }
        )
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('角色信息更新失败')
        } else {
          this.$message.success('角色信息更新成功')
          this.modifyDialogVisible = false
          this.queryRoles()
        }
      })
    },
    deleteThisRole(role, id) {
      this.$confirm('是否删除此权限?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `/roles/${role.id}/rights/${id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          role.children = res.data
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
    this.queryRoles()
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 10px 0;
}
.tag_bottom {
  border-bottom: 1px solid #eee;
}
.tag_top {
  border-top: 1px solid #eee;
}
.el-tag--warning {
  margin-right: 10px;
}
.aligncenter {
  display: flex;
  align-items: center;
}
</style>
