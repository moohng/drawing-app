import { Path, TypeKeys } from '@/store/types';
import { useStore } from 'vuex';
import { http } from './request';
import { showLoading } from './utils';

interface PaintPath {
  path: Path[];
  background?: string;
  pwd?: string;
  imgUrl?: string;
}

/**
 * 保存路径
 * @param {*} data
 * @returns
 */
export const addPath = (data: PaintPath) => {
  showLoading('正在保存...');
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
export const fetchPathById = (id: string) => {
  showLoading();
  const collection = wx.cloud.database().collection('canvas-path');
  return collection.doc(id).get().catch((err: any) => {
    uni.showToast({ title: '数据获取失败，请重试~' });
    throw new Error(err);
  }).finally(uni.hideLoading);
};

export const fetchList = async (query?: PaintPath, isMine = false) => {
  showLoading();
  const collection = wx.cloud.database().collection('canvas-path');
  const params: any = { ...query };
  if (isMine) {
    const { state, commit } = useStore();
    if (!state.openid) {
      const res = await wx.cloud.callFunction({
        name: 'path',
      });
      params._openid = res.result.openid;
      commit(TypeKeys.SET_OPENID, params._openid);
    } else {
      params._openid = state.openid;
    }
  }
  return collection.where(params).get().catch((err: any) => {
    uni.showToast({ title: '数据加载失败，请重试~' });
    throw new Error(err);
  }).finally(uni.hideLoading);
};
