<template>
  <el-container class="el-container">
    <!-- 头部区域 -->
    <el-header class="el-header">
      <div class="logo">
        <img src="../assets/nq.jpg" alt="#" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="el-aside">
        <div class="toggle" @click="toggleCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#313743"
          text-color="#fff"
          active-text-color="#339AFF"
          unique-opened
          :default-active="activeMenu"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
        >
          <el-submenu
            :key="item.id"
            :index="'/' + item.path"
            v-for="item in menus"
          >
            <template slot="title">
              <i class="iconfont icon-mogu"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + child.path"
              :key="child.id"
              v-for="child in item.children"
              @click="saveMenu('/' + child.path)"
              ><i class="el-icon-menu"></i
              ><span>{{ child.authName }}</span></el-menu-item
            >
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 内容区域 -->
      <el-main class="el-main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menus: [],
      activeMenu: '',
      isCollapse: false
    }
  },
  methods: {
    logout: function() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    async queryMenus() {
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) return this.$message.error('获取菜单失败')
      this.menus = res.data
    },
    saveMenu(index) {
      window.sessionStorage.setItem('path', index)
      this.activeMenu = index
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  },
  created() {
    this.queryMenus()
    this.activeMenu = window.sessionStorage.getItem('path')
  }
}
</script>
<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.el-aside {
  background-color: #313743;
  span {
    padding: 0 5px;
  }
}
.el-main {
  background-color: #e9edf0;
}
.logo {
  display: flex;
  align-items: center;
  span {
    color: #fff;
    font-size: 24px;
    padding: 0 5px;
  }
  img {
    width: 50px;
    height: 50px;
  }
}
.toggle {
  background-color: #475163;
  color: #fff;
  line-height: 25px;
  height: 25px;
  font-size: 10px;
  text-align: center;
  letter-spacing: 0.1em;
  cursor: pointer;
}
</style>
