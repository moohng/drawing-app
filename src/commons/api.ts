import { Path, TypeKeys } from '@/store/types';
import store from '@/store';
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
    ...data,
    openid: store.state.openid,
    createTime: Date.now(),
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
    if (!store.state.openid) {
      const openid = await getOpenid();
      params.openid = openid;
    } else {
      params.openid = store.state.openid;
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
  return collection.where({ _id: _.in(ids) }).remove().catch((err: any) => {
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
  // 阿里云不支持改api
  return uniCloud.deleteFile({ fileList })
};

export const getOpenid = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: async ({ code }) => {
        console.log('获取code成功', code);
        const { result } = await uniCloud.callFunction({
          name: 'login',
          secretType: 'none',
          data: {
            code,
          },
        });
        console.log('获取openid成功', result);
        if (result.code === 0) {
          store.commit(TypeKeys.SET_OPENID, result.openid);
          resolve(result.openid);
        } else {
          reject(result);
        }
      },
      fail: reject,
    });
  });
};
