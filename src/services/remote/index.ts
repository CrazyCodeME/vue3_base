import { transformRequest, transformResponse, catchError, errorTip } from './common';
import { beforeSend, afterSend } from './hook';

import axios from 'axios';
import type { AxiosError } from 'axios';
import type { IError, IRemoteOption } from '@/types';

const instance = axios.create({
  baseURL: '/api/',
  timeout: 120 * 1000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // 默认值
});

instance.interceptors.request.use(transformRequest, (error) => {
  // 这里可以添加对错误的自定义处理逻辑
  // 例如：console.error(error);
  return Promise.reject(error);
});

const axiosCall = async (options: IRemoteOption) => {
  try {
    beforeSend(options);
    return await instance(options).catch(catchError).then(transformResponse);
  } catch (err) {
    errorTip(err as IError | AxiosError, options);
  } finally {
    afterSend(options);
  }
};

export const get = async function (url: string, options: IRemoteOption = { handleError: true }) {
  options.method = 'GET';
  options.url = url;
  options.params = options.query;
  return axiosCall(options);
};
export const post = async function (url: string, options: IRemoteOption = { handleError: true }) {
  options.method = 'POST';
  options.url = url;
  options.data = options.payload ?? {};
  return axiosCall(options);
};
export const postConfirm = function (url: string, options: IRemoteOption = { handleError: true }) {
  return post(url, { payload: { _trsType: 'confirm', ...(options.payload || {}) } });
};
// FormData格式
export const postForm = async function (url: string, options: IRemoteOption) {
  options.method = 'POST';
  const formdata = new FormData();
  const data = options.payload ?? {};
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      formdata.append(key, data[key]);
    }
  }
  options.headers = Object.assign({}, options.headers || {}, {
    'Content-Type': 'multipart/form-data',
  });
  options.url = url;
  options.data = formdata;
  return axiosCall(options);
};

export const postBlob = async function (url: string, options: IRemoteOption = { handleError: true }) {
  options.method = 'POST';
  options.url = url;
  options.data = options.payload;
  options.responseType = 'blob';
  return axiosCall(options);
};

export default {
  get,
  post,
  postForm,
  postBlob,
  postConfirm,
};
