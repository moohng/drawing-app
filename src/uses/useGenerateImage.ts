/**
 * 根据 Canvas 生成图片
 * @param selector canvas选择器
 * @returns 图片路径
 */
export const useGenerateImage = async (selector: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    uni
    .createSelectorQuery()
    .select(selector)
    .fields(
      {
        // @ts-ignore
        node: true,
        size: true,
      },
      ({ node: canvas }: any) => {
        uni.canvasToTempFilePath({
          // @ts-ignore
          canvas,
          success: ({ tempFilePath }) => {
            resolve(tempFilePath);
          },
          fail: reject,
        });
      }
    )
    .exec();
  });
}
