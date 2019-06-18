// 依赖包
import React from 'react';
// antd组件
import { Table } from 'antd';
// 样式文件
import styles from './index.less';

class Index extends React.Component {
  render() {
    const { loading, list, pagination, columns, onChange, onShowSizeChange } = this.props;
    let paginationObj = {
      ...pagination,
      showTotal: total => `总计 ${total} 条`,
      onChange,
      onShowSizeChange,
    };
    if(!pagination){
      paginationObj = false;
    }

    return <div>
      <Table
        bordered
        size="middle"
        loading={loading}
        className={styles.table}
        pagination={paginationObj}
        columns={columns}
        dataSource={list}
        scroll={{ x: 1200 }}
        rowKey={record => record.id}
      />
    </div>;
  }
}

export default Index;
