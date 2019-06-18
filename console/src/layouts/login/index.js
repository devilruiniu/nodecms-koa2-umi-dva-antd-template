// 依赖包
import React from 'react';

/**
 * 登录母版页直接返回子元素
 */
class LoginMaster extends React.Component {
  render() {
    return this.props.children;
  }
}

export default LoginMaster;
