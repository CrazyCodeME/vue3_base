import { BuessinessError, ClientError, NetworkError } from './errors';
import router from '@/router';
import { ElMessage } from 'element-plus';

import type { AxiosError, AxiosRequestHeaders, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { Any, IError, IRemoteOption } from '@/types';
const errorCodes = {
  networkCodes: {
    505: 'HTTP版本不受支持',
    504: '网关超时',
    502: '网关错误',
    501: '服务未实现',
    500: '服务器内部错误',
    404: '资源不存在',
    403: '请求被禁止',
    401: '请求未认证',
    400: '糟糕的请求',
  },
};
export const transformRequest = (
  config: InternalAxiosRequestConfig<any>,
): InternalAxiosRequestConfig<any> | Promise<InternalAxiosRequestConfig<any>> => {
  if (config.method === 'get') {
    config.params = Object.assign({}, config.params || {});
  } else if ((config.headers as AxiosRequestHeaders)['Content-Type'] === 'multipart/form-data') {
    config.data = config.data ?? new FormData();
  } else {
    config.data = Object.assign({}, config.data ?? {});
  }
  console.info(config.url, config.data, '上送参数');
  return config;
};

export const transformResponse = (response: AxiosResponse) => {
  const respData: { respCode: string; respMsg: string; data: Any } = response.data;
  // eslint-disable-next-line no-console
  console.info('响应数据', response.config.url, respData);
  if (!respData.respCode) {
    // eslint-disable-next-line no-console
    console.warn('丢失错误码...', response.config.url);
  }
  // 和后端约定的成功业务逻辑的状态码 或者 文件流直接返回
  if (respData.respCode === '000000' || response.config.responseType === 'blob') {
    return respData.data || respData;
  } else {
    // 业务逻辑错误
    throw new BuessinessError(respData.respCode, respData.respMsg);
  }
};

const validateStatus = (status: number): boolean => status >= 200 && status < 300;

export const catchError = (error: AxiosError | IError) => {
  // axios 可能抛出的错误是 https://github.com/axios/axios/search?q=createError&unscoped_q=createError
  if (error && (error as AxiosError).isAxiosError) {
    let message = error.message;
    const response = (error as AxiosError).response;
    // http协议层错误处理 https://github.com/axios/axios/blob/885ada6d9b87801a57fe1d19f57304c315703079/lib/core/settle.js#L17
    if (response && !validateStatus(response.status)) {
      message = (errorCodes.networkCodes as { [key: number]: string })[response.status] || response.statusText;
      throw new NetworkError(response.status, message);
    }
    if (/timeout/.test(message)) {
      // 客户端请求超时 https://github.com/axios/axios/blob/dc4bc49673943e35280e5df831f5c3d0347a9393/lib/adapters/xhr.js#L95
      message = '请求超时';
    } else if (/aborted/.test(message)) {
      // 客户端主动取消 https://github.com/axios/axios/blob/dc4bc49673943e35280e5df831f5c3d0347a9393/lib/adapters/xhr.js#L73
      message = '请求被取消！';
    } else if (/^Network/.test(message)) {
      // 客户端网络连接失败 https://github.com/axios/axios/blob/dc4bc49673943e35280e5df831f5c3d0347a9393/lib/adapters/xhr.js#L83
      message = '网络连接错误！';
    } else {
      message = '未定义错误!!!';
    }
    throw new ClientError(message);
  } else {
    throw error;
  }
};

export const errorTip = (error: IError, options: IRemoteOption) => {
  const { code, message, name } = error;
  if (name === 'BuessinessError' || options.handleError) {
    if (['10200023', 'invalid.user', 'forceout.user'].includes((code as string).toLowerCase())) {
      const url = window.location.href;
      const path = url.split('#')[1];
      // 保存登出前的路由
      sessionStorage.setItem(path, 'regainPath');
      // 强制登出到登录页
      router.replace({ path: '/login' });
    }
    ElMessage.error(message);
  }
};
