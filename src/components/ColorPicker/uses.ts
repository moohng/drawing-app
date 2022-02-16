import { computed, onMounted, reactive, Ref, ref } from 'vue';

/**
 * 范围选择
 * @returns
 */
export function useRange(selector: string) {

  const offset = ref(0);

  let width: number;
  let left: number;

  onMounted(() => {
    uni.createSelectorQuery().select(selector).boundingClientRect((info) => {
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
    // console.log('========onTouchEnd', e);
  };

  const setPoint = (x: number) => {
    x = (x - left) * 100 / width;
    if (x < 0) {
      x = 0;
    } else if (x > 100) {
      x = 100
    }
    offset.value = Math.round(x);
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
export function useSLRange() {

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
    console.log('ready')
    uni.createSelectorQuery().select('#colorSL').boundingClientRect((info) => {
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
    // console.log('========onSLTouchEnd', e);
    // console.log('-------', point);
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
