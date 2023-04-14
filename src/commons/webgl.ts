import { createScopedThreejs } from 'threejs-miniprogram';

/**
 * 创建webgl渲染函数
 * @param canvas
 * @returns
 */
export function createWebglRender(canvas: any) {
  const THREE = createScopedThreejs(canvas);
  const { width, height } = canvas;
  // 几何体
  const geometry = new THREE.PlaneGeometry(width, height);

  // 材质
  const material = new THREE.MeshBasicMaterial();
  material.needsUpdate = true;

  const mesh = new THREE.Mesh(geometry, material);

  // 场景
  const scene = new THREE.Scene();
  scene.add(mesh);

  // 相机
  const camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 0.1, 10000);
  camera.position.set(0, 0, 1);
  camera.lookAt(scene.position);

  // 渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(2);

  return async (imgSrc: string) => {
    // 贴图
    const texture: any = await new Promise(resolve => new THREE.TextureLoader().load(imgSrc , resolve));
    texture.minFilter = THREE.LinearFilter;

    material.map = texture;

    await canvas.requestAnimationFrame(() => renderer.render(scene, camera));
  };
}

interface CreateVideoOptions {
  width?: number;
  height?: number;
  fps?: number;
  onProgress?: (progress: number) => void;
}

/**
 * 生成视频
 * @param frames
 * @param options
 * @returns
 */
export async function createRenderVideo(options?: CreateVideoOptions) {
  const { width = 300, height = 150, fps = 24 } = options || {};

  const canvas = wx.createOffscreenCanvas({ type: 'webgl', width, height });

  const render = createWebglRender(canvas);

  // 创建 mediaRecorder
  const recorder = wx.createMediaRecorder(canvas, { fps });

  // 启动 mediaRecorder
  await recorder.start();

  // 绘制
  async function renderVideo(frame: string) {
    await render(frame);
    await recorder.requestFrame();
  };

  renderVideo.stop = async function stop() {
    // 绘制完成，生成视频
    const { tempFilePath } = await recorder.stop();

    console.log('---- video end ----', tempFilePath);

    // 销毁
    recorder.destroy();

    return tempFilePath as string;
  }

  return renderVideo;
};
