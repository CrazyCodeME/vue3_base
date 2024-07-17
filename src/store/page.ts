import { defineStore } from 'pinia';
import type { PageState, Any } from '@/types';
import { useDbStore } from '@/store/db';
import router from '@/router';

/**
 * 从指定对象中根据路径获取值，如果找不到则返回默认值
 *
 * @param data 要从中获取值的对象
 * @param path 值的路径，使用点符号分隔（例如：'user.name'）
 * @param defaultValue 可选参数，如果找不到值则返回此默认值
 * @returns 返回指定路径下的值，如果找不到则返回默认值
 */
const get = (data: Any, path: string, defaultValue?: any) => {
  const value = data[path];
  return typeof value !== 'undefined' ? value : defaultValue;
};

// 判定是否需要缓存
const isKeepAlive = (data: Any) => get(data, 'meta.cache', false);

export const usePageStore = defineStore({
  id: 'page',
  state: (): PageState => ({
    opened: [], // 当前显示的多页面列表
    openedLoaded: false, // 已经加载多标签页数据 issues/201
    current: '', // 当前页面
    keepAlive: [], // 需要缓存的页面 name
    asideActived: '', // 侧边栏激活一级菜单
    openHistory: [], // 打开历史
  }),

  actions: {
    isLoaded() {
      if (this.openedLoaded) return Promise.resolve();
      return new Promise((resolve) => {
        const timer = setInterval(() => {
          if (this.openedLoaded) {
            resolve(clearInterval(timer));
          }
        }, 10);
      });
    },
    /**
     * @class opened
     * @description 从持久化数据载入标签页列表
     * @param {Object} state vuex state
     */
    async openedLoad() {
      const value: Any = await useDbStore().get('', { path: 'page.opened', defaultValue: [] });
      this.opened = value;
      this.openedLoaded = true; // 标记已经加载多标签页数据 issues/201
      this.keepAlive = this.opened.filter((item) => isKeepAlive(item)).map((e) => e.name); // 根据 opened 数据生成缓存设置
    },
    /**
     * @description 将 opened 属性赋值并持久化 在这之前请先确保已经更新了 this.opened
     * @param {Object} state vuex state
     */
    openvxdb() {
      useDbStore().set('', { path: 'page.opened', value: this.opened });
    },
    /**
     * @class opened
     * @description 更新页面列表上的某一项
     * @param {Object} state vuex state
     * @param {Object} param { index, params, query, fullPath } 路由信息
     */
    openedUpdate(tag: Any) {
      const i: number = this.opened.findIndex((page) => page.fullPath === tag.fullPath); // 判断此页面是否已经打开 并且记录位置
      const newTag: Any = {
        params: tag.params,
        query: tag.query,
        fullPath: tag.fullPath,
        path: tag.path,
        name: tag.name,
        meta: tag.meta,
      };
      this.opened.splice(i, 1, newTag);
      this.current = tag.fullPath;
      if (!this.openHistory.includes(tag.fullPath)) this.openHistory.push(tag.fullPath);
      this.openvxdb();
    },
    /**
     * @class current
     * @description 打开一个新的页面
     * @param {Object} state vuex state
     * @param {Object} param 从路由钩子的 to 对象上获取 { name, params, query, fullPath } 路由信息
     */
    async open(tag: Any) {
      const { fullPath } = tag;
      if (fullPath === '/index') return;
      const opened = this.opened.find((page) => page.fullPath === fullPath); // 判断此页面是否已经打开 并且记录位置
      if (opened || this.openHistory.includes(fullPath)) {
        await this.openedUpdate(tag);
      } else {
        const newTag = {
          params: tag.params,
          query: tag.query,
          fullPath: tag.fullPath,
          path: tag.path,
          name: tag.name,
          meta: tag.meta,
        };
        this.opened.push(newTag); // 添加进当前显示的页面数组
        this.current = tag.fullPath;
        if (isKeepAlive(tag)) this.keepAlivePush(tag.name);
        if (!this.openHistory.includes(fullPath)) this.openHistory.push(fullPath);
        await this.openvxdb();
      }
    },
    /**
     * @class opened
     * @description 关闭一个 tag (关闭一个页面)
     * @param {Object} state vuex state
     * @param {Object} param { tagName: 要关闭的标签名字 }
     */
    async close(tag: Any) {
      const { tagName } = tag;
      // 下个新的页面
      let newPage = this.opened[0];
      const len = this.opened.length;
      const isLast = len === 1;
      const isCurrent = this.current === tagName;
      // 如果关闭的页面就是当前显示的页面且打开的页签不止一个
      if (!isLast && isCurrent) {
        // 去找一个新的页面
        for (let i = 1; i < len; i++) {
          if (this.opened[i].fullPath === tagName) {
            newPage = i < len - 1 ? this.opened[i + 1] : this.opened[i - 1];
            break;
          }
        }
      }
      const index = this.opened.findIndex((page) => page.fullPath === tagName);
      if (index >= 0) {
        this.keepAliveRemove(this.opened[index].name); // 如果这个页面是缓存的页面 将其在缓存设置中删除
        this.opened.splice(index, 1);
        const idx = this.openHistory.findIndex((t) => t === tagName);
        if (idx > -1) this.openHistory.splice(idx, 1); // 删除历史
      }
      await this.openvxdb();
      if (isLast) newPage = { name: 'index', params: {}, query: {} }; // 若关闭的为最后一个，则跳转到首页

      // 跳转至页签组最后一个页签
      if (isCurrent) {
        const { name = '', params = {}, query = {} } = newPage;
        router.push({ name, params, query });
      }
    },
    /**
     * @class opened
     * @description 关闭当前标签左边的标签
     * @param {Object} state vuex state
     * @param {Object} param { pageSelect: 当前选中的tagName }
     */
    async closeLeft(page: Any, route: Any) {
      const { pageSelect } = page;
      const pageAim = pageSelect || this.current;
      let currentIndex = 0;
      this.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) currentIndex = index;
      });
      // 删除打开的页面 并在缓存设置中删除
      if (currentIndex > 0)
        this.opened.splice(0, currentIndex).forEach(({ name, fullPath }) => {
          this.keepAliveRemove(name);
          const idx = this.openHistory.findIndex((t) => t === fullPath);
          if (idx > -1) this.openHistory.splice(idx, 1); // 删除历史
        });

      this.current = pageAim;
      if (route.fullPath !== pageAim) router.push(pageAim);

      // 持久化
      await this.openvxdb();
    },
    /**
     * @class opened
     * @description 关闭当前标签右边的标签
     * @param {Object} state vuex state
     * @param {Object} param { pageSelect: 当前选中的tagName }
     */
    async closeRight(page: Any, route: Any) {
      const { pageSelect } = page;
      const pageAim = pageSelect || this.current;
      let currentIndex = 0;
      this.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) {
          currentIndex = index;
        }
      });
      // 删除打开的页面 并在缓存设置中删除
      this.opened.splice(currentIndex + 1).forEach(({ name, fullPath }) => {
        this.keepAliveRemove(name);
        const idx = this.openHistory.findIndex((t) => t === fullPath);
        if (idx > -1) this.openHistory.splice(idx, 1); // 删除历史
      });
      // 设置当前的页面
      this.current = pageAim;
      if (route.fullPath !== pageAim) router.push(pageAim);
      // 持久化
      await this.openvxdb();
    },
    /**
     * @class opened
     * @description 关闭当前激活之外的 tag
     * @param {Object} state vuex state
     * @param {Object} param { pageSelect: 当前选中的tagName }
     */
    async closeOther(page: Any, route: Any) {
      const { pageSelect } = page;
      const pageAim = pageSelect || this.current;
      let currentIndex = 0;
      this.opened.forEach((page, index) => {
        if (page.fullPath === pageAim) currentIndex = index;
      });
      // 删除打开的页面数据 并更新缓存设置
      if (currentIndex === 0) {
        this.opened.splice(1).forEach(({ name }) => this.keepAliveRemove(name));
      } else {
        this.opened.splice(currentIndex + 1).forEach(({ name, fullPath }) => {
          this.keepAliveRemove(name);
          const idx = this.openHistory.findIndex((t) => t === fullPath);
          if (idx > -1) this.openHistory.splice(idx, 1); // 删除历史
        });
        this.opened.splice(0, currentIndex).forEach(({ name, fullPath }) => {
          this.keepAliveRemove(name);
          const idx = this.openHistory.findIndex((t) => t === fullPath);
          if (idx > -1) this.openHistory.splice(idx, 1); // 删除历史
        });
      }
      // 设置新的页面
      this.current = pageAim;
      if (route.fullPath !== pageAim) {
        router.push(pageAim);
      }
      // 持久化
      await this.openvxdb();
    },
    /**
     * @class opened
     * @description 关闭所有 tag，删除打开的页面 并在缓存设置中删除
     * @param {Object} state vuex state
     */
    async closeAll(route: Any) {
      this.opened.splice(0).forEach(({ name }) => this.keepAliveRemove(name));
      await this.openvxdb();
      // 关闭所有的标签页后需要判断一次现在是不是在首页
      if (route.name !== 'index') {
        router.push({ name: 'index' });
        this.asideActived = '/index';
      }
    },
    /**
     * 将用户激活的菜单持久化，防止刷新丢失
     */
    setAsideActive(actived: Any) {
      this.asideActived = actived;
      useDbStore().set('', { path: 'page.asideActived', value: actived });
    },
    /**
     * 从持久化数据中恢复激活的菜单
     * add by wyy
     */
    async loadAsideActived() {
      const actived: Any = await useDbStore().get('', { path: 'page.asideActived', defaultValue: '' });
      this.asideActived = actived || ' ';
      return true;
    },
    keepAliveRemove(name: string) {
      const list = [...this.keepAlive];
      this.keepAlive = list.filter((item) => item !== name);
    },
    /**
     * @description 增加一个页面的缓存设置
     * @param {Object} state vuex state
     * @param {String} name name
     */
    keepAlivePush(name: string) {
      const keep = [...this.keepAlive];
      keep.push(name);
      this.keepAlive = keep;
    },
  },
});
