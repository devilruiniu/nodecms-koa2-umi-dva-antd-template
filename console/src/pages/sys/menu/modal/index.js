// 依赖包
import React from 'react';
// antd组件
import { Form, Input, Radio, Modal } from 'antd';
// 常量
import constants from '@/constants';

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
    const { item = {}, onOk, form , modalType } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields(errors => {
      if (errors) {
        return;
      }
      let data = {
        ...getFieldsValue(),
      };
      // 点击表格里面的编辑按钮
      if(modalType === 'update'){
        data.id = item.id;
      }
      // 点击表格里面的新建按钮
      if(modalType === 'sub_create'){
        data.level = item.level+1;
        data.parent_id = item.id;
        data.path = item.path;
      }
      onOk(data);
    });
  };

  render() {
    const { item = {}, form,  ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    return <Modal {...modalProps} onOk={this.handleOk}>
      <Form layout="horizontal">
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{ required: true, message: '请输入账户组名称' }],
          })(<Input placeholder="请输入账户组名称" autoComplete="off"/>)}
        </FormItem>
        <FormItem label="路由" {...formItemLayout}>
          {getFieldDecorator('route', {
            initialValue: item.route,
          })(<Input placeholder="请输入路由" autoComplete="off"/>)}
        </FormItem>
        <FormItem label="图标" {...formItemLayout}>
          {getFieldDecorator('icon', {
            initialValue: item.icon,
          })(<Input placeholder="请输入图标" autoComplete="off"/>)}
        </FormItem>
        <FormItem className="radioFormItem" label="导航菜单" hasFeedback {...formItemLayout}>
          {getFieldDecorator('is_nav_menu', {
            initialValue: item.is_nav_menu,
            rules: [{ required: true, message: '请设置状态' }],
          })(
            <Radio.Group>
              <Radio value="1">{constants.enums.yesOrNoState['1']}</Radio>
              <Radio value="2">{constants.enums.yesOrNoState['2']}</Radio>
            </Radio.Group>,
          )}
        </FormItem>
        <FormItem className="radioFormItem" label="是否启用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item.status,
            rules: [{ required: true, message: '请设置状态' }],
          })(
            <Radio.Group>
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
