<template>
 <div class="role">
     <!-- 面包屑 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 添加角色 -->
    <el-button type="primary" round @click="addroledialogFormVisible=true">添加角色</el-button>

    <!-- 表格部分 -->
    <!-- :data=""里面是一个数组，来自接口返回的结果，要定义一个空数组 -->
    <el-table :data="roleList" border stripe style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row :gutter="20" v-for="first in scope.row.children" :key="first.id">
                    <el-col :span="4">
                        <el-tag closable type="success" style="margin:5px 10px 0px 0px" @close='delRightById(scope.row,first.id)'>{{first.authName}}
                        </el-tag>
                    </el-col>
                    <el-col :span="20">
                        <el-row v-for="second in first.children" :key="second.id">
                            <el-col :span="4">
                                <el-tag closable type="info" style="margin:5px 10px 0px 0px" @close='delRightById(scope.row,second.id)'>{{second.authName}}
                                </el-tag>
                            </el-col>
                            <el-col :span="20">
                                <el-tag closable type="warning"  v-for="third in second.children" :key="third.id"    style="margin:5px 10px 0px 0px"  @close='delRightById(scope.row,third.id)'>{{third.authName}}
                                </el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span='24' v-show='scope.row.children.length == 0'>没有任何的权限，请先分配！！</el-col>
                </el-row>
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
                <el-tooltip class="item" effect="dark" content="编辑角色" placement="left">
                    <el-button type="primary" icon='el-icon-edit' @click="editroleDialog(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="授权角色" placement="top">
                    <el-button type="primary" icon='el-icon-rank' @click="showGrantDialog(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="删除角色" placement="right">
                    <el-button type="primary" icon='el-icon-close' @click="open(scope.row.id)"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>

    <!-- 角色授权对话框 -->
    <el-dialog title="授权角色" :visible.sync="grantdialogFormVisible">
        <!-- :default-expanded-keys：默认展开的节点   :default-checked-keys默认选中的节点 -->
        <!-- :default-expand-all='true' 表示默认全部展开 -->
        <!-- node-key节点数据中的一个字段名，唯一 -->
        <el-tree
            :data="rightList"
            show-checkbox
            ref = 'mytree'
            node-key="id"
            :default-expand-all='true'
            :default-checked-keys="checkedArr"
            :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="grantdialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="grantSubmit">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addroledialogFormVisible">
        <el-form :model="addroleform" >
            <el-form-item label="添加角色" required>
                <el-input v-model="addroleform.roleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" required>
                <el-input v-model="addroleform.roleDesc" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="addroledialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="addrole">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editroledialogFormVisible">
        <el-form :model="editform" >
            <el-form-item label="角色名称" required>
                <el-input v-model="editform.roleName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="角色描述" required>
                <el-input v-model="editform.roleDesc" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="editroledialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editSubmit">确 定</el-button>
        </div>
      </el-dialog>

 </div>
</template>

<script>
import { getAllRoleList, delRightById, grantRightById, addrole, delRoleById, editrole } from '@/api/role_index.js'
import { getAllRightList } from '@/api/right_index.js'
export default {
  data () {
    return {
      editform: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      addroleform: {
        roleName: '',
        roleDesc: ''
      },
      editroledialogFormVisible: false,
      addroledialogFormVisible: false,
      grantdialogFormVisible: false,
      rightList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleId: '',
      checkedArr: [],
      roleList: []
    }
  },

  methods: {
    // 编辑提交
    async editSubmit () {
      let res = await editrole(this.editform)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success'
        })
        this.editroledialogFormVisible = false
        this.roleInit()
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: 'error'
        })
      }
    },

    // 打开编辑用户窗口
    editroleDialog (row) {
      this.editroledialogFormVisible = true
      this.editform.roleName = row.roleName
      this.editform.roleDesc = row.roleDesc
      this.editform.id = row.id
    },

    open (id) {
    //   console.log(id)
      this.$confirm('确定要删除角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 在这里调用接口
        delRoleById(id)
          .then(res => {
            // console.log(res)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.roleInit()
            }
          })
          .carch(err => {
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    //   添加用户
    async addrole () {
      let res = await addrole(this.addroleform)
      //   console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success'
        })
        this.roleInit()
        this.addroledialogFormVisible = false
      }
    },

    //   实现角色的分配提交
    async grantSubmit () {
      // 调用树组件的getCheckedNodes方法能返回被选中的节点的数组，用ref属性得到树
      let arr = this.$refs.mytree.getCheckedNodes()
      //   console.log(arr)
      let temp = []
      arr.forEach(item => {
        temp.push(item.id + ',' + item.pid)
      })
      let tempstr = temp.join(',')
      let temparr = tempstr.split(',')
      //   最重要一步，数组去重
      let fianlarr = [...new Set(temparr)]
      let res = await grantRightById(this.roleId, fianlarr.join(','))
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success'
        })
        this.grantdialogFormVisible = false
        this.roleInit()
      }
    },

    //   显示授权对话框
    // 要实现：显示所有权限，默认被选中
    showGrantDialog (row) {
      this.grantdialogFormVisible = true
      this.roleId = row.id
      //   console.log(row)
      this.checkedArr.length = 0
      this.rightInit()
      // 注意选中第三级，第一二级也会被选中，因此只用查找第三级的id
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  this.checkedArr.push(third.id)
                })
              }
            })
          }
        })
      }
    },

    // 根据id删除角色
    async delRightById (row, rightId) {
      let res = await delRightById(row.id, rightId)
      console.log(res)
      row.children = res.data.data
    },

    // 初始化所有权限数据
    async rightInit () {
      let res = await getAllRightList('tree')
      // console.log(res)
      this.rightList = res.data.data
    },

    // 初始化所有角色数据
    async roleInit () {
      let res = await getAllRoleList()
      //   console.log(res)
      this.roleList = res.data.data
    }
  },
  mounted () {
    this.roleInit()
    // this.rightInit()
  }

}
</script>

<style lang='less' scoped>

</style>
