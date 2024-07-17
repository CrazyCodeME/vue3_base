import type { AxiosRequestConfig } from 'axios';
export interface PageState {
  opened: Any[]; // 当前显示的多页面列表
  openedLoaded: boolean; // 已经加载多标签页数据 issues/201
  current: string; // 当前页面
  keepAlive: Any[]; // 需要缓存的页面 name
  asideActived: string; // 侧边栏激活一级菜单
  openHistory: Any[];
}
export type Any = any;
/**
 * 公共类型描述,对应src/apis下面的类型定义
 *
 * author CSII VX
 */

export interface IPayload<T = Any> {
  [key: string]: T;
}
export interface IResponse<T = Any> {
  respCode: string;
  respMessage: string;
  [key: string]: T | string;
}
export interface IExtendArgs {
  _channelId: string;
  _channelType: string;
  _accessJnlNo: unknown;
  _bankId: unknown;
}

export interface IRemoteOption<Q = Any, P = Any> extends AxiosRequestConfig {
  payload?: P;
  handleError?: boolean;
  query?: Q;
  start?: Date | number;
  _trsType?: string;
}

export interface IError<T = Any> extends Error {
  code?: T;
  httpCode?: T;
}
