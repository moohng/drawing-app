import { useStore } from '@/store';
import { Paint } from '@/commons/Paint';
import { Ref, ref } from 'vue';
import { PageMode } from '../types';

export interface Emits {
  (event: 'save'): void;
  (event: 'preview'): void;
}

export interface Props {
  paint?: Paint;
}

export function usePanelAction(emit: Emits, props: Props) {
  const store = useStore();

  const handleUndo = () => {
    if (store.currentStepIndex < 0) {
      return uni.showToast({ title: (store.historyStepList.length ? '长按可清空画布~' : '没有上一步了~'), icon: 'none' });
    }
    store.operationUndo();
    props.paint?.clear();
    props.paint?.setImageData(store.currentStep || store.lastStep);
  };

  const handleRedo = () => {
    if (store.currentStepIndex >= store.historyStepList.length - 1) return uni.showToast({ title: '已经是最后一步了~', icon: 'none' });
    store.operationRedo();
    props.paint?.clear();
    props.paint?.setImageData(store.currentStep);
  };

  const handleClear = () => {
    if (!store.historyStepList.length) return uni.showToast({ title: '没有可清除的内容！', icon: 'none' });
    uni.showModal({
      title: '警告！',
      content: '确定要清空画布上所有的内容和历史记录吗？',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#dd524d',
      success: (res) => {
        if (res.confirm) {
          props.paint?.clear();
          store.operationClear();
        }
      },
    });
  };

  const handlePreview = () => {
    if (store.currentPathIndex < 0) {
      return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
    }
    emit('preview');
  };

  return { handleUndo, handleRedo, handleClear, handlePreview };
}

export function usePreviewAction(paint: Ref<Paint>) {
  const store = useStore();

  const isPreview = ref(false);

  const handlePreview = async () => {
    isPreview.value = true;
    paint.value.clear();

    await paint.value.playPath({
      path: store.currentPathList,
    });

    handleEndPreview();
  };

  const handleEndPreview = () => {
    isPreview.value = false;
    paint.value.pause();
    paint.value.clear();
    paint.value.setImageData(store.currentStep);
  };

  return { isPreview, handlePreview, handleEndPreview };
}

export function useMenuAction() {
  const showMenu = ref(false);

  const openMenu = () => {
    showMenu.value = true;
  };

  const hideMenu = () => {
    showMenu.value = false;
  };

  return { showMenu, openMenu, hideMenu };
}

export function useCopyAction(mode: Ref<PageMode>) {
  const canvasBg = ref<string>();
  const isBgEdit = ref(false);
  const bgShow = ref(true);

  const openAlbum = () => {
    uni.chooseImage({
      count: 1,
      success: ({ tempFilePaths }) => {
        isBgEdit.value = true;
        canvasBg.value = tempFilePaths[0];
        mode.value = PageMode.COPY;
      },
      fail: () => {
        if (mode.value !== PageMode.COPY) {
          uni.showToast({ title: '请选择一张图片', icon: 'none' });
        }
      },
    });
  };

  const onToggleBg = (isOpen: boolean) => {
    bgShow.value = isOpen;
  };

  return {
    canvasBg,
    isBgEdit,
    bgShow,
    openAlbum,
    onToggleBg,
  };
}
