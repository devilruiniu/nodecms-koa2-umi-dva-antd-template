// 路由
import umiRouter from 'umi/router';
import { cloneDeep } from 'lodash';
// 将URL转换成正则表达式
import pathToRegexp from 'path-to-regexp';
// 导入配置文件
import config from '@/config';
// 语言标识数组['zh','en'],多个方法中用到
const languages = config.i18n.languages.map(item => item.key);
// 通用方法
const Fn = {
  /**
   * 从路径中获取当前的语言
   * @param pathname
   * @returns {*}
   */
  getLangFromPath: (pathname) => {
    // 获取配置项中的语言选项列表及默认语言
    const defaultLanguage = config.i18n.defaultLanguage;
    // 使用for..of..循环时，return能退出当前循环并且直接返回
    for (const item of languages) {
      if (pathname.startsWith(`/${item}/`)) {
        return item;
      }
    }
    return defaultLanguage;
  },
  /**
   * 获取当前母版页使用的layout
   * @param pathname
   * @param layouts
   */
  getCurrentLayout: (layouts, pathname) => {
    let defaultLayout = layouts.filter(item => item.isDefault).layout;
    // 定义匹配方法
    const isMatch = regepx => {
      // 如果regepx为正则，则直接使用test方法，否则转换成正则再处理
      return regepx instanceof RegExp ? regepx.test(pathname) : Fn.pathMatchRegexp(regepx, pathname);
    };

    for (const item of layouts) {
      let include = false, exclude = false;
      if (item.include) {
        // 当前路径是否在该正则表达式的包含列表中
        for (const regepx of item.include) {
          if (isMatch(regepx)) {
            include = true;
            break;
          }
        }
      }
      // 如果在包含中，并且不包含存在
      if (include && item.exclude) {
        // 当前路径是否在该正则表达式不包含列表中
        for (const regepx of item.exclude) {
          if (isMatch(regepx)) {
            exclude = true;
            break;
          }
        }
      }
      // 当匹配在包含中，并且不再不包含中，则使用匹配到的，否则使用默认
      if (include && !exclude) {
        defaultLayout = item.layout;
        break;
      }
    }
    return defaultLayout;
  },
  /**
   * 根据当前路径匹配配置的正则表达式
   * @param regexp
   * @param pathname
   * @returns {RegExpExecArray}
   */
  pathMatchRegexp: (regexp, pathname) => {
    // 匹配之前要删除当前的语言前缀（/zh/ 或者 /en/）
    return pathToRegexp(regexp).exec(Fn.deleteLangPrefix(pathname));
  },
  /**
   * 删除路径总的中英文前缀
   * @param pathname
   */
  deleteLangPrefix: (pathname) => {
    if (!pathname) {
      return null;
    }
    for (const item of languages) {
      if (pathname.startsWith(`/${item}/`)) {
        return pathname.replace(`/${item}/`, '/');
      }
    }

    return pathname;
  },
  /**
   * 在当前路径上添加语言前缀
   * @param pathname
   * @returns {string}
   */
  addLangPrefix: (pathname) => {
    const prefix = Fn.getLangFromPath(Fn.hashToObj().pathname);
    return `/${prefix}${Fn.deleteLangPrefix(pathname)}`;
  },
  /**
   * 获取当前的语言
   * @returns {*}
   */
  getLocale: () => {
    return Fn.getLangFromPath(Fn.hashToObj().pathname);
  },
  /**
   * 设置当前的语言
   * @param language
   */
  setLocale: (language) => {
    // 如果当前语言不同的话，则设置语言
    if (Fn.getLocale() !== language) {
      umiRouter.push({
        pathname: `/${language}${Fn.deleteLangPrefix(Fn.hashToObj().pathname)}`,
        search: Fn.hashToObj().query,
      });
    }
  },
  /**
   * 将数组转换为树形结构数据
   * @param array
   * @param id
   * @param parentId
   * @param children
   * @param extra
   * @returns {Array}
   */
  arrayToTree: (array = [], id = 'id', parentId = 'parent_id', children = 'children', extra) => {
    const result = [];
    const hash = new Map();
    const data = cloneDeep(array);
    // 将当前的id作为key值存储在hash中
    data.forEach(item => hash.set(item[id], item));
    // 格式化的是菜单数据
    if (extra === 'menu') {
      data.forEach(item => {
        // 找到当前项的parent_id的项
        const hashParent = hash.get(item[parentId]);
        if (hashParent) {
          if (item.is_nav_menu === 1) {
            // 如果存在父项，则添加children
            !hashParent[children] && (hashParent[children] = []);
            hashParent[children].push(item);
          }
        } else {
          // 如果不存在，则添加当前项
          result.push(item);
        }
      });
    } else {
      // 格式化其他数据
      data.forEach(item => {
        // 找到当前项的parent_id的项
        const hashParent = hash.get(item[parentId]);
        if (hashParent) {
          // 如果存在父项，则添加children
          !hashParent[children] && (hashParent[children] = []);
          hashParent[children].push(item);
        } else {
          // 如果不存在，则添加当前项
          result.push(item);
        }
      });
    }
    return result;
  },
  /**
   * 获取树形结构中的祖先节点
   * @param array
   * @param current
   * @param parentId
   * @param id
   * @returns {Array}
   */
  getTreeAncestors: (array, current, parentId = 'parent_id', id = 'id') => {
    const result = [current];
    const hashMap = new Map();
    // 将当前的id作为key值存储在hash中
    array.forEach(item => hashMap.set(item[id], item));
    // 递归获取当前路径的父项，直到最初的祖先节点
    const getPath = current => {
      const currentParentId = hashMap.get(current[id])[parentId];
      if (currentParentId) {
        result.push(hashMap.get(currentParentId));
        getPath(hashMap.get(currentParentId));
      }
    };
    getPath(current);
    return result;
  },
  /**
   * hash转换成对象
   * @returns {{query: string | string, pathname: string | string}}
   */
  hashToObj: () => {
    let obj ;
    if(Fn.isDevelopment()){
      obj = {
        pathname:window.location.pathname,
        query:window.location.search
      }
    }else{
      let arr = window.location.hash.replace("#","").split("?");
      obj = {
        pathname: arr[0]||"",
        query:arr[1]||""
      }
    }
    return obj
  },
  /**
   * 判断当前环境是否为开发环境
   * @returns {boolean}
   */
  isDevelopment:()=>{
    return process.env.NODE_ENV === "development";
  }
};
// 通用方法文件
export default Fn;
