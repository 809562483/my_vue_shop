<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level == 0">一级</el-tag>
            <el-tag type="success" v-else-if="info.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
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
      rightsList: []
    }
  },
  methods: {
    async queryRights() {
      const { data: res } = await this.$http.get('/rights/list')
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  },
  created() {
    this.queryRights()
  }
}
</script>
<style lang="less" scoped></style>
