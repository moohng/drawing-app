import * as dan from '@moohng/dan';
import { useStore } from 'vuex';
import { TypeKeys } from '@/store/types';
import { useGenerateImage } from '@/uses/useGenerateImage';
import { download, showLoading } from '@/commons/utils';
import { Paint } from '@/commons/Paint';
import { Ref, ref } from 'vue';
import { addPath } from '@/commons/api';

export interface Emits {
  (event: 'save', code: string): void;
  (event: 'preview'): void;
}

export interface Props {
  paint?: Paint;
}

export  function useToolAction(emit: Emits, props: Props) {

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

  const handleDownload = async () => {
    if (state.currentPathIndex < 0) {
      return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
    }

    showLoading('正在生成图片...');
    // 绘制背景
    props.paint?.setBackground(getters.backgroundColor);
    props.paint?.setImageData(getters.currentStep);

    // 生成图片
    const shareImg = await useGenerateImage('drawCanvas');

    // 去掉背景
    props.paint?.clear();
    props.paint?.setImageData(getters.currentStep);

    // #ifndef H5
    uni.saveImageToPhotosAlbum({
      filePath: shareImg,
      success: () => {
        uni.showToast({ title: '已保存！', icon: 'none' });
      },
      fail: () => {
        uni.showToast({ title: '保存失败！', icon: 'none' });
      },
      complete: () => {
        uni.hideLoading();
      },
    });
    // #endif
    // #ifdef H5
    download(shareImg);
    uni.hideLoading();
    // #endif
  };

  const handleShare = () => {
    if (state.currentPathIndex < 0) {
      return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
    }
    // 生成随机口令
    const code = dan.random(8) as string;
    emit('save', code);
  };

  return {
    handleUndo,
    handleRedo,
    handleClear,
    handlePreview,
    handleDownload,
    handleShare,
  };
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
