import { createStore } from 'vuex';
import mutations from './mutations';
import { State } from './types';

export const initState: State = {
  path: [],
  color: '#000000',
  backgroundColor: '#ffffff',
  width: 4,
  play: false,

  code: '秦丹',
  // previewMode: !!code && edit === undefined,

  showPreviewCover: false,
  showPwdDialog: false,
  isSave: false,

  preview: false,

  env: '',
}

const store = createStore({
  state: initState,
  mutations,
});

export default store;
