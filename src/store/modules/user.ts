import { defineStore } from 'pinia';

export const GenderMap = {
  0: '未知',
  1: '男',
  2: '女',
}

export interface UserInfo {
  nickName: string;
  avatarUrl: string;
  gender: keyof typeof GenderMap;
  country: string;
  province: string;
  city: string;
  language: 'en' | 'zh_CN' | 'zh_TW',
}

const userInfo = uni.getStorageSync('USER_INFO_KEY');

export const useUserStore = defineStore('user', {
  state(): { userInfo: UserInfo } {
    return {
      userInfo,
    };
  },
  getters: {
    genderText: state => GenderMap[state.userInfo.gender],
  },
  actions: {
    setUserInfo (userInfo: UserInfo) {
      this.userInfo = userInfo;
      uni.setStorage({ key: 'USER_INFO_KEY', data: userInfo });
    },
  },
});
