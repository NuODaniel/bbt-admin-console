import request from '@/utils/request';

const apikey = 'f6fdffe48c908deb0f4c3bd36c032e72';

async function reqWithApikey(url, options) {
  return request(`${url}?apikey=${apikey}`, {
    options,
  });
}

export async function queryRule(params) {
  return request('/api/rule', {
    params,
  });
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

export async function ping(params) {
  return reqWithApikey('/api/v1/ping', {
    params,
  });
}
