<template>
 <div class="role">
     <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格部分 -->
    <!-- :data=""里面是一个数组，来自接口返回的结果，要定义一个空数组 -->
    <el-table :data="roleList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row :gutter="20" v-for="first in scope.row.children" :key="first.id">
                    <el-col :span="4">
                        <el-tag closable type="success">{{first.authName}}
                        </el-tag>
                    </el-col>
                    <el-col :span="20">
                        <el-row v-for="second in first.children" :key="second.id">
                            <el-col :span="4">
                                <el-tag closable type="info">{{second.authName}}
                                </el-tag>
                            </el-col>
                            <el-col :span="20">
                                <el-tag closable type="warning"  v-for="third in second.children" :key="third.id" @close='delRightById(scope.row.id,third.id)'>{{third.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-cow>
                    <el-col :span='24' v-show='scope.row.children.length == 0'>没有任何的权限，请先分配！！</el-col>
                </el-cow>
            </template>
        </el-table-column>
        <!-- 添加索引行 -->
        <el-table-column type="index" width="50"></el-table-column>
        <!-- 中间两列 -->
        <el-table-column prop="roleName" label="角色名称" >
        </el-table-column>
        <el-table-column prop="roleDesc" label="描述" >
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作" width="280">
            <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                    <el-button type="primary" icon='el-icon-edit'></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                    <el-button type="primary" icon='el-icon-loading'></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除" placement="right">
                    <el-button type="primary" icon='el-icon-close'></el-button>
                </el-tooltip>
            </template>
        </el-table-column>

    </el-table>
 </div>
</template>

<script>
import { getAllRoleList, delRightById } from '@/api/role_index.js'
export default {
  data () {
    return {

      roleList: []
    }
  },

  methods: {

    async delRightById (roleId, rightId) {
      let res = await delRightById(roleId, rightId)
      console.log(res)
    },

    async roleInit () {
      let res = await getAllRoleList()
      console.log(res)
      this.roleList = res.data.data
    }
  },
  mounted () {
    this.roleInit()
  }

}
</script>

<style lang='less' scoped>

</style>
