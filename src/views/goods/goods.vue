<template>
 <div class='goods'>
     <!-- 这是商品组件
     注意嵌套结构，因为面包屑需要改动，如果面包屑不需要改动，那么结构是：
     商品组件包括面包屑部分，和下面挖个坑，坑里面是list和add两个组件，嵌套结构
     但是面包屑需要改动，结构就变成了goods里面就一个坑，里面是两个组件， -->
    <!-- 默认显示list组件 -->
    <router-view></router-view>
 </div>
</template>

<script>
export default {
}
</script>

<style lang='less' scoped>

</style>
