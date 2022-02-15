import { computed, onMounted, reactive, ref } from 'vue';

/**
 * 色相选择
 * @returns
 */
export function useHRange() {

  const hOffset = ref(0);
  const hValue = computed(() => {
    return 3.6 * hOffset.value;
  });
  const hColor = computed(() => {
    return `hsl(${Math.round(hValue.value)},100%,50%)`;
  });

  let width: number;
  let left: number;

  onMounted(() => {
    console.log('ready')
    uni.createSelectorQuery().select('#colorH').boundingClientRect((info) => {
      width = info.width!;
      left = info.left!;
    }).exec();
  });

  const onHTouchStart = (e: any) => {
    const { clientX } = e.touches[0];
    setPoint(clientX);
  };
  const onHTouchMove = (e: any) => {
    const { clientX } = e.touches[0];
    setPoint(clientX);
  };
  const onHTouchEnd = (e: any) => {
    // console.log('========onHTouchEnd', e);
  };

  const setPoint = (x: number) => {
    x = (x - left) * 100 / width;
    if (x < 0) {
      x = 0;
    } else if (x > 100) {
      x = 100
    }
    hOffset.value = x;
  };

  return {
    onHTouchStart,
    onHTouchMove,
    onHTouchEnd,
    hValue,
    hOffset,
    hColor,
  };
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
