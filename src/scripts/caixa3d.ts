// Caixa de presente da Bravus em 3D, montada a partir da faca (arte aberta). Cada face usa um recorte
// da arte em public/cases/bravus/caixa-*.jpg. Gira arrastando (mouse ou dedo) e, parada, gira sozinha.
import {
  NeutralToneMapping,
  BoxGeometry,
  CanvasTexture,
  CircleGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Medidas da faca, em centímetros: 25 de frente, 20 de fundo e 8,4 de altura.
const L = 25;
const P = 20;
const A = 8.4;

function sombraNoChao() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.6)');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new CanvasTexture(c);
}

export function montarCaixa(el: HTMLElement) {
  const img = el.querySelector('img');
  if (!img) return;
  // As faces ficam na mesma pasta da foto de reserva (assim o prefixo da prévia vale para elas também).
  const base = (img.currentSrc || img.src).replace(/[^/]*$/, '');

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return; // sem WebGL: fica a foto
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.75; // menos reflexo branco: o vermelho da arte fica mais fiel
  const luz = new DirectionalLight(0xffe2cc, 1.2);
  luz.position.set(-10, 18, 14);
  scene.add(luz);

  const camera = new PerspectiveCamera(26, 1, 1, 400);

  const caixa = new Group();
  scene.add(caixa);

  // Ordem das faces do BoxGeometry: direita, esquerda, tampa, fundo, frente, trás.
  const nomes = ['dir', 'esq', 'tampa', 'fundo', 'frente', 'tras'];
  const loader = new TextureLoader();
  let carregadas = 0;
  const materiais = nomes.map((n) => {
    const tex = loader.load(`${base}caixa-${n}.jpg`, () => {
      carregadas++;
      if (carregadas === nomes.length) el.classList.add('pronta');
      desenhar();
    });
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    // Papel cartão com verniz: pouco brilho, sem cara de plástico.
    return new MeshPhysicalMaterial({ map: tex, roughness: 0.55, metalness: 0, clearcoat: 0.35, clearcoatRoughness: 0.4 });
  });
  caixa.add(new Mesh(new BoxGeometry(L, A, P), materiais));

  const sombra = new Mesh(
    new CircleGeometry(L * 0.85, 48),
    new MeshBasicMaterial({ map: sombraNoChao(), transparent: true, depthWrite: false }),
  );
  sombra.rotation.x = -Math.PI / 2;
  sombra.scale.set(1, 0.8, 1);
  sombra.position.y = -A / 2 - 3.2;
  scene.add(sombra);

  // Começa mostrando a tampa ("Toma um Bravus de presente") e a frente.
  let rotY = -0.55;
  let rotX = 0.62;
  let vel = 0;
  const AUTO = 0.003;

  el.appendChild(renderer.domElement);

  function ajustar() {
    const w = el.clientWidth;
    const h = el.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const dist = camera.aspect < 1 ? 78 / camera.aspect : 78;
    camera.position.set(0, 4, dist);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    desenhar();
  }

  let flutua = 0;
  function desenhar() {
    caixa.rotation.set(rotX, rotY, 0, 'YXZ');
    caixa.position.y = Math.sin(flutua) * 0.6;
    renderer.render(scene, camera);
  }

  // Arrastar gira para os lados e inclina para ver a tampa ou o fundo.
  let arrastando = false;
  let ultimoX = 0;
  let ultimoY = 0;
  let parado = 0;
  const canvas = renderer.domElement;
  canvas.addEventListener('pointerdown', (e: PointerEvent) => {
    arrastando = true;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    vel = 0;
    canvas.setPointerCapture(e.pointerId);
    el.classList.add('girando');
  });
  canvas.addEventListener('pointermove', (e: PointerEvent) => {
    if (!arrastando) return;
    const dx = e.clientX - ultimoX;
    const dy = e.clientY - ultimoY;
    ultimoX = e.clientX;
    ultimoY = e.clientY;
    vel = dx * 0.01;
    rotY += vel;
    rotX = Math.max(-1.3, Math.min(1.3, rotX + dy * 0.008));
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
      vel *= 0.94;
      rotY += vel;
      const ocioso = performance.now() - parado > 1800;
      if (!reduzir && Math.abs(vel) < 0.002 && ocioso) {
        rotY += AUTO;
        rotX += (0.5 - rotX) * 0.02; // volta devagar a mostrar a tampa
      }
      if (!reduzir) flutua += 0.02;
    }
    desenhar();
  }

  new ResizeObserver(ajustar).observe(el);
  ajustar();
  quadro();
}
