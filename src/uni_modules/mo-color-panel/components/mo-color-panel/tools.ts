import { rgb, hex, hsl } from 'color-convert';
import { HSL, RGB } from 'color-convert/conversions';

export function toHSVA(value: string) {
  let defaultHSV: HSL = [0, 0, 0];
  let defaultAlpha = 1;
  if (/^#/.test(value)) {
    defaultHSV = hex.hsv(value);
    const hexAlpha = value.match(/[\da-f]{6}([\da-f]{2})/)?.[1] || 'ff'
    defaultAlpha = parseInt(hexAlpha, 16) / 0xff;
  } else {
    const matchedArr = value.match(/\d*\.*\d+/g) || defaultHSV;
    defaultAlpha = matchedArr[3] ? parseFloat(matchedArr[3] as string) : 1;
    if (/^rgb/.test(value)) {
      defaultHSV = rgb.hsv(matchedArr as unknown as RGB);
    } else if (/^hsl/.test(value)) {
      defaultHSV = hsl.hsv(matchedArr as unknown as HSL);
    } else if (/^hsv/.test(value)) {
      defaultHSV = matchedArr.slice(0, 3) as unknown as HSL;
    }
  }
  
  return { hsv: defaultHSV, alpha: parseFloat(defaultAlpha.toFixed(2)) };
}