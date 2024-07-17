<template>
  <div class="home">
    <div class="home-search">
      <div class="search-content">
        <div class="search-select">
          <div
            v-for="(type, index) in types"
            :key="index"
            class="select-item"
            :class="[checkType === index ? 'is-active' : '']"
            @click="select(index)"
          >
            {{ type.text }}
          </div>
        </div>
        <div class="search-input">
          <el-input
            v-model="search"
            :placeholder="placeholder"
            type="text"
            @focus="historyPop = true"
            @blur="historyPop = false"
            @click="historyPop = true"
          >
            <template v-if="checkType !== 1" #prefix>
              <el-popover
                v-model:visible="popVisable"
                trigger="hover"
                :show-arrow="false"
                :offset="15"
                popper-style="width: 100px;padding: 0;min-width: 100px;border-radius: 12px;overflow: hidden;"
                :teleported="true"
                @show="historyPop = false"
              >
                <div
                  v-for="(sel, i) in searchTypeList"
                  :key="i"
                  class="search-input-select"
                  :class="[searchType === sel ? 'is-active2' : '']"
                  @click="
                    searchType = sel;
                    popVisable = false;
                  "
                >
                  {{ sel }}
                </div>
                <template #reference>
                  <div class="search-tips">
                    <span>{{ searchType }}</span>
                    <el-icon size="16" :class="[popVisable ? 'transIcon' : '']"><ArrowDown /></el-icon>
                  </div>
                </template>
              </el-popover>
            </template>
            <template v-if="checkType === 0" #suffix>
              <el-icon size="20"><CameraFilled /></el-icon>
            </template>
            <template #append>
              <el-button type="primary" class="search-btn" @click="test"
                ><el-icon size="20"><Search /></el-icon> 搜索</el-button
              >
            </template>
          </el-input>
          <div v-if="historyPop" class="search-history"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import * as userApi from '@/api/user';
import { ArrowDown, CameraFilled, Search } from '@element-plus/icons-vue';
const types = [
  {
    text: '搜图片',
    value: 'creative-image',
  },
  {
    text: '搜视频',
    value: 'creative-video-search',
  },
  {
    text: '搜音乐',
    value: 'music-search',
  },
];
let checkType = ref<number>(0);
let popVisable = ref<boolean>(false);
let search = ref<string>('');
let searchType = ref<string>('全部');
let historyPop = ref<boolean>(false);
let placeholder = ref<string>('可以尝试搜索关键词，图片ID或一句话');
const defaultText = [
  '可以尝试搜索关键词，图片ID或一句话',
  '可以尝试搜索关键词，视频ID或一句话',
  '可以尝试搜索关键词，或音乐ID',
];
let searchTypeList = ref(['全部', '照片', '插画', '模板', '元素', '图标']);
const select = (index: number) => {
  checkType.value = index;
  placeholder.value = defaultText[index];
  if (index === 2) {
    searchTypeList.value = ['音乐', '音效'];
    searchType.value = '音乐';
  } else {
    searchTypeList.value = ['全部', '照片', '插画', '模板', '元素', '图标'];
    searchType.value = '全部';
  }
};
const test = () => {
  userApi.login({
    username: 'admin',
    password: '123456',
  });
};
</script>

<style scoped lang="scss">
.home {
  background-image: url('https://vcg00.cfp.cn/cms/image/image/d60e5ecf11b14f9bba4be63cd9b8440a.jpg');
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  padding: 80px 0;
  .home-search {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0 24px;
    margin: 0 auto;
    .search-content {
      width: 100%;
      max-width: 816px;
      .search-select {
        background-color: rgba($color: #fff, $alpha: 0.4);
        padding: 4px;
        border-radius: 12px;
        backdrop-filter: blur(5px);
        display: flex;
        margin-bottom: 16px;
        width: fit-content;
        .select-item {
          border-radius: 8px;
          padding: 0 16px;
          font-size: 16px;
          color: #222;
          line-height: 36px;
          height: 36px;
          margin-left: 2px;
          cursor: pointer;
        }
        .is-active {
          color: #fff;
          background-color: #f84949;
        }
      }
      .search-input {
        width: 100%;
        max-width: 816px;
        .el-input {
          height: 56px;
          .search-tips {
            color: #222;
            display: flex;
            align-items: center;
            margin: 0;
            width: 100px;
            justify-content: center;
            position: relative;
            cursor: pointer;
            span {
              margin-right: 5px;
            }
            .el-icon {
              transition: transform 0.5s ease-in-out;
              transform: rotate(0deg);
            }
            .transIcon {
              transform: rotate(180deg);
            }
          }
          .search-tips::after {
            content: '';
            height: 20px;
            width: 2px;
            background-color: #ccc;
            display: block;
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          :deep(.el-input__inner) {
            padding: 18px;
            line-height: 20px;
            height: 56px;
            box-sizing: border-box;
          }
          :deep(.el-input__suffix) {
            width: 56px;
            height: 56px;
            margin-right: 4px;
            justify-content: center;
            cursor: pointer;
            .el-input__suffix-inner > :first-child {
              margin: 0;
            }
          }
          :deep(.el-input-group__append) {
            border-radius: 0 12px 12px 0;
          }
          .search-btn {
            width: 112px;
            height: 56px;
            border-radius: 0 12px 12px 0;
            color: #fff;
            font-size: 16px;
            .el-icon {
              margin-right: 4px;
              vertical-align: middle;
            }
          }
        }
      }
      .search-history {
        width: 100%;
        height: auto;
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
      }
    }
  }
}
</style>
<style scoped>
:deep(.el-input__wrapper) {
  border-radius: 12px 0 0 12px;
  padding: 0;
  box-shadow: none;
}
.search-input-select {
  color: #222;
  height: 40px;
  width: 100%;
  cursor: pointer;
  text-align: center;
  line-height: 40px;
}
.search-input-select:hover {
  background: #ffe7e7;
}
.is-active2 {
  color: #f84949;
}
</style>
