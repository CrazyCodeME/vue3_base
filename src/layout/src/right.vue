<template>
  <div class="right">
    <el-popover ref="popoverRef" trigger="hover" placement="right-end" :show-arrow="false">
      <span> Some content </span>
      <template #reference>
        <div class="shop">
          <el-icon size="20"><ShoppingCart /></el-icon>
          <span>我要购买</span>
        </div>
      </template>
    </el-popover>
    <div class="top" :style="{ visibility: showTop ? 'visible' : 'hidden' }" @click="goTop">
      <el-icon size="20"><Top /></el-icon>
      <span>回到顶部</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart, Top } from '@element-plus/icons-vue';
import { onMounted, ref } from 'vue';
const clientHeight = document.documentElement.clientHeight || document.body.clientHeight;
let showTop: boolean = ref(false);
onMounted(() => {
  window.addEventListener('scroll', scroll);
});
const scroll = () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  if (scrollTop > clientHeight) {
    showTop.value = true;
  } else {
    showTop.value = false;
  }
};
const goTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};
</script>

<style scoped lang="scss">
.right {
  position: fixed;
  right: 16px;
  bottom: 32px;
  width: 44px;
  z-index: 1299;
  .shop {
    background-image: linear-gradient(#ff566a, #f84949);
    color: #fff;
    width: 44px;
    border: 0;
    border-radius: 4px;
    padding: 4px 5px 10px;
    user-select: none;
    text-align: center;
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 4px 8px rgba(248, 73, 73, 0.24);
    .el-icon {
      margin-bottom: 2px;
      transition: all 0.2s ease-in-out;
    }
  }
  .shop:hover .el-icon {
    transform: translateY(-4px);
    opacity: 0;
  }
  .shop:hover span {
    transform: translateY(-10px);
  }
  .top {
    margin-top: 8px;
    width: 44px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 0 5px;
    text-align: center;
    height: 44px;
    color: #080808;
    overflow: hidden;
    cursor: pointer;
    i {
      height: 44px;
      line-height: 40px;
    }
    span {
      transform: translateY(-38px);
      opacity: 0;
      display: block;
      font-size: 12px;
      height: 44px;
      line-height: 1.3;
      padding-top: 6px;
    }
  }
  .top:hover span {
    transform: translateY(-45px);
    opacity: 1;
  }
  .top:hover i {
    transform: translateY(-5px);
    opacity: 0;
  }
}
</style>
