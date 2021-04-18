<template>
  <div id="app">
    <img src="./assets/logo.png">
    <div>
      <p>
        If Element is successfully added to this project, you'll see an
        <code v-text="'<el-button>'"></code>
        below
      </p>
      <el-button>el-button</el-button>
    </div>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>|
      <router-link to="/views">views</router-link>|
      <router-link to="/components">components</router-link>
    </div>
    <router-view/>
    <HelloWorldd msg="Welcomeeee to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorldd from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    HelloWorldd
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
