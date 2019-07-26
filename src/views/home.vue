<template>
  <div class="home">
    <el-container>
      <el-aside style="width:auto">
        <div class="logo"></div>
        <el-menu
         :collapse="iscollapse"
         :router='true'
          :unique-opened='true'
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 注意index里面是唯一标识，是一个字符串，所以要加个‘’ -->
          <el-submenu :index="first.id + ''" v-for="first in menuList" :key="first.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{first.authName}}</span>
            </template>
                <!-- 这里要注意二级目录要写在el-menu-item里面 -->
              <el-menu-item :index="'/home/'+ second.path" v-for="second in first.children" :key="second.id">
                  <i class="el-icon-loading"></i>
                  <span>{{second.authName}}</span>
              </el-menu-item>
          </el-submenu>
          <!-- <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/home/roles">
                  <i class="el-icon-service"></i>
                  <span>角色列表</span>
                  </el-menu-item>
              <el-menu-item index="/home/rights">
                  <i class="el-icon-more-outline"></i>
                  <span>权限列表</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu> -->
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
            <span class="myicon myicon-menu toggle-btn" @click="iscollapse = !iscollapse"></span>
            <span class="system-title">电商后台管理系统</span>
            <a href="javascript:;" class="welcome">退出</a>
        </el-header>
        <el-main>
            <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getLeftMenu } from '@/api/right_index.js'
export default {
  data () {
    return {
      iscollapse: false,
      menuList: []
    }
  },
  methods: {
    async menuInit () {
      let res = await getLeftMenu()
      // console.log(res)
      this.menuList = res.data.data
    }
  },
  mounted () {
    this.menuInit()
  }
}
</script>

<style lang='less' scoped>
.home {
  height: 100%;
  .el-menu {
      width: auto;
  }
  .el-menu:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height:60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292CF;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome{
    color: blue;
  }
}
</style>
