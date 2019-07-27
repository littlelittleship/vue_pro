<template>
 <div class="list">
    <!-- 这是商品列表组件 -->

    <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:0px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框部分 -->
    <el-input placeholder="请输入搜索内容" v-model="listObj.query" class="input-with-select" style="width:300px" @keyup.enter.native="listInit">
        <el-button slot="append" icon="el-icon-search" @click="listInit"></el-button>
    </el-input>
    <el-button type="success" style="margin-left:20px" @click="$router.push({name:'add'})">添加商品</el-button>

    <!-- 表格部分 -->
    <el-table :data="goodsList" border stripe style="width: 100%">
        <el-table-column type="index" width="50" label="编号">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="350">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格" width="80">
        </el-table-column>
        <el-table-column prop="goods_state" label="商品状态" width="80">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="80">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="180">
            <template slot-scope="scope">
                {{scope.row.add_time | timeFormat}}
            </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="auto">
            <template slot-scope="scope">
                <el-tooltip content="编辑" placement="left" effect="light">
                    <el-button type="primary" plain icon="el-icon-edit"></el-button>
                </el-tooltip>
                <el-tooltip content="审核" placement="top" effect="light">
                    <el-button type="info" plain icon="el-icon-rank"></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="right" effect="light">
                    <el-button type="danger" plain icon="el-icon-delete"></el-button>
                </el-tooltip>
            </template>

        </el-table-column>

    </el-table>

    <!-- 分页功能 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listObj.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size='listObj.pagesize'
      layout="total, sizes, prev, pager, next, jumper"
      :total="alltotal">
    </el-pagination>

 </div>
</template>

<script>
import { getAllGoodsList } from '@/api/goods_index.js'
export default {
  data () {
    return {
      goodsList: [],
      listObj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      alltotal: 100
    }
  },
  methods: {
    handleSizeChange (val) {
      this.listObj.pagesize = val
      this.listInit()
    },
    handleCurrentChange (val) {
      this.listObj.pagenum = val
      this.listInit()
    },
    //   初始化商品列表
    async listInit () {
      getAllGoodsList(this.listObj)
        .then(res => {
        //   console.log(res)
          this.goodsList = res.data.data.goods
          this.alltotal = res.data.data.total
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.listInit()
  },
  filters: {
    timeFormat (data) {
      data = new Date(data * 1000)
      return data.getFullYear() + '-' + (data.getMonth() + 1) + '-' + data.getDate() + '  ' + data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds()
    }
  }
}
</script>

<style lang='less' scoped>

</style>
