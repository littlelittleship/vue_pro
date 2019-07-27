<template>
 <div class="add">
     <!-- 面包屑部分 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:0px">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品添加</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 步骤条 -->
    <el-steps :active="activeName-0" finish-status="success" style='margin:20px 0px'>
        <el-step title="步骤 1"></el-step>
        <el-step title="步骤 2"></el-step>
        <el-step title="步骤 3"></el-step>
        <el-step title="步骤 4"></el-step>
        <el-step title="步骤 5"></el-step>
    </el-steps>

    <!-- tabs部分 -->
    <!-- 注意之后获取数据时要想获取到所有数据，就不能把form表单放在tab中，要吧tab放在一个表单中 -->
    <!-- 将steps和tabs关联在一起的条件：用用一个变量，先定义一个变量activeName，双向绑定，在点击tabs栏的选项时，activename
    的值（显示的）是name所对应的字符串，因此，我们吧name属性定义成0，1，2，3，4，当值是2时，steps里面：active="'2'"，
    会报错，因为里面需要一个number，而此时的activeName是一个字符串，需要隐式转换，-0就行了 -->
    <el-form ref="addform" :model="addform" label-width="120px">
        <el-tabs :tab-position="'left'" v-model="activeName" @tab-click="handleClick" style="margin-top: 30px" >
            <el-tab-pane label="基本信息" name='0'>
                    <el-form-item label="商品名称">
                        <el-input v-model="addform.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="addform.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="addform.goods_weight"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="addform.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        <!-- 级联选择器 -->
                        <!-- options：数据源，通过：props设置要显示的属性value和label标签，默认children，
                        v-model：选中之后结果会自动赋值给addform.goods_cat属性所对应的值，change-on
                        表示能被选择，即选项前面有一个框 -->
                    <el-cascader
                        expand-trigger="hover"
                        change-on-select
                        :options="cateList"
                        :props="cateprop"
                        v-model="addform.goods_cat"
                        @change="cateSelect">
                    </el-cascader>
                    </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name='1'>配置管理</el-tab-pane>
            <el-tab-pane label="商品属性" name='2'>角色管理</el-tab-pane>
            <el-tab-pane label="商品图片" name='3'>
                <!-- 上传图片部分 -->
                <!-- 注意上传图片走的是内部封装，不经过我们设置的axios，因此会报无效token，
                解决办法，在：headers里面设置token，注意：header=”“ 里面是一个方法，
                并且要（），：on-preview预览时触发，”on-success上传成功后触发，
                ：on-remove移除时触发，
                注意页面上删除后服务器上面并没有删除，需要额外处理：在移除时触发的方法
                中去掉重复的文件 -->
                <el-upload
                    class="upload-demo"
                    action='http://localhost:8888/api/private/v1/upload'
                    :headers="getToken()"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handSuccess"
                    :file-list="fileList"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name='4'>定时任务补偿</el-tab-pane>
        </el-tabs>
    </el-form>
 </div>
</template>

<script>
import { getAllCateList } from '@/api/cate_index.js'
export default {
  data () {
    return {
      fileList: [],
      activeName: '',
      addform: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_cat: '',
        pics: []
      },
      cateList: [],
      cateprop: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      }
    }
  },
  methods: {
    getToken () {
      var token = localStorage.getItem('itcast_manage_token')
      return { Authorization: token }
    },
    //   文件预览时触发
    handlePreview (file) {
    //   console.log(file)
    },
    handleRemove (file, fileList) {
      console.log(file)
      var current = file.response.data.temp_path
      for (var i = 0; i < this.addform.pics.length; i++) {
        if (this.addform.pics[i].pic === current) {
          this.addform.pics.splice(i, 1)
          //   因为是每次移除的时候都会触发，所以一次只会有一个被移除，发现符合
          //   条件并移除后可以直接结束循环
          break
        }
      }
    },
    handSuccess (response, file, fileList) {
      console.log(response)
      if (response.meta.status === 200) {
        this.addform.pics.push({ pic: response.data.temp_path })
      }
    },
    // 点击tabs栏选项时的方法
    handleClick () {
      // 这里打印的是name的值，是字符串0，1，2
    //   console.log(this.activeName)
    },
    // 选择商品后触发的事件
    cateSelect (obj) {
    //   console.log(obj)
      //   打印出的两个值完全相等，是一个数组，里面是被选中的商品id
      console.log(this.goodsform.goods_cat)
      this.addform.goods_cat.join(',')
    }
  },
  mounted () {
    getAllCateList(3)
      .then(res => {
        // console.log(res)
        this.cateList = res.data.data
      })
  }
}
</script>

<style lang='less' scoped>

</style>
