<template>
  <div class="ui-theme-container-main">
    <div class="ui-theme-container-main-layout">
      <header-size></header-size>
      <right></right>
    </div>
    <div class="ui-theme-container-main-body">
      <router-view v-slot="{ Component }">
        <keep-alive :include="keepAlive">
          <Transition name="fade-transverse">
            <component :is="Component" />
          </Transition>
        </keep-alive>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import right from './right';
import headerSize from './menu';
import { computed } from 'vue';
import { usePageStore } from '@/store/page';
const keepAlive = computed(() => usePageStore().keepAlive);
</script>

<style scoped>
.ui-theme-container-main {
  width: 100%;
  min-height: 100vh;
  position: relative;
}
.ui-theme-container-main-body {
  position: absolute;
  inset: 0;
  width: 100%;
  min-height: 100vh;
  z-index: 10;
}
.ui-theme-container-main-layout {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 64px;
  z-index: 12;
}
</style>
