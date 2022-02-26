import { Path, TypeKeys } from '@/store/types';
import { useStore } from 'vuex';
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
  const collection = wx.cloud.database().collection('canvas-path');
  return collection.add({
    data: {
      ...data,
      createTime: Date.now(),
    },
  }).catch((err: any) => {
      uni.showToast({ title: '网络开小差了，请重试~' });
      throw new Error(err);
    })
    .finally(uni.hideLoading);
};

/**
 * 通过ID获取路径
 * @param {string} id
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

/**
 * 获取数据列表
 * @param query
 * @param isMine 是否个人数据
 * @returns
 */
export const fetchList = async (query: any) => {
  showLoading();
  const collection = wx.cloud.database().collection('canvas-path');
  const { isMine, pageIndex = 1, pageSize = 20, ...params } = query;
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
  return collection
    .where(params)
    .skip(pageSize * (pageIndex - 1))
    .limit(pageSize)
    .get()
    .catch((err: any) => {
      uni.showToast({ title: '数据加载失败，请重试~' });
      throw new Error(err);
    }).finally(uni.hideLoading);
};

/**
 * 图片上传
 * @param imgUrl
 * @returns
 */
export const uploadImage = (imgUrl: string) => {
  return wx.cloud.uploadFile({
    cloudPath: String(Date.now()) + imgUrl.match(/\.\w+$/)?.[0],
    filePath: imgUrl,
  });
};
