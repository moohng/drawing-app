/**
 * 根据 Canvas 生成图片
 * @param canvas canvas
 * @returns 图片路径
 */
export const useGenerateImage = async (canvas: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    uni.canvasToTempFilePath({
      // @ts-ignore
      canvas,
      success: ({ tempFilePath }) => {
        resolve(tempFilePath);
      },
      fail: reject,
    });
    // #endif
    // #ifndef MP-WEIXIN
    uni.canvasToTempFilePath({
      canvasId: 'drawCanvas',
      success: ({ tempFilePath }) => {
        resolve(tempFilePath);
      },
      fail: reject,
    });
    // #endif
  });
}
