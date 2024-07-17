<template>
  <div class="header-menu">
    <div class="logo">
      <a href="/" class="logo-href">
        <img src="//vcg00.cfp.cn/static/img/logo-audit-white.svg" alt="" />
      </a>
      <el-popover
        v-for="(item, index) in menuList"
        :key="index"
        trigger="hover"
        effect="dark"
        placement="bottom"
        popper-class="menu-popper"
        :show-arrow="false"
        :teleported="true"
        :disabled="item.child.length === 0"
      >
        <div v-if="item.child.length > 0">
          <p v-for="(v, i) in item.child" :key="i">{{ v.text }}</p>
        </div>
        <template #reference>
          <div class="menu">
            <el-link :underline="false"
              >{{ item.text }}<el-icon v-if="item.child.length > 0" size="16"><ArrowDown /></el-icon
            ></el-link>
          </div>
        </template>
      </el-popover>
    </div>
    <div class="login" @click="openDialog">登录/注册</div>
    <UserDialog v-model="showLogin"></UserDialog>
  </div>
</template>

<script setup lang="ts">
import { ArrowDown } from '@element-plus/icons-vue';
import UserDialog from './user-dialog.vue';
import { ref } from 'vue';
let showLogin = ref(false);
const menuList = [
  {
    text: '图片',
    child: [
      {
        text: '照片',
      },
      {
        text: '插画',
      },
    ],
  },
  {
    text: '视频',
    child: [],
  },
  {
    text: '音频',
    child: [
      {
        text: '音乐',
      },
      {
        text: '音效',
      },
    ],
  },
  {
    text: '字体',
    child: [],
  },
  {
    text: '更多服务',
    child: [
      {
        text: '开放平台',
      },
      {
        text: '视觉云库',
      },
      {
        text: '灵感绘图',
      },
      {
        text: 'AIGC',
      },
      {
        text: '整合营销',
      },
      {
        text: '创意洞察',
      },
      {
        text: 'AI Lab',
      },
    ],
  },
];
const openDialog = () => {
  showLogin.value = true;
};
</script>

<style scoped lang="scss">
.header-menu {
  width: 100%;
  padding-right: 24px;
  height: 64px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(10px);
  z-index: 99;
}
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  .logo-href {
    width: 166px;
    display: block;
    background-color: #f84949;
    height: 100%;
    margin-right: 24px;
    text-align: center;
    line-height: 64px;
    img {
      width: 102px;
    }
  }
  .menu .el-link {
    font-size: 16px;
    height: 64px;
    color: #080808;
    padding: 0 20px;
  }
  .menu .el-link:hover {
    color: #f84949;
  }
}
.login {
  color: #2c2c2c;
  padding: 0 12px;
  font-size: 16px;
  line-height: 36px;
  outline: none;
  cursor: pointer;
}
.login:hover {
  color: #fff;
  background-color: #2c2c2c;
  border-radius: 8px;
}
</style>
<style lang="scss">
.menu-popper {
  min-width: 50px !important;
  width: fit-content !important;
  padding: 14px 17px !important;
  div {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 176px;
    column-gap: 10px;
  }
  p {
    padding: 15px 7px;
    cursor: pointer;
    color: #fff;
    line-height: 14px;
  }
  p:hover {
    color: #f84949;
  }
}
</style>
