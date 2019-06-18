// 加密方法
import crypto from 'crypto';
// 通用方法
const Crypto = {
  /**
   * md5加密
   * @param str
   */
  md5Encode: (str) => {
    const md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex');
  },
};
// 通用方法文件
export default Crypto;
