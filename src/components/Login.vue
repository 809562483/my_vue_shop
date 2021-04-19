<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="#" />
      </div>
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        label-width="0px"
        class="login_form"
        :rules="rules"
      >
        <el-form-item label="" prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-xigua"
          ></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-yingtao"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item label="" class="btns">
          <el-button type="primary" @click="onSubmit">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.loginFormRef.validate(async validate => {
        if (!validate) return
        const { data: res } = await this.$http.post('/login', this.loginForm)
        if (res.meta.status === 200) {
          console.log(res)
          this.$message.success('校验成功')
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } else {
          this.$message.error('校验失败')
        }
      })
    },
    reset() {
      // console.log(this)
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
  position: relative;
}
.login_box {
  width: 450px;
  height: 350px;
  background-color: #fcfefc;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 3px;
  // overflow: hidden;
}
.avatar_box {
  width: 130px;
  height: 130px;
  background-color: #eceeeb;
  border-radius: 50%;
  border: 10px solid #feffff;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0px 0px 10px white;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    vertical-align: middle;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>
