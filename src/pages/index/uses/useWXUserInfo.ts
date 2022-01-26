export function useWXUserInfo(success: (userInfo: UniApp.UserInfo) => void) {
  uni.getUserProfile({
    lang: 'zh_CN',
    desc: '为了提供更好的服务我们您的信息',
    success: ({ userInfo }) => {
      success(userInfo);
    },
    fail: (err) => {
      console.log(err);
    },
  });
}
