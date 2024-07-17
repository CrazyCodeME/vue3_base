import { defineStore } from 'pinia';
import db from '@/utils/db';
import type { Any } from '@/types';
const deepClone = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) return obj;
  const cloneObj = Array.isArray ? [] : {};
  Object.keys(obj).forEach((key) => {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = typeof obj[key] === 'object' && obj[key] !== null ? deepClone(obj[key]) : obj[key];
    }
  });
  return cloneObj;
};
/**
 * @description 检查路径是否存在 不存在的话初始化
 * @param {Object} param dbName {String} 数据库名称
 * @param {Object} param path {String} 路径
 * @param {Object} param user {Boolean} 区分用户
 * @param {Object} param validator {Function} 数据校验钩子 返回 true 表示验证通过
 * @param {Object} param defaultValue {*} 初始化默认值
 * @returns {String} 可以直接使用的路径
 */
const pathInit = ({ dbName = 'localhost', path = '', user = true, validator = () => true, defaultValue = {} }) => {
  const uuid = 'ghost-uuid';
  const currentPath = `${dbName}.${user ? `user.${uuid}` : 'public'}${path ? `.${path}` : ''}`;
  const value = db.get(currentPath).value();
  if (!(value && validator())) db.set(currentPath, defaultValue).write();
  return currentPath;
};

export const useDbStore = defineStore({
  id: 'db',
  actions: {
    /**
     * @description 将数据存储到指定位置 | 路径不存在会自动初始化
     * @description 效果类似于取值 dbName.path = value
     * @param {Object} param dbName {String} 数据库名称
     * @param {Object} param path {String} 存储路径
     * @param {Object} param value {*} 需要存储的值
     * @param {Object} param user {Boolean} 是否区分用户
     */
    set(context: string, data: Any) {
      const { dbName = 'localhost', path = '', value, user = true } = data;
      db.set(pathInit({ dbName, path, user }), value).write();
    },
    /**
     * @description 获取数据
     * @description 效果类似于取值 dbName.path || defaultValue
     * @param {Object} param dbName {String} 数据库名称
     * @param {Object} param path {String} 存储路径
     * @param {Object} param defaultValue {*} 取值失败的默认值
     * @param {Object} param user {Boolean} 是否区分用户
     */
    get(context: string, data: Any) {
      const { dbName = 'localhost', path = '', defaultValue, user = true } = data;
      return new Promise((resolve) => {
        const dbPath = pathInit({ dbName, path, user, defaultValue });
        resolve(deepClone(db.get(dbPath).value()));
      });
    },
    /**
     * @description 获取存储数据库对象
     * @param {Object} context: string context: string
     * @param {Object} param user {Boolean} 是否区分用户
     */
    database(context: string, { user = true } = {}) {
      return new Promise((resolve) => {
        resolve(db.get(pathInit({ dbName: 'localhost', path: '', user, defaultValue: {} })));
      });
    },
    /**
     * @description 清空存储数据库对象
     * @param {Object} context: string context: string
     * @param {Object} param user {Boolean} 是否区分用户
     */
    databaseClear(context: string, { user = true } = {}) {
      return new Promise((resolve) => {
        resolve(db.get(pathInit({ dbName: 'localhost', path: '', user, validator: () => false, defaultValue: {} })));
      });
    },
  },
});
