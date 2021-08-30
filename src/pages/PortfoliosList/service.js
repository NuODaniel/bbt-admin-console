import request from '@/utils/request';

export async function queryPortFolios(params) {
  return request('/bbt/portfolio', {
    method: 'GET',
    params,
  });
}

export async function addPortFolio(data) {
  return request('/admin/portfolio/upload', {
    method: 'POST',
    data,
    requestType: 'form',
  });
}

export async function deletePortFolio(data) {
  return request('/admin/portfolio/' + data.id, {
    method: 'DELETE',
  });
}
