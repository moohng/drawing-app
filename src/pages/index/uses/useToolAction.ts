import * as dan from '@moohng/dan';
import { useStore } from 'vuex';
import { TypeKeys } from '@/store/types';
import { Paint } from '@/commons/Paint';
import { Ref, ref } from 'vue';
import { addPath } from '@/commons/api';
import { PageMode } from '../types';

export interface Emits {
  (event: 'save', code: string): void;
  (event: 'preview'): void;
}

export interface Props {
  paint?: Paint;
}

export function usePanelAction(emit: Emits, props: Props) {
  const { state, getters, commit } = useStore();

  const handleUndo = () => {
    if (state.currentStepIndex < 0) {
      return uni.showToast({ title: (state.historyStepList.length ? '长按可清空画布~' : '没有上一步了~'), icon: 'none' });
    }
    commit(TypeKeys.OPERATION_UNDO);
    props.paint?.clear();
    props.paint?.setImageData(getters.currentStep || state.lastStep);
  };

  const handleRedo = () => {
    if (state.currentStepIndex >= state.historyStepList.length - 1) return uni.showToast({ title: '已经是最后一步了~', icon: 'none' });
    commit(TypeKeys.OPERATION_REDO);
    props.paint?.clear();
    props.paint?.setImageData(getters.currentStep);
  };

  const handleClear = () => {
    if (!state.historyStepList.length) return uni.showToast({ title: '没有可清除的内容！', icon: 'none' });
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
          commit(TypeKeys.OPERATION_CLEAR);
        }
      },
    });
  };

  const handlePreview = () => {
    if (state.currentPathIndex < 0) {
      return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
    }
    emit('preview');
  };

  return { handleUndo, handleRedo, handleClear, handlePreview };
}

export function useSaveAction() {
  const showDialog = ref(false);
  const pwd = ref('');
  let code: string;

  const handleSave = (text = dan.random(8) as string) => {
    code = text;
    showDialog.value = true;
  };

  const { getters } = useStore();

  const handleSaveConfirm = (index: number | string) => {
    if (index === 1 && !pwd.value) {
      return uni.showToast({ title: '请输入一个口令', icon: 'none' });
    }
    if (index !== 'mask') {
      addPath({
        code,
        path: getters.currentPathList,
        pwd: pwd.value,
        background: getters.backgroundColor,
      }).then(() => {
        uni.navigateTo({ url: '/pages/play/index?code=' + code });
      });
    }
    showDialog.value = false;
    pwd.value = '';
  };

  return { pwd, showDialog, handleSave, handleSaveConfirm };
}

export function usePreviewAction(paint: Ref<Paint | undefined>) {
  const { getters } = useStore();

  const isPreview = ref(false);

  const handlePreview = () => {
    isPreview.value = true;
    paint.value?.clear();
    paint.value?.playPath((getters.currentPathList), handleEndPreview);
  };

  const handleEndPreview = () => {
    isPreview.value = false;
    paint.value?.pause();
    paint.value?.clear();
    paint.value?.setImageData(getters.currentStep);
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
