// Lata alta (473 ml) em 3D com o rótulo da Audace Power. Gira arrastando (mouse ou dedo)
// e, parada, gira sozinha devagar. O rótulo vem da <img> de reserva dentro do container,
// que continua aparecendo se o WebGL não estiver disponível.
import {
  ACESFilmicToneMapping,
  CylinderGeometry,
  DoubleSide,
  Group,
  LatheGeometry,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
  BoxGeometry,
  DirectionalLight,
  CircleGeometry,
  MeshBasicMaterial,
  CanvasTexture,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Medidas em centímetros, de uma lata alta de energético (6,6 cm de diâmetro, 16,8 cm de altura).
const R = 3.3;
// O rótulo cobre o corpo reto inteiro (14,4 cm). Na proporção original ele daria 12,9 cm de altura
// (20,7 cm de volta ÷ 1600/990), então ele é ampliado 5% (cortando um pouco das laterais, sem texto)
// e esticado 6,5% na vertical.
const ROTULO_H = 14.4;
const AMPLIA = 1.05;
const BASE_Y = -ROTULO_H / 2;
const TOPO_Y = ROTULO_H / 2;

function sombraNoChao() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.55)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

export function montarLata(el: HTMLElement) {
  const img = el.querySelector('img');
  if (!img) return;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return; // sem WebGL: fica a imagem chapada
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const luz = new DirectionalLight(0xffe6c0, 1.4);
  luz.position.set(-6, 8, 10);
  scene.add(luz);

  const camera = new PerspectiveCamera(24, 1, 1, 200);
  camera.position.set(0, 1.2, 52);
  camera.lookAt(0, 0.2, 0);

  const lata = new Group();
  scene.add(lata);

  // Alumínio escovado do ombro, da tampa e do fundo.
  const aluminio = new MeshStandardMaterial({ color: 0xc4c1bd, metalness: 1, roughness: 0.3, side: DoubleSide });

  // Corpo com o rótulo (sem tampas: o ombro e o fundo fecham a lata).
  const rotulo = new MeshPhysicalMaterial({
    color: 0x2a0a12,
    metalness: 0.35,
    roughness: 0.32,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  });
  const fonte = new Image();
  fonte.crossOrigin = 'anonymous';
  fonte.onload = () => {
    const c = document.createElement('canvas');
    const W = 2048;
    c.width = W;
    c.height = Math.round((W * ROTULO_H) / (2 * Math.PI * R));
    // Amplia por igual (corta as pontas das laterais) e estica o resto na vertical.
    const dw = W * AMPLIA;
    c.getContext('2d')!.drawImage(fonte, (W - dw) / 2, 0, dw, c.height);
    const tex = new CanvasTexture(c);
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    rotulo.map = tex;
    rotulo.color.set(0xffffff);
    rotulo.needsUpdate = true;
    el.classList.add('pronta');
    desenhar();
  };
  fonte.src = img.currentSrc || img.src;
  const corpo = new Mesh(new CylinderGeometry(R, R, ROTULO_H, 128, 1, true), rotulo);
  lata.add(corpo);

  // Ombro, pescoço e borda da tampa (perfil girado em volta do eixo).
  const ombro = [
    [R, TOPO_Y - 0.01],
    [R - 0.12, TOPO_Y + 0.55],
    [R - 0.38, TOPO_Y + 1.2],
    [R - 0.55, TOPO_Y + 1.6],
    [R - 0.58, TOPO_Y + 1.8],
    [R - 0.5, TOPO_Y + 1.97], // borda enrolada
    [R - 0.6, TOPO_Y + 2.03],
    [R - 0.7, TOPO_Y + 1.95],
    [R - 0.72, TOPO_Y + 1.7], // parede interna até a tampa
  ].map(([x, y]) => new Vector2(x, y));
  lata.add(new Mesh(new LatheGeometry(ombro, 128), aluminio));

  // Tampa rebaixada.
  const tampa = new Mesh(new CircleGeometry(R - 0.72, 96), new MeshStandardMaterial({ color: 0xcfccc8, metalness: 1, roughness: 0.38 }));
  tampa.rotation.x = -Math.PI / 2;
  tampa.position.y = TOPO_Y + 1.7;
  lata.add(tampa);

  // Anel de abertura.
  const anel = new Mesh(new BoxGeometry(1.0, 0.06, 1.7), new MeshStandardMaterial({ color: 0xbdb8b2, metalness: 1, roughness: 0.25 }));
  anel.position.set(0, TOPO_Y + 1.75, 0.55);
  lata.add(anel);

  // Fundo afunilado com o domo.
  const fundo = [
    [R - 0.9, BASE_Y - 1.55],
    [R - 0.55, BASE_Y - 1.6],
    [R - 0.25, BASE_Y - 1.3],
    [R - 0.04, BASE_Y - 0.55],
    [R, BASE_Y + 0.01],
  ].map(([x, y]) => new Vector2(x, y));
  lata.add(new Mesh(new LatheGeometry(fundo, 128), aluminio));
  const domo = new Mesh(new CircleGeometry(R - 0.9, 64), aluminio);
  domo.rotation.x = Math.PI / 2;
  domo.position.y = BASE_Y - 1.3;
  lata.add(domo);

  // Sombra suave no chão.
  const sombra = new Mesh(
    new CircleGeometry(R * 1.9, 48),
    new MeshBasicMaterial({ map: sombraNoChao(), transparent: true, depthWrite: false }),
  );
  sombra.rotation.x = -Math.PI / 2;
  sombra.position.y = BASE_Y - 1.62;
  scene.add(sombra);

  lata.position.y = 0.4;
  // Começa mostrando a frente (centro do rótulo, "AUDACE POWER").
  let rotY = Math.PI - 0.25;
  let rotX = 0.08;
  let vel = 0;
  const AUTO = 0.0035;

  el.appendChild(renderer.domElement);

  function ajustar() {
    const w = el.clientWidth;
    const h = el.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Em telas estreitas a câmera recua para a lata caber inteira.
    camera.position.z = camera.aspect < 0.55 ? 52 * (0.55 / camera.aspect) * 0.9 : 52;
    camera.updateProjectionMatrix();
    desenhar();
  }

  function desenhar() {
    lata.rotation.set(rotX, rotY, 0);
    renderer.render(scene, camera);
  }

  // Arrastar para girar. Na horizontal gira; a rolagem vertical da página continua livre (touch-action: pan-y).
  let arrastando = false;
  let ultimoX = 0;
  let ultimoY = 0;
  let parado = 0;
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (e) => {
    arrastando = true;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    vel = 0;
    canvas.setPointerCapture(e.pointerId);
    el.classList.add('girando');
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!arrastando) return;
    const dx = e.clientX - ultimoX;
    const dy = e.clientY - ultimoY;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    vel = dx * 0.01;
    rotY += vel;
    rotX = Math.max(-0.35, Math.min(0.45, rotX + dy * 0.004));
  });
  const soltar = () => {
    arrastando = false;
    parado = performance.now();
    el.classList.remove('girando');
  };
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);

  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visivel = false;
  new IntersectionObserver(([en]) => {
    visivel = en.isIntersecting;
  }).observe(el);

  function quadro() {
    requestAnimationFrame(quadro);
    if (!visivel) return;
    if (!arrastando) {
      vel *= 0.94; // inércia depois de soltar
      rotY += vel;
      // Depois de um tempo parada, volta a girar sozinha e endireita a inclinação.
      if (!reduzir && Math.abs(vel) < 0.002 && performance.now() - parado > 1500) rotY += AUTO;
      rotX += (0.08 - rotX) * 0.03;
    }
    desenhar();
  }

  new ResizeObserver(ajustar).observe(el);
  ajustar();
  quadro();
}
