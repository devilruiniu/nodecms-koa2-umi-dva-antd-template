// 依赖包
import React from 'react';
// 项目中的中英文翻译
import { I18nProvider } from '@lingui/react';
// 使用antd时需要的中英文翻译
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
// 导入基础文件
import BaseLayout from '@/layouts/base';
// 导入工具文件
import utils from '@/utils';
// 导入配置文件
import config from '@/config';
// antd语言别名对象
const languages = {
  zh: zh_CN,
  en: en_US,
};

/**
 * 所有页面的母版页
 * 初始化多语言配置
 */
class Master extends React.Component {
  state = {
    // 根据当前语言种类加载的语言数据
    languageData: {},
  };
  // 默认语言
  language = config.i18n.defaultLanguage;

  componentDidMount() {
    // 获取当前语言，如果没有，使用默认语言zh
    const language = utils.Fn.getLangFromPath(this.props.location.pathname);
    this.language = language;
    this.loadLanguageData(language);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const language = utils.Fn.getLangFromPath(nextProps.location.pathname);
    const preLanguage = this.language;
    const { languageData } = nextState;

    if (preLanguage !== language && !languageData[language]) {
      this.loadLanguageData(language);
      this.language = language;
      return false;
    }
    this.language = language;
    return true
  }
  /**
   * 读取翻译文件
   * @param language
   * @returns {Promise<void>}
   */
  async loadLanguageData(language) {
    const languageData = await import(/* webpackMode: "lazy", webpackChunkName: "i18n-[index]" */ `@lingui/loader!../locales/${language}/messages.json`);
    // 设置当前的语言数据
    this.setState(state => ({
      languageData: {
        ...state.languageData,
        [language]: languageData,
      },
    }));
  };

  render() {
    const { children, location } = this.props;
    const { languageData } = this.state;
    // 获取当前语言，不能在这是使用 this.language
    let language = utils.Fn.getLangFromPath(location.pathname);
    // 如果数据中不存在这个值，使用默认的语言，比如"fr"，没有这个语言种类，就使用zh
    if (!languageData[language]) {
      language = config.i18n.defaultLanguage;
    }
    return (
      <LocaleProvider locale={languages[language]}>
        <I18nProvider language={language} catalogs={languageData}>
          <BaseLayout>{children}</BaseLayout>
        </I18nProvider>
      </LocaleProvider>
    );
  }
}

export default Master;
