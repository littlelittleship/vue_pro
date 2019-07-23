<template>
 <div class="users">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <div style="margin: 15px 0px">
      <!-- 增加查询功能，因为接口文档上面在获取数据时有参数query，说明已经把查询条件考虑进去了，跟albx
      那个复杂的sql语句差不多，只需要添加按钮的单击事件，调用再次查询数据的方法，因此可以将查询数据的方法
      封装起来，便于调用。此外，还要实现一个便利功能，输入搜索条件后按下enter键，自动搜索，只需给input
      添加一个：@keyup.enter.native="init"，注意不是按钮的元素，要加上native才能获取元素 -->
        <el-input placeholder="请输入内容" v-model="userobj.query" class="input-with-select" style="width:300px;margin-right:10px" @keyup.enter.native="init">
        <el-button slot="append" icon="el-icon-search" @click="init"></el-button>
        </el-input>
         <el-button type="success" plain @click="dialogFormVisible=true">添加用户</el-button>
    </div>

    <el-table
      :data="userList"
      style="width: 100%" border>
      <el-table-column
      type="index"
      width="50">
    </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>

    <el-table-column label="用户状态"  width="80">
      <template slot-scope="scope">
        <el-switch v-model="scope.row.mg_state"
        active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row.id,scope.row.mg_state)">
        </el-switch>
      </template>
    </el-table-column>

      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="left">
                <el-button type="primary" icon='el-icon-edit' @click="showEditDialog(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
                <el-button type="primary" icon='el-icon-loading'></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="right">
                <el-button type="primary" icon='el-icon-close' @click="del(scope.row.id)"></el-button>
            </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userobj.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="userobj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户功能 -->
  <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
    <!-- 这里要添加两个属性，：model就不算了，：rules用来指定规则，ref用来获取当前元素，用于方法中
    对表单元素进行校验的时候，获取当前表单元素 -->
    <el-form :model="addform" :rules="rules" ref="addform">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input v-model="addform.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="addform.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="addform.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
        <el-input v-model="addform.mobile" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="addsubmit">确 定</el-button>
  </div>
  </el-dialog>

  <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
    <!-- 这里要添加两个属性，：model就不算了，：rules用来指定规则，ref用来获取当前元素，用于方法中
    对表单元素进行校验的时候，获取当前表单元素 -->
    <el-form :model="editform" :rules="rules" ref="editform">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username" >
        <el-input v-model="editform.username" auto-complete="off" style="width:80px" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="editform.email" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
        <el-input v-model="editform.mobile" auto-complete="off"></el-input>
      </el-form-item>
    </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="editdialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="editsubmit">确 定</el-button>
  </div>
  </el-dialog>
 </div>

</template>

<script>
import { getAllUserList, addUser, delUserById, editUser, updateUserState } from '@/api/user_index.js'
export default {
  data () {
    return {
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { pattern: /\w+[@]\w+[.]\w+/, message: '请合法的电子邮箱', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入合法的手机号', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      editdialogFormVisible: false,
      editform: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      addform: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      userobj: {
        query: '',
        pagenum: 1,
        pagesize: 4
      },
      total: 0,
      userList: []
    }
  },
  methods: {
    addsubmit () {
      this.$refs.addform.validate(valid => {
        if (valid) {
          addUser(this.addform)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'success'
                })
                this.dialogFormVisible = false
                this.$refs.addform.resetFields()
                this.init()
              } else {
                this.$message({
                  message: res.data.meta.msg,
                  type: 'error'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message({
            message: '请输入合法的数据',
            type: 'error'
          })
          return false
        }
      })
    },

    // 改变用户状态，调用方法时，前面加async，在返回结果前面加await，配套使用
    // 小总结：方法中什么时候需要传入参数，接口文档中需要，在user_index中肯定需要，
    // 在element组件中定义的方法，里面的参数如果在data里面定义过了，就不需要传入，
    // 因为可以直接用this拿到，如果是通过属性，scope.row的方式，就需要传入参数
    async changeState (id, type) {
      let res = await updateUserState(id, type)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: 'error'
        })
      }
    },

    // 编辑用户
    // async + await 的组合
    async editsubmit () {
      let res = await editUser(this.editform)
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.$message({
          message: res.data.meta.msg,
          type: 'success'
        })
        this.init()
        this.editdialogFormVisible = false
        this.$refs.editform.resetFields()
      } else {
        this.$message({
          message: res.data.meta.msg,
          type: 'error'
        })
      }
    },

    // 在编辑用户数据之前先获取数据，显示在表单中，双向绑定可以直接写
    showEditDialog (row) {
      // console.log(row)
      this.editdialogFormVisible = true
      this.editform.id = row.id
      this.editform.username = row.username
      this.editform.email = row.email
      this.editform.mobile = row.mobile
    },

    // 通过id删除用户，需要传入id，因为在data里面没有定义
    del (id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUserById(id)
          .then(res => {
            console.log(res)
            if (res.data.meta.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              // 有一个bug，在一页删完之后会出现一个空白页，解决方法，判断删除一个数之后，之后的当前页面是否
              // 等于删除之前的当前页面，如果等于，pass，如果小于，那么久让当前页面减去1，如果删除一个数后的
              // 当前页面是0，表示删完了，设置当前页面为0
              if (Math.ceil((this.total - 1) / this.userobj.pagesize) < this.userobj.pagenum) {
                this.userobj.pagenum--
              } else if (Math.ceil((this.total - 1) / this.userobj.pagesize) === 0) {
                this.userobj.pagenum = 0
              }

              this.init()
            } else {
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 该函数表示每页的条数，和element组建一起copy
    handleSizeChange (val) {
      // console.log(`每页 ${val} 条`)
      this.userobj.pagesize = val
      this.init()
    },
    // 该函数表示当前页面数，和element组建一起copy
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.userobj.pagenum = val
      this.init()
    },
    init () {
      getAllUserList(this.userobj)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            // 在获取数据成功之后，保存总记录数
            this.total = res.data.data.total
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang='less' scoped>

</style>
