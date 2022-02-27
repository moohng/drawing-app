import { Module } from 'vuex';

export enum TypeKeys {
  SET_USER_INFO = 'SET_USER_INFO',
}

export const GenderMap = {
  0: '未知',
  1: '男',
  2: '女',
}

interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: keyof typeof GenderMap;
  country: string;
  province: string;
  city: string;
  language: 'en' | 'zh_CN' | 'zh_TW',
}

interface State {
  userInfo: UserInfo;
}

const userInfo = uni.getStorageSync('USER_INFO_KEY');

export const user: Module<State, any> = {
  state: {
    userInfo,
  },
  getters: {
    genderText: state => GenderMap[state.userInfo.gender],
  },
  mutations: {
    [TypeKeys.SET_USER_INFO] (state, userInfo) {
      state.userInfo = userInfo;
      uni.setStorage({ key: 'USER_INFO_KEY', data: userInfo });
    },
  },
};
