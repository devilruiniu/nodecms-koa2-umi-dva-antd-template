// 依赖包
import React from 'react';
import { isString } from 'lodash';
// antd组件
import { Form, Input,TreeSelect, Radio, Modal, Spin } from 'antd';
// 常量
import constants from '@/constants';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;
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
    const { item = {}, onOk, form } = this.props;
    const { validateFields, getFieldsValue } = form;

    validateFields(errors => {
      if (errors) {
        return;
      }
      let data = {
        ...getFieldsValue(),
      };
      if (item.id) {
        data.id = item.id;
      }
      data.menu_ids = data.menu_ids.join(",");
      onOk(data);
    });
  };
  generateTreeNode = (menuTree = []) => {
    return menuTree.map(({ children, id, name }) => (
      <TreeNode value={id} title={name} key={id}>
        {this.generateTreeNode(children)}
      </TreeNode>
    ));
  };
  render() {
    const { item = {}, form, menuLoading, menuTree,modalType, ...modalProps } = this.props;
    const { getFieldDecorator } = form;
    let arr = [];
    // 编辑情况，如果不存在menu_ids表示最高管理员权限
    if (modalType === 'update' && !item.menu_ids) {
      menuTree.forEach(menuItem => {
        arr.push(menuItem.id);
      });
    } else if (isString(item.menu_ids)) {
      arr = item.menu_ids.split(",");
    }else{
      arr = undefined;
    }
    const tProps = {
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      placeholder: '请选择菜单',
      treeNodeFilterProp: 'title',
    };
    return <Modal {...modalProps} onOk={this.handleOk}>
      {menuLoading && (<div className="spinWarp"><Spin/></div>)}
      <Form layout="horizontal" style={{ display: menuLoading ? 'none' : '' }}>
        <FormItem label="名称" hasFeedback {...formItemLayout}>
          {getFieldDecorator('name', {
            initialValue: item.name,
            rules: [{ required: true, message: '请输入账户组名称' }],
          })(<Input placeholder="请输入账户组名称" autoComplete="off"/>)}
        </FormItem>
        <FormItem label="菜单权限" hasFeedback {...formItemLayout}>
          {getFieldDecorator('menu_ids', {
            initialValue: arr,
            rules: [{ required: true, message: '请选择菜单' }],
          })(<TreeSelect disabled={item.id===1} {...tProps}>
            {this.generateTreeNode(menuTree)}
          </TreeSelect>)}
        </FormItem>
        <FormItem label="描述" {...formItemLayout}>
          {getFieldDecorator('description', {
            initialValue: item.description,
          })(<Input.TextArea placeholder="请输入描述" autosize={{ minRows: 2, maxRows: 6 }} autoComplete="off"/>)}
        </FormItem>
        <FormItem className="radioFormItem" label="是否启用" hasFeedback {...formItemLayout}>
          {getFieldDecorator('status', {
            initialValue: item.status,
            rules: [{ required: true, message: '请设置状态' }],
          })(
            <Radio.Group disabled={item.id===1}>
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
