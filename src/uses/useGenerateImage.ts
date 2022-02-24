/**
 * 根据 Canvas 生成图片
 * @param canvas canvas
 * @returns 图片路径
 */
export const useGenerateImage = async (selector: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // #ifdef MP-WEIXIN
    // @ts-ignore
    uni.createSelectorQuery().select(selector).fields({ node: true }, ({ node: canvas }) => {
      uni.canvasToTempFilePath({
        // @ts-ignore
        canvas,
        success: ({ tempFilePath }) => {
          resolve(tempFilePath);
        },
        fail: reject,
      });
    }).exec();
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
