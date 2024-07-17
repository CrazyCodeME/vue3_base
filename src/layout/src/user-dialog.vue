<template>
  <el-dialog
    :model-value="showLogin"
    width="780px"
    class="login-dialog"
    :lock-scroll="true"
    :show-close="false"
    append-to-body
    @close="close"
  >
    <div class="dialog-body">
      <div class="content-left">
        <div class="bg"></div>
        <div class="font">
          <p class="text">新用户注册即可获得</p>
          <p class="text1"><strong>30</strong>张</p>
          <p class="text">
            -&nbsp;试用下载权益&nbsp;<el-tooltip :offset="15" effect="dark" placement="top" popper-class="rule">
              <template #content>
                <p>1、本活动适用于未注册视觉中国产品的新用户。</p>
                <p>2、活动开始时间:2024年4月8日，活动结束时间另行通知。</p>
                <p>
                  3、符合要求的用户在VCG.COM注册之后即可获得全量图片的试用下载权益。自注册之日起一个月内，可下载30张长边为1024像素带水印的试用图。
                </p>
                <p>
                  4、试用下载:
                  仅允许您将图片用于设计样稿的预览与测试，且需要在下载后30天内删除。试用下载不提供任何正式授权，如果您需要将该内容用于最终发布的物料，请咨询购买获取授权。
                </p>
                <p>
                  5、通过非正常手段(包括但不限于批量注册、马甲账号、虚拟手机号)注册的，VCG有权清除其下载权限，取消活动资格。
                </p>
                <p>6、此活动最终解释权归汉华易美视觉科技有限公司所有。</p>
              </template>
              <el-icon size="17" style="cursor: pointer; vertical-align: -2px"><QuestionFilled /></el-icon
            ></el-tooltip>
            &nbsp;-
          </p>
        </div>
      </div>
      <div class="content-right">
        <el-icon size="24"><Close /></el-icon>
        <h4>登录</h4>
        <el-form ref="loginForm" :model="form" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="form.username"></el-input>
            <span class="input-label" :class="form.username ? 'move-top' : ''">手机号/用户名</span>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" show-password type="password"></el-input>
            <span class="input-label" :class="form.password ? 'move-top' : ''">手机号/用户名</span>
          </el-form-item>
          <el-form-item v-if="!isLogin" prop="smsCode">
            <el-input v-model="form.smsCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
export default {
  name: 'UserDialog',
};
</script>
<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue';
import { Close } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
const props = defineProps({
  showLogin: {
    type: Boolean,
    default: false,
  },
});
let form = reactive({
  username: '',
  password: '',
  smsCode: '',
});
let isLogin = ref(true);
const emit = defineEmits(['update:modelValue', 'confirm', 'cancel', 'close', 'close-hook']);
const close = () => {
  emit('update:modelValue', false);
};
</script>
<style lang="scss">
.login-dialog {
  max-width: 780px;
  width: 780px;
  height: 540px;
  max-height: calc(100vh - 64px);
  padding: 0;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    height: 100%;
    .dialog-body {
      display: flex;
      height: 100%;
      .content-left {
        width: 46%;
        position: relative;
        background-size: cover;
        background-color: #eee;
        overflow: hidden;
        .bg {
          background-image: url('https://vcg00.cfp.cn/static/img/demo/lg_bg_0403.png');
          background-size: cover;
          background-position: center;
          background-color: #f23b3b;
          background-repeat: no-repeat;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          transition: all 0.3s ease;
        }
        .bg:hover {
          animation: myScale 1s linear forwards;
        }
        .font {
          color: #fff;
          text-align: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          .text {
            font-size: 18px;
            line-height: 24px;
            margin-bottom: 24px;
          }
          .text1 {
            font-size: 28px;
            line-height: 32px;
            display: flex;
            align-items: flex-end;
            margin-bottom: 24px;
            strong {
              display: inline-block;
              font-size: 0;
              width: 186px;
              height: 126px;
              background-image: url('//vcg00.cfp.cn/static/img/demo/lg_t30.png');
              background-size: contain;
              background-position: center;
              background-repeat: no-repeat;
              margin-right: 4px;
            }
          }
        }
      }
      .content-right {
        padding: 40px;
        min-height: 520px;
        position: relative;
        flex: 1 1;
        .el-icon {
          position: absolute;
          top: 30px;
          right: 30px;
          cursor: pointer;
        }
        h4 {
          margin: 0;
          line-height: 1.4;
          font-size: 30px;
          padding: 15px 0 15px;
        }
        .login-form {
          .el-form-item {
            .el-form-item__content {
              .el-input {
                width: 340px;
                height: 56px;
              }
            }
          }
        }
      }
    }
  }
}
.rule {
  background: rgba($color: #000000, $alpha: 0.75) !important;
  max-width: 300px;
  font-size: 13px;
  .el-popper__arrow:before {
    background: rgba($color: #000000, $alpha: 0.75) !important;
  }
}
@keyframes myScale {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}
</style>
