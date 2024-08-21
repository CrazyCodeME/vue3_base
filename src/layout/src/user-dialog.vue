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
        <el-icon size="24" @click="emit('close')"><Close /></el-icon>
        <h4>{{ isLogin ? '登录' : '注册' }}</h4>
        <el-form ref="loginForm" :model="form" class="login-form">
          <el-form-item prop="username">
            <el-input v-model="form.username" :class="form.username ? 'is-input' : ''"></el-input>
            <span class="input-label" :class="form.username ? 'move-top' : ''">{{
              isLogin ? '手机号/用户名' : '手机号'
            }}</span>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              show-password
              type="password"
              :class="form.password ? 'is-input' : ''"
            ></el-input>
            <span class="input-label" :class="form.password ? 'move-top' : ''">密码</span>
          </el-form-item>
          <el-form-item v-if="!isLogin" prop="smsCode">
            <el-input v-model="form.smsCode"  maxlength="6" :class="form.smsCode ? 'is-input' : ''">
              <template #suffix
                ><el-link class="smscode" type="primary" :underline="false" :disabled="!canGet" @click="getSms">{{
                  hasGet ? `${timeout}` : '获取验证码'
                }}</el-link></template
              >
            </el-input>
            <span class="input-label" :class="form.smsCode ? 'move-top' : ''">验证码</span>
          </el-form-item>
          <el-form-item v-if="!isLogin">
            <div class="protocol">
              <el-checkbox v-model="agree"> </el-checkbox>本人确认已仔细阅读并充分理解<el-link type="primary"
                >《网站隐私政策》</el-link
              >的全部内容，同意接受上述协议的全部内容
            </div>
          </el-form-item>
          <el-form-item>
            <el-button v-if="isLogin" type="primary" @click="emit('login', form)">登录</el-button>
            <el-button v-else type="primary" :disabled="disabled" @click="emit('register', form)">注册</el-button>
          </el-form-item>
          <el-link v-if="isLogin">忘记密码？</el-link>
        </el-form>
        <div class="bottom-register">
          <div v-if="isLogin">
            <span class="tip">还没有账号？</span>
            <el-button type="success" @click="changeLogin(false)">注册</el-button>
          </div>
          <div v-else>已有账号？<el-link type="primary" @click="isLogin = true">立即登录</el-link></div>
        </div>
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
import { computed, reactive, ref } from 'vue';
import { Any } from '@/types';
import { login, register, getSmsCode } from '@/api/user';
const props = defineProps({
  showLogin: {
    type: Boolean,
    default: false,
  },
});
let agree = ref(false);
let hasGet = ref(false);
let timeout = ref(60);
const disabled = computed(() => {
  return form.username && form.password && form.smsCode && agree && !isLogin;
});
const canGet = computed(() => {
  return form.username && !hasGet.value;
});
let form = reactive({
  username: '',
  password: '',
  smsCode: '',
});
let timer: Any = null;
let isLogin = ref(true);
const emit = defineEmits(['update:modelValue', 'login', 'register', 'close', 'close-hook']);
const close = () => {
  emit('update:modelValue', false);
};
const changeLogin = (val: boolean) => {
  isLogin.value = val;
};
const getSms = () => {
  if (hasGet.value) return;

  getSmsCode({ mobilePhone: form.username }).then((res) => {
    console.log(res);
    hasGet.value = true;
    timer = setInterval(() => {
      timeout.value--;
      if (timeout.value <= 0) {
        hasGet.value = false;
        timeout.value = 60;
        clearInterval(timer);
      }
    }, 1000);
  });
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
</style>
