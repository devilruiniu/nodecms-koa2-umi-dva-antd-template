// 依赖包
import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Trans, withI18n } from '@lingui/react';
// antd组件
import { Button, Row, Form, Icon, Input } from 'antd';
import { GlobalFooter } from 'ant-design-pro'
// 配置文件
import config from '@/config';
// 方法
import utils from '@/utils';
// 静态文件
import styles from './index.less';
const namespace = 'login';
const FormItem = Form.Item;

// 把对应model-namespace中的state值传入到当前组件的props中,名称一定要一样，且不能使用变量
@withI18n()
@connect(({ loading }) => ({ loading }))
@Form.create()
class Index extends React.Component {
  handleOk = () => {
    const { dispatch, form, location } = this.props;
    // 与 validateFields 相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围
    const { validateFieldsAndScroll } = form;
    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        // 对密码进行md5加密处理
        values.password = utils.Crypto.md5Encode(values.password);
        dispatch({type:`${namespace}/login`,payload: {data:values,noAuth:true},location:location});
      }
    });
  };

  render() {
    const { i18n, loading } = this.props;
    const { getFieldDecorator } = this.props.form;
    let footerLinks = config.project.footerLinks;
    // 将title换成图标
    footerLinks.forEach(item=>{
      if(item.title === 'github'){
        item.title = <Icon type="github" />
      }
    });
    if (config.i18n) {
      footerLinks = footerLinks.concat(
        config.i18n.languages.map(item => ({
          key: item.key,
          title: (
            <span onClick={utils.Fn.setLocale.bind(null, item.key)}>{item.title}</span>
          ),
        }))
      )
    }
    return <Fragment>
      <div className={styles.form}>
        <div className={styles.logo}>
          <img alt="logo" src={config.project.logoPath}/>
          <span>{i18n.t`Share Sale Admin`}</span>
        </div>
        <Form>
          <FormItem hasFeedback>
            {getFieldDecorator('account', {
              rules: [
                {
                  required: true,
                  message: `${i18n.t`Account is required`}`,
                },
              ],
            })(
              <Input placeholder={i18n.t`Account`} onPressEnter={this.handleOk}/>,
            )}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: `${i18n.t`Password is required`}`,
                },
              ],
            })(
              <Input
                type="password"
                onPressEnter={this.handleOk}
                placeholder={i18n.t`Password`}
              />,
            )}
          </FormItem>
          <Row>
            <Button
              type="primary"
              onClick={this.handleOk}
              loading={loading.effects[`${namespace}/login`]}
            >
              <Trans>Sign in</Trans>
            </Button>
          </Row>
        </Form>
      </div>
      <div className={styles.footer}>
        <GlobalFooter links={footerLinks} copyright={config.project.copyright} />
      </div>
    </Fragment>;
  }
}

export default Index;
