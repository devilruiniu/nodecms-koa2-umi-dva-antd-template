// 导入http请求方法
import request from '@/request';

// rPost方法
export async function rPost(url, options = {}) {
  return request(url, {
    ...options,
    method: 'POST',
  });

}

// rGet方法
export async function rGet(url, options = {}) {
  const oid = options.id ? ('/' + options.id) : '';
  return request(`${url}${oid}`, {
    ...options,
    method: 'GET',
  });
}

// rGetList方法
export async function rGetList(url, options = {}) {
  return request(url, {
    ...options,
    method: 'GET',
  });
}

// rPut方法
export async function rPut(url, options = {}) {
  const oid = options.data && options.data.id ? ('/' + options.data.id) : '';
  options.data && options.data.id && delete options.data.id;
  return request(`${url}${oid}`, {
    ...options,
    method: 'PUT',
  });
}

// 删除一条
export async function rDelete(url, options = {}) {
  const oid = options.id ? ('/' + options.id) : '';
  return request(`${url}${oid}`, {
    ...options,
    method: 'DELETE',
  });
}
