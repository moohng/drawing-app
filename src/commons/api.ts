import { Path } from '@/store/types';
import { http } from './request';

interface PaintPath {
  path: Path[];
  code: string;
  background?: string;
  pwd?: string;
}

/**
 * 保存路径
 * @param {*} data
 * @returns
 */
export const addPath = (data: PaintPath) => {
  uni.showLoading({});
  return http
    .post('/draw/path/add', {
      ...data,
      createTime: Date.now(),
    })
    .catch((err: any) => {
      uni.showToast({ title: '网络开小差了，请重试~' });
      throw new Error(err);
    })
    .finally(uni.hideLoading);
};

/**
 * 获取路径
 * @param {*} query
 * @returns
 */
export const fetchPath = (query: { code: string }) => {
  uni.showLoading({});
  return http
    .get('/draw/path/get', query)
    .then(({ data }: any) => {
      return data;
    })
    .catch((err: any) => {
      uni.showToast({ title: '数据加载失败，请重试~' });
      throw new Error(err);
    })
    .finally(uni.hideLoading);
};
