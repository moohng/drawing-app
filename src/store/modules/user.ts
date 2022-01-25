import { Module } from "vuex";

export enum TypeKeys {
  SET_OPEN_ID = 'SET_OPEN_ID',
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
  openId: string;
  userInfo: UserInfo;
}

export const user: Module<State, any> = {
  state: {
    openId: '',
    userInfo: {
      nickName: '',
      avatarUrl: '',
      gender: 0,
      country: '',
      province: '',
      city: '',
      language: 'zh_CN',
    },
  },
  getters: {
    genderText: state => GenderMap[state.userInfo.gender],
  },
  mutations: {
    [TypeKeys.SET_OPEN_ID] (state, openId) {
      state.openId = openId;
    },
    [TypeKeys.SET_USER_INFO] (state, userInfo) {
      state.userInfo = userInfo;
    },
  },
};
