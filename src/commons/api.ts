import { Path, TypeKeys } from '@/store/types';
import { useStore } from 'vuex';
import { showLoading } from './utils';

export interface PaintPath {
  path: Path[];
  background?: string;
  title?: string;
  imgUrl?: string;
}

uniCloud.init({
  provider: 'aliyun',
  spaceId: 'ff827abe-e27d-48d4-a09a-81355a2ce85d',
  clientSecret: '7DdavW0Dwo6kqPo4+AwMkA==',
});

/**
 * 保存路径
 * @param {*} data
 * @returns
 */
export const addPath = (data: PaintPath) => {
  showLoading('正在保存...');
  const collection = uniCloud.database().collection('canvas-path');
  return collection.add({
    data: {
      ...data,
      openid: useStore().state.openid,
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
  const collection = uniCloud.database().collection('canvas-path');
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
  const { isMine, pageIndex = 1, pageSize = 20, ...params } = query;
  if (isMine) {
    const { state, commit } = useStore();
    if (!state.openid) {
      const res = await uniCloud.callFunction({
        name: 'path',
      });
      params.openid = res.result.openid;
      commit(TypeKeys.SET_OPENID, params._openid);
    } else {
      params.openid = state.openid;
    }
  }
  const collection = uniCloud.database().collection('canvas-path');
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
 * 根据ID删除数据
 * @param ids
 * @returns
 */
export const deletePathById = (ids: string[]) => {
  showLoading('正在删除...');
  const db = uniCloud.database();
  const _ = db.command;
  const collection = db.collection('canvas-path');
  return collection.where({ _id: _.or(ids) }).remove().catch((err: any) => {
    uni.showToast({ title: '数据获取失败，请重试~' });
    throw new Error(err);
  }).finally(uni.hideLoading);
};

/**
 * 图片上传
 * @param imgUrl
 * @returns
 */
export const uploadImage = (imgUrl: string) => {
  return uniCloud.uploadFile({
    cloudPath: String(Date.now()) + imgUrl.match(/\.\w+$/)?.[0],
    filePath: imgUrl,
  });
};

/**
 * 删除图片
 * @param fileList
 * @returns
 */
export const deleteImage = (fileList: string[]) => {
  return uniCloud.deleteFile({ fileList })
};
