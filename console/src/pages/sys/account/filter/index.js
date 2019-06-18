// 依赖包
import React from 'react';
// antd组件
import { Form, Button, Row, Col, Input, Select } from 'antd';
// 常量
import constants from '@/constants';
// 自定义组件
import FilterItem from '@/components/filter_item';

// 每一个搜索列的属性
const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
};

@Form.create()
class Index extends React.Component {
  // 处理搜索按钮事件
  handleSearch = () => {
    const { onFilterChange, form } = this.props;
    const { getFieldsValue } = form;
    // 获取搜索字段的对象
    let fields = getFieldsValue();
    onFilterChange(fields);
  };
  // 处理重置按钮
  handleReset = () => {
    const { form } = this.props;
    const { getFieldsValue, setFieldsValue } = form;
    const fields = getFieldsValue();
    // 判断是否为自有属性
    for (let item in fields) {
      if (Object.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = [];
        } else {
          fields[item] = undefined;
        }
      }
    }
    setFieldsValue(fields);
    this.handleSearch();
  };

  render() {
    const { filter, form, onAdd } = this.props;
    const { account, phone, status } = filter;
    const { getFieldDecorator } = form;
    return <Row gutter={24}>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 12 }}>
        <FilterItem label="账号">
          {getFieldDecorator('account', {
            initialValue: account,
          })(
            <Input placeholder="请输入账号名称"/>,
          )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 12 }}>
        <FilterItem label="手机号码">
          {getFieldDecorator('phone', {
            initialValue: phone,
          })(
            <Input placeholder="请输入手机号码"/>,
          )}
        </FilterItem>
      </Col>
      <Col {...ColProps} xl={{ span: 6 }} md={{ span: 12 }}>
        <FilterItem label="状态">
          {getFieldDecorator('status', {
            initialValue: status,
          })(<Select style={{ width: '100%' }} placeholder="请选择状态">
            <Select.Option key="-1" value="-1">全部</Select.Option>
            {Object.keys(constants.enums.enableState).map((item, index) => {
              return <Select.Option key={index} value={item}>{constants.enums.enableState[item]}</Select.Option>;
            })}
          </Select>)}
        </FilterItem>
      </Col>
      <Col
        {...ColProps}
        xl={{ span: 6 }}
        md={{ span: 12 }}
        sm={{ span: 24 }}
      >
        <Row type="flex" align="middle" justify="space-between">
          <div>
            <Button type="primary" className="margin-right" onClick={this.handleSearch}>搜索</Button>
            <Button onClick={this.handleReset}>重置</Button>
          </div>
          <Button type="primary" onClick={onAdd}>新建</Button>
        </Row>
      </Col>
    </Row>;
  }
}

export default Index;
