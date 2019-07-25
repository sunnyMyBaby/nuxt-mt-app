<template>
  <div class="" />
</template>

<script>
export default {
  layout: 'blank',
  // 中间件-中间件允许您定义一个自定义函数运行在一个页面或一组页面渲染之前。
  // 为什么要用中间件去做呢，因为我们没有一个交互去做这个事情比如点击个按钮去退出登录
  // 必须是让它到达这个页面石自动执行
  middleware: async (ctx) => {
    const { status, data } = await ctx.$axios.get('/users/exit')
    if (status === 200 && data && data.code === 0) {
      window.location.href = '/'
    }
  }
}
</script>
