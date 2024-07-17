<template>
  <div class="page">
    <div class="page_content">
      <p class="page_title">404 page not found</p>
      <el-button @click="goback()">返回首页</el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
const goback = () => {
  router.replace({ path: '/login' });
};
</script>
<style lang="scss">
.page {
  display: table;
  background: #303133;
  background-blend-mode: multiply, multiply;
  width: 100vw;
  height: 100vh;
  .page_content {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  .page_title {
    font-size: 20px;
    color: #fff;
  }
}
</style>
