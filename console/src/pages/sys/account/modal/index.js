// 依赖包
import React from 'react';
// antd组件
import { Form, Input, Radio, Modal, Select } from 'antd';
// 常量
import constants from '@/constants';
// 方法
import utils from '@/utils';

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};

@Form.create()
class Index extends React.Component {
  handleOk = () => {
    const { item = {}, onOk, form, modalType } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields(errors => {
      if (errors) {
        return;
      }
      let data = {
        ...getFieldsValue(),
      };
      if (modalType === 'create') {
        data.password = utils.Crypto.md5Encode(data.password);
      }
      if (item.id) {
        data.id = item.id;
      }
      onOk(data);
    });
  };

  render() {
    const { item = {}, form, modalType, accountGroupList, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return <Modal {...modalProps} onOk={this.handleOk}>
      <Form layout="horizontal">
        <FormItem label="账号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('account', {
            initialValue: item.account,
            rules: [{ required: true, message: '请输入账号' }],
          })(<Input disabled={modalType !== 'create'} placeholder="请输入账号" autoComplete="off"/>)}
        </FormItem>
        <FormItem label="账号组" hasFeedback {...formItemLayout}>
          {getFieldDecorator('account_group_id', {
            initialValue: item.account_group_id,
            rules: [{ required: true, message: '请选择账号组' }],
          })(<Select disabled={item.id === 1} style={{ width: '100%' }} placeholder="请选择账号组">
            { accountGroupList.map((item, index) => {
              return <Select.Option key={index} value={item.id}>{item.name}</Select.Option>;
            })}
          </Select>)}
        </FormItem>
        <FormItem label="账号别名" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{ required: true, message: '请输入账号别名' }],
          })(<Input placeholder="请输入账号别名" autoComplete="off"/>)}
        </FormItem>
        {modalType === 'create' && <FormItem label="密码" hasFeedback {...formItemLayout}>
          {getFieldDecorator('password', {
            initialValue: item.password,
            rules: [{ required: true, message: '请输入密码' }],
          })(<Input type="password" placeholder="请输入密码" autoComplete="off" extra="不少于6位数字"/>)}
        </FormItem>}
        <FormItem label="手机号" hasFeedback {...formItemLayout}>
          {getFieldDecorator('phone', {
            initialValue: item.phone,
            rules: [
              { required: true, message: '请输入手机号' },
              { pattern: new RegExp(constants.regExpObj.phone), message: '手机号格式不正确' },
            ],
          })(<Input placeholder="请输入手机号" autoComplete="off"/>)}
        </FormItem>
        <FormItem className="radioFormItem" label="是否启用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item.status,
            rules: [{ required: true, message: '请设置状态' }],
          })(
            <Radio.Group disabled={item.id === 1}>
              <Radio value="1">{constants.enums.enableState['1']}</Radio>
              <Radio value="2">{constants.enums.enableState['2']}</Radio>
            </Radio.Group>,
          )}
        </FormItem>
      </Form>
    </Modal>;
  }
}

export default Index;
