import { rgb } from 'color-convert';
import { HSL } from 'color-convert/conversions';
import { computed, getCurrentInstance, onMounted, reactive, Ref, ref, watch } from 'vue';

/**
 * 范围选择
 * @returns
 */
export function useRange(selector: string, onValueChanged?: () => void) {

  const offset = ref(0);

  let width: number;
  let left: number;

  onMounted(() => {
    uni.createSelectorQuery().in(getCurrentInstance()).select(selector).boundingClientRect((info) => {
      width = info.width!;
      left = info.left!;
    }).exec();
  });

  const onTouchStart = (e: any) => {
    const { clientX } = e.touches[0];
    setPoint(clientX);
  };
  const onTouchMove = (e: any) => {
    const { clientX } = e.touches[0];
    setPoint(clientX);
  };
  const onTouchEnd = (e: any) => {
    onValueChanged?.();
  };

  const setPoint = (x: number) => {
    x = (x - left) * 100 / width;
    if (x < 0) {
      x = 0;
    } else if (x > 100) {
      x = 100
    }
    offset.value = x;
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    offset,
  };
}

export function useHue(offset: Ref<number>) {
  const hValue = computed(() => {
    return 3.6 * offset.value;
  });
  const hColor = computed(() => {
    return `hsl(${Math.round(hValue.value)},100%,50%)`;
  });

  return { hValue, hColor };
}

export function useAlpha(offset: Ref<number>) {
  const aValue = computed(() => {
    return (100 - offset.value) / 100;
  });

  return { aValue };
}

/**
 * 色相亮度选择
 * @returns
 */
export function useSLRange(onValueChanged?: () => void) {

  const point = reactive({ x: 0, y: 0 });

  const sValue = computed(() => {
    return point.x;
  });

  const lValue = computed(() => {
    return 100 - point.y;
  });

  let width: number;
  let height: number;
  let left: number;
  let top: number;

  onMounted(() => {
    uni.createSelectorQuery().in(getCurrentInstance()).select('#colorSL').boundingClientRect((info) => {
      width = info.width!;
      height = info.height!;
      left = info.left!;
      top = info.top!;
    }).exec();
  });

  const onSLTouchStart = (e: any) => {
    const { clientX, clientY } = e.touches[0];
    setPoint(clientX, clientY);
  };
  const onSLTouchMove = (e: any) => {
    const { clientX, clientY } = e.touches[0];
    setPoint(clientX, clientY);
  };
  const onSLTouchEnd = (e: any) => {
    onValueChanged?.();
  };

  const setPoint = (x: number, y: number) => {
    x = (x - left) * 100 / width;
    y = (y - top) * 100 / height;
    if (x < 0) {
      x = 0;
    } else if (x > 100) {
      x = 100
    }
    if (y < 0) {
      y = 0;
    } else if (y > 100) {
      y = 100
    }
    point.x = x;
    point.y = y;
  };

  return {
    onSLTouchStart,
    onSLTouchMove,
    onSLTouchEnd,
    point,
    sValue,
    lValue,
  };
}

export enum MODE {
  RGB = 1,
  HSL = 2,
  HEX = 3,
}

export function useModeSwitch(hslValue: Ref<string>) {
  const mode = ref(MODE.RGB);
  const form = reactive({
    r: 0,
    g: 0,
    b: 0,
    h: 0,
    s: 0,
    l: 0,
    hex: '#000',
  });

  const setForm = (v: string) => {
    const rgbValue = v.match(/\d+/g) as unknown as HSL;
    if (mode.value === MODE.RGB) {
      const [r, g, b] = rgbValue;
      form.r = r;
      form.g = g;
      form.b = b;
    } else if (mode.value === MODE.HSL) {
      const [h, s, l] = rgb.hsl(rgbValue);
      form.h = h;
      form.s = s;
      form.l = l;
    } else {
      form.hex = '#' + rgb.hex(rgbValue);
    }
  };

  const onSwitch = () => {
    mode.value = mode.value % 3 + 1;
    console.log('模式切换', mode.value);
    setForm(hslValue.value);
  };

  watch(hslValue, (v) => {
    setForm(v);
  }, { immediate: true });

  return {
    mode,
    form,
    onSwitch,
  };
}
