(function () {
  'use strict';

  var stage = document.getElementById('liquidCardRing');
  var THREE = window.THREE;
  var shaders = window.LIQUID_RING_SHADERS;
  if (!stage || !THREE || !shaders) return;

  var MAX_PLANES = shaders.MAX_PLANES;
  var MAX_LINKS = shaders.MAX_LINKS;
  var TAU = Math.PI * 2;
  var HALF_PI = Math.PI / 2;
  var DEG = Math.PI / 180;
  var FAN_START = 0.06;

  // Replace these rows with the work you want to show. The atlas keeps the
  // image paths local, so the effect still works when this site is deployed
  // without the original Next app.
  var PROJECTS = [
    { name: 'PTEscore', type: 'EdTech · AI Learning', year: '2026', image: 'images/product-ptescore-showcase.png', href: 'project-ptescore.html' },
    { name: 'IELTSync', type: 'EdTech · Study Platform', year: '2026', image: 'images/product-ieltsync-showcase.png', href: 'project-ieltsync.html' },
    { name: 'TruePathway', type: 'Web & iOS · Demo', year: '2026', image: 'images/product-truepathway-showcase.png', href: 'project-truepathway.html' },
    { name: 'FrameDreaming', type: 'Creative AI · Visual Storytelling', year: '2026', image: 'images/product-framedreaming-showcase.png', href: 'project-framedreaming.html' },
    { name: 'Student Support Admin Dashboard', type: 'Internal System · Operations', year: '2026', image: 'student-support-admin-dashboard-overview.png', href: 'project-student-support-admin-dashboard.html' },
    { name: '2600 Design', type: 'Web Design · Branding', year: '2025', image: 'img-2600design-desktop.png', href: 'project-2600-design.html' },
    { name: 'Cloudy Clothing', type: 'WordPress · Ecommerce', year: '2025', image: 'cloudyclothing.webp', href: 'project-cloudy-clothing.html' },
    { name: 'Green Bloom Matcha', type: 'Shopify · Ecommerce', year: '2025', image: 'shopify-hero.png', href: 'project-shopify-store.html' },
    { name: 'Student Support Service Portal', type: 'Service Portal · React', year: '2025', image: 'student-support-portal.png', href: 'project-student-support-service-portal.html' },
    { name: 'Rainy Hour', type: 'Creative Development', year: '2025', image: 'img-rainyhour-desktop.png', href: 'https://florash.github.io/rainyhour/' },
    { name: "Adopt Don't Shop", type: 'Graphic Design · Campaign', year: '2025', image: 'adpot dont shop.png', href: 'https://florash.github.io/adopt-dont-shop/' },
    { name: 'SEO & Website Performance Audit', type: 'SEO · Web Audit', year: '2025', image: 'giannisitalian_card_v3.png', href: 'giannisitalian_audit_v8.pdf' },
    { name: 'Stockwise', type: 'React · FastAPI', year: '2025', image: 'img-stockwise-desktop.png', href: 'https://stockwise-pi.vercel.app' },
    { name: 'I Love Wallpaper', type: 'UI Design · Mobile', year: '2025', image: 'img-wallpaper-desktop.png', href: 'https://florash.github.io/i-love-wallpaper/' }
  ];
  var COUNT = PROJECTS.length;

  var params = {
    refWidth: 1512,
    refHeight: 870,
    minScale: 0.5,
    maxScale: 1.75,
    narrowAt: 1024,
    narrowPlane: 1.25,
    narrowRadius: 1.3,
    narrowPosX: -2.0,
    narrowEndScale: 4.22,
    tightAt: 640,
    tightRadius: 0.82,
    tightPosX: -2.15,
    planeSize: 96,
    // The source demo owns the entire viewport. This section is a narrower,
    // taller slice inside the portfolio, so a slightly tighter arc keeps the
    // neighbouring cards visible instead of leaving only the front card on
    // screen.
    ringRadius: 230,
    seed: 0,
    radial: true,
    radius: 6,
    blend: 14,
    endScale: 4.46,
    posX: -1.35,
    posY: -0.08,
    spinTurns: 1,
    launchTime: 1.95,
    spreadTime: 3.6,
    stageAt: 0.7,
    spinTime: 2.6,
    moveTime: 2.2,
    moveDelay: 0.2,
    damping: 0.94,
    scrollSpeed: 0.0022,
    maxSpeed: 12,
    dragSpeed: 1,
    snapTime: 0.8,
    snapFrom: 1,
    pickTime: 0.55,
    glass: true,
    bandTop: 0.08,
    bandBottom: 0.08,
    refract: 60,
    squeeze: 0.05,
    ripple: 5,
    rippleFreq: 0.02,
    fringe: 1.5,
    sheen: 0.05,
    hover: true,
    lag: 0.3,
    melt: 34,
    meltReach: 260,
    reach: 1.7,
    swell: 0.09,
    pull: 26,
    grab: 0.14,
    release: 0.06,
    web: 0.2,
    webReach: 1.15,
    wave: 4,
    waveFreq: 0.05,
    waveSpeed: 7,
    sideScale: 0.035,
    sidePush: 17,
    sideDim: 0.1,
    sideReach: 2.4,
    focusParticleReach: 82,
    focusParticleCell: 11,
    focusParticleOpacity: 0.58,
    focusParticleEnter: 0.16,
    focusParticleExit: 0.11,
    focusParticleDrift: 0.7,
    focusParticleOut: 3.2,
    assembleTime: 1.55,
    assembleSpread: 3.8,
    assembleCardScale: 2.6,
    assembleCell: 13,
    assembleOpacity: 0.96,
    assembleHaloReach: 148,
    assembleHaloOpacity: 0.72,
    stagger: 0.34,
    thread: 1.1,
    threadMin: 0.08,
    thin: 0.4,
    pinch: 0.35,
    sag: 6,
    dissolve: 0.8,
    fillet: 14,
    // The target is a page section rather than the source's full-screen
    // canvas. A slightly narrower blend keeps nearby cards liquid without
    // turning the whole left arc into one opaque blob.
    goo: 7,
    wobble: 3,
    focusParticleFrom: 0
  };

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  function smoothstep(a, b, x) {
    var t = clamp01((x - a) / (b - a));
    return t * t * (3 - 2 * t);
  }

  function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
  }

  function easeInOutCubic(x) {
    return x < 0.5
      ? 4 * x * x * x
      : 1 - Math.pow(-2 * x + 2, 3) / 2;
  }

  function chase(dt, rate) {
    return 1 - Math.pow(1 - rate, dt * 60);
  }

  function signedOffset(i) {
    return i === 0 ? 0 : i % 2 === 1 ? (i + 1) / 2 : -i / 2;
  }

  function blankTexture(rgba) {
    var t = new THREE.DataTexture(
      new Uint8Array(rgba || [255, 255, 255, 255]),
      1,
      1,
      THREE.RGBAFormat,
    );
    t.needsUpdate = true;
    return t;
  }

  function createAsciiTexture() {
    var glyphs = '.:+x*#@';
    var cell = 128;
    var canvas = document.createElement('canvas');
    canvas.width = cell * glyphs.length;
    canvas.height = cell;
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 84px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (var i = 0; i < glyphs.length; i++) {
      ctx.fillText(glyphs[i], i * cell + cell * 0.5, cell * 0.51);
    }
    var texture = new THREE.CanvasTexture(canvas);
    if ('encoding' in texture && THREE.LinearEncoding) texture.encoding = THREE.LinearEncoding;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.needsUpdate = true;
    return texture;
  }

  function buildAtlas() {
    var cellW = 512;
    var cellH = Math.round(cellW / 1.5);
    var cols = Math.ceil(Math.sqrt(COUNT));
    var rows = Math.ceil(COUNT / cols);
    var canvas = document.createElement('canvas');
    canvas.width = cols * cellW;
    canvas.height = rows * cellH;
    var ctx = canvas.getContext('2d');
    var texture = new THREE.CanvasTexture(canvas);
    texture.flipY = false;
    if ('encoding' in texture && THREE.LinearEncoding) texture.encoding = THREE.LinearEncoding;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;

    function fallback(i) {
      var x = (i % cols) * cellW;
      var y = Math.floor(i / cols) * cellH;
      var gradient = ctx.createLinearGradient(x, y, x + cellW, y + cellH);
      gradient.addColorStop(0, '#d9d8e8');
      gradient.addColorStop(1, '#f1d8d6');
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, cellW, cellH);
    }

    // Never leave an atlas cell transparent while the real artwork is loading.
    // A transparent CanvasTexture samples as black in the shader, which makes
    // a slow local-file load look like a broken black card.
    for (var blank = 0; blank < COUNT; blank++) fallback(blank);
    texture.needsUpdate = true;

    function paint(img, i) {
      var x = (i % cols) * cellW;
      var y = Math.floor(i / cols) * cellH;
      var scale = Math.max(cellW / img.width, cellH / img.height);
      var dw = img.width * scale;
      var dh = img.height * scale;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, cellW, cellH);
      ctx.clip();
      ctx.drawImage(img, x + (cellW - dw) / 2, y + (cellH - dh) / 2, dw, dh);
      ctx.restore();
    }

    function loadOne(i) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.decoding = 'async';
        img.onload = function () {
          try {
            paint(img, i);
          } catch (error) {
            fallback(i);
          }
          resolve();
        };
        img.onerror = function () {
          fallback(i);
          resolve();
        };
        img.src = PROJECTS[i].image;
      });
    }

    var tasks = PROJECTS.map(function (_, i) {
      return loadOne(i);
    });
    var first = tasks[0].then(function () {
      texture.needsUpdate = true;
    });
    var ready = Promise.all(tasks).then(function () {
      texture.needsUpdate = true;
    });
    return { texture: texture, grid: [cols, rows], first: first, ready: ready };
  }

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var asciiTexture = createAsciiTexture();
  var renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (error) {
    console.error('[liquid-ring] WebGL is unavailable', error);
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);
  stage.appendChild(renderer.domElement);

  var scene = new THREE.Scene();
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -100, 100);
  var state = { progress: 0, launch: 0, spread: 0, spin: 0, shift: 0 };
  var uniforms = {
    uResolution: { value: new THREE.Vector2(1, 1) },
    uSize: { value: new THREE.Vector2(150, 100) },
    uRadius: { value: params.radius },
    uCount: { value: COUNT },
    uPos: { value: Array.from({ length: MAX_PLANES }, function () { return new THREE.Vector2(); }) },
    uRot: { value: new Float32Array(MAX_PLANES) },
    uScale: { value: Array.from({ length: MAX_PLANES }, function () { return new THREE.Vector4(0, 0, 1, 0); }) },
    uLinkCount: { value: 0 },
    uLinkA: { value: Array.from({ length: MAX_LINKS }, function () { return new THREE.Vector2(); }) },
    uLinkB: { value: Array.from({ length: MAX_LINKS }, function () { return new THREE.Vector2(); }) },
    uLinkPar: { value: Array.from({ length: MAX_LINKS }, function () { return new THREE.Vector4(-100, -100, 0, 0); }) },
    uK: { value: params.goo },
    uWobble: { value: params.wobble },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#f7fbff') },
    uParticleColor: { value: new THREE.Color('#7897aa') },
    uLiquidWhite: { value: new THREE.Color('#ffffff') },
    uLiquidBlue: { value: new THREE.Color('#a6dce8') },
    uLiquidPink: { value: new THREE.Color('#efb6cf') },
    uPage: { value: new THREE.Color('#fafafa') },
    uAtlas: { value: blankTexture() },
    uGrid: { value: new THREE.Vector2(1, 1) },
    uBlend: { value: params.blend },
    uTextured: { value: 0 },
    uAsciiTex: { value: asciiTexture },
    uIntro: { value: new THREE.Vector4(1, 1, 12, 0) },
    uCardParticles: { value: new THREE.Vector4(1, 0, 12, 0) },
    uFocusParticlePos: { value: new THREE.Vector2() },
    uFocusParticleBox: { value: new THREE.Vector4() },
    uFocusParticles: { value: new THREE.Vector4() },
    uFocusParticleMotion: { value: new THREE.Vector2() },
    uMouse: { value: new THREE.Vector4() },
    uMelt: { value: new THREE.Vector4() },
    uTagTex: { value: blankTexture([0, 0, 0, 0]) },
    uTag: { value: new THREE.Vector4() },
    uTagP: { value: new THREE.Vector4() },
    uTagQ: { value: new THREE.Vector4() },
    uBandTop: { value: 0 },
    uBandBottom: { value: 0 },
    uGlass: { value: new THREE.Vector4() },
    uFringe: { value: 0 },
    uSheen: { value: 0 }
  };

  var mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      vertexShader: shaders.vertexShader,
      fragmentShader: shaders.fragmentShader,
      uniforms: uniforms,
      transparent: true,
      depthWrite: false,
      extensions: { derivatives: true }
    }),
  );
  mesh.renderOrder = 10;
  scene.add(mesh);

  var atlas = buildAtlas();
  uniforms.uAtlas.value.dispose();
  uniforms.uAtlas.value = atlas.texture;
  uniforms.uGrid.value.set(atlas.grid[0], atlas.grid[1]);
  uniforms.uAtlas.value.anisotropy = renderer.capabilities.getMaxAnisotropy();
  var atlasReady = false;
  atlas.ready.then(function () {
    atlasReady = true;
  });

  var viewW = 1;
  var viewH = 1;
  var fit = 1;
  var planeK = 1;
  var radiusK = 1;
  var narrowNow = false;
  var tightNow = false;
  var bounds = { left: 0, top: 0 };
  var ringCentre = { x: 0, y: 0 };
  var frontAngle = 0;
  var projectListButtons = [];
  var rest = Array.from({ length: MAX_PLANES }, function () { return new THREE.Vector2(); });
  var travel = new Float32Array(MAX_PLANES);
  var cum = new Float32Array(MAX_PLANES);
  var hoverF = new Float32Array(MAX_PLANES);
  var leanX = new Float32Array(MAX_PLANES);
  var leanY = new Float32Array(MAX_PLANES);
  var sideF = new Float32Array(MAX_PLANES);
  var webF = new Float32Array(MAX_LINKS);
  var order = [];
  var focusPos = new THREE.Vector2();
  var shown = -1;
  var over = -1;
  var particleCard = -1;
  var particleAmount = 0;
  var particleFlow = 0;
  var interactive = false;
  var dragging = false;
  var picking = null;
  var spinVel = 0;
  var settling = false;
  var snapTo = 0;
  var snapCap = 0;
  var pointerTravel = 0;
  var travelX = 0;
  var travelY = 0;
  var dragPrevAngle = 0;
  var dragPrevTime = 0;
  var pointer = { x: 0, y: 0, inside: false, seeded: false };
  var cursor = { x: 0, y: 0, amt: 0, wake: 0 };
  var coarse = false;
  var held = false;
  var holdTimer = 0;

  function refit() {
    var s = viewW / Math.max(1, params.refWidth);
    fit = Math.min(params.maxScale, Math.max(params.minScale, s));
    narrowNow = viewW <= params.narrowAt;
    tightNow = viewW <= params.tightAt;
    planeK = narrowNow ? params.narrowPlane : 1;
    radiusK = (narrowNow ? params.narrowRadius : 1) * (tightNow ? params.tightRadius : 1);
  }

  function updateBounds() {
    var rect = stage.getBoundingClientRect();
    bounds.left = rect.left;
    bounds.top = rect.top;
  }

  function resize() {
    viewW = Math.max(1, stage.clientWidth);
    viewH = Math.max(1, stage.clientHeight);
    refit();
    renderer.setSize(viewW, viewH, false);
    camera.left = -viewW / 2;
    camera.right = viewW / 2;
    camera.top = viewH / 2;
    camera.bottom = -viewH / 2;
    camera.updateProjectionMatrix();
    mesh.scale.set(viewW, viewH, 1);
    uniforms.uResolution.value.set(viewW, viewH);
    updateBounds();
  }

  function pointerAngle(e) {
    updateBounds();
    var dx = e.clientX - bounds.left - ringCentre.x;
    var dy = e.clientY - bounds.top - ringCentre.y;
    return Math.atan2(-dy, dx);
  }

  function trackPointer(e) {
    updateBounds();
    coarse = e.pointerType === 'touch';
    pointer.x = e.clientX - bounds.left - viewW * 0.5;
    pointer.y = viewH * 0.5 - (e.clientY - bounds.top);
    pointer.inside = true;
    if (!pointer.seeded) {
      pointer.seeded = true;
      cursor.x = pointer.x;
      cursor.y = pointer.y;
    }
  }

  function endHold() {
    clearTimeout(holdTimer);
    holdTimer = 0;
    held = false;
  }

  function beginHold() {
    endHold();
    holdTimer = setTimeout(function () {
      held = true;
    }, 160);
  }

  function engaged() {
    return coarse ? held : pointer.inside;
  }

  function stopPick() {
    picking = null;
  }

  function pick(i, now) {
    var slot = TAU / COUNT;
    var base = frontAngle - params.seed * DEG - signedOffset(i) * slot;
    var target = base + Math.round((state.spin - base) / TAU) * TAU;
    var slots = Math.abs(target - state.spin) / slot;
    if (slots < 0.01) {
      openProject(projectIndexForPlane(i));
      return;
    }
    spinVel = 0;
    settling = false;
    picking = {
      from: state.spin,
      to: target,
      start: now,
      duration: params.pickTime * Math.sqrt(Math.max(1, slots))
    };
  }

  function projectIndexForPlane(plane) {
    return ((COUNT - signedOffset(plane)) % COUNT + COUNT) % COUNT;
  }

  function openProject(index) {
    var project = PROJECTS[index];
    if (project && project.href) window.location.assign(project.href);
  }

  function buildProjectList() {
    var list = document.querySelector('[data-liquid-project-list]');
    if (!list) return [];
    list.textContent = '';
    return PROJECTS.map(function (project, index) {
      var item = document.createElement('li');
      var button = document.createElement('a');
      var number = document.createElement('span');
      var name = document.createElement('span');

      button.className = 'liquid-ring-project';
      button.href = project.href;
      button.title = 'Open ' + project.name;
      button.setAttribute('aria-label', 'Open ' + project.name);
      number.className = 'liquid-ring-project-number';
      number.textContent = String(index + 1).padStart(2, '0');
      name.className = 'liquid-ring-project-name';
      name.textContent = project.name;
      button.appendChild(number);
      button.appendChild(name);
      button.addEventListener('click', function (event) {
        event.stopPropagation();
      });
      item.appendChild(button);
      list.appendChild(item);
      return button;
    });
  }

  function updateProjectReadout(index) {
    if (index < 0 || index >= COUNT) return;
    var project = PROJECTS[index];
    var counter = document.getElementById('liquidRingCounter');
    var title = document.getElementById('liquidRingCurrent');
    var meta = document.getElementById('liquidRingMeta');
    if (counter) counter.textContent = String(index + 1).padStart(2, '0') + ' / ' + String(COUNT).padStart(2, '0');
    if (title) title.textContent = project.name;
    if (meta) meta.textContent = project.type + ' · ' + project.year;
    projectListButtons.forEach(function (button, buttonIndex) {
      var active = buttonIndex === index;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });
  }

  function swellOf(i) {
    return Math.max(0.05, 1 + params.swell * hoverF[i] - params.sideScale * sideF[i]);
  }

  function updatePointer(dt) {
    var live = params.hover && engaged() && pointer.seeded && interactive;
    cursor.amt += ((live ? 1 : 0) - cursor.amt) * chase(dt, 0.12);
    var k = chase(dt, params.lag);
    cursor.x += (pointer.x - cursor.x) * k;
    cursor.y += (pointer.y - cursor.y) * k;
    var trail = Math.hypot(pointer.x - cursor.x, pointer.y - cursor.y);
    cursor.wake = Math.max(
      cursor.wake * Math.pow(0.94, dt * 60),
      clamp01(trail / (Math.max(dt, 0.001) * 2600)),
    );
    uniforms.uMouse.value.set(cursor.x, cursor.y, cursor.amt, params.melt * fit);
    uniforms.uMelt.value.set(
      params.meltReach * fit,
      params.wave * fit * cursor.wake * cursor.amt,
      params.waveFreq,
      params.waveSpeed,
    );
  }

  function updateEntry(now) {
    if (!entry.startedAt || interactive) return;
    var t = Math.max(0, (now - entry.startedAt) / 1000);
    var assembleTime = reducedMotion ? 0.65 : params.assembleTime;
    var launchTime = reducedMotion ? 0.8 : params.launchTime;
    var spreadStart = assembleTime + launchTime - 0.15;
    var stageStart = spreadStart + params.stageAt * params.spreadTime;
    var spinDone = stageStart + params.spinTime;
    var moveDone = stageStart + params.moveDelay + params.moveTime;

    state.progress = easeInOutCubic(clamp01(t / assembleTime));
    state.launch = easeInOutCubic(clamp01((t - assembleTime) / launchTime));
    state.spread = easeOutCubic(clamp01((t - spreadStart) / params.spreadTime));
    state.spin = params.spinTurns * TAU * easeInOutCubic(clamp01((t - stageStart) / params.spinTime));
    state.shift = easeInOutCubic(clamp01((t - stageStart - params.moveDelay) / params.moveTime));

    if (t >= Math.max(spinDone, moveDone) + 0.05) {
      state.progress = 1;
      state.launch = 1;
      state.spread = 1;
      state.spin = params.spinTurns * TAU;
      state.shift = 1;
      interactive = true;
    }
  }

  var entry = { startedAt: 0 };

  function replay() {
    interactive = false;
    dragging = false;
    spinVel = 0;
    settling = false;
    picking = null;
    particleCard = -1;
    particleAmount = 0;
    particleFlow = 0;
    state.progress = 0;
    state.launch = 0;
    state.spread = 0;
    state.spin = 0;
    state.shift = 0;
    entry.startedAt = performance.now() + 250;
  }

  function layout(dt) {
    var step = TAU / COUNT;
    var spread = clamp01(state.spread);
    var endScale = narrowNow ? params.narrowEndScale : params.endScale;
    var posX = tightNow ? params.tightPosX : narrowNow ? params.narrowPosX : params.posX;
    var shift = clamp01(state.shift);
    var g = (1 + (endScale - 1) * shift) * fit;
    var cx = posX * viewW * 0.5 * shift;
    var cy = params.posY * viewH * 0.5 * shift;
    var assembleBoost = 1 + (params.assembleCardScale - 1) * (1 - smoothstep(0.05, 0.82, state.launch));
    var W = params.planeSize * planeK * g * assembleBoost;
    var H = W / 1.5;
    var R = params.ringRadius * radiusK * g;
    var sepExtent = params.radial ? H : W;
    var faceEdge = params.radial ? W : H;
    var restingGap = 2 * R * Math.sin(step / 2) - sepExtent;
    var finalSep = Math.max(1, restingGap);
    var maxN = Math.max(1, Math.abs(signedOffset(COUNT - 1)));
    var dur = Math.max(0.1, 1 - FAN_START - params.stagger);

    ringCentre.x = viewW * 0.5 + cx;
    ringCentre.y = viewH * 0.5 - cy;
    frontAngle = cx !== 0 || cy !== 0 ? Math.atan2(-cy, -cx) : 0;
    uniforms.uSize.value.set(W, H);
    uniforms.uRadius.value = params.radius * planeK * g;

    cum[0] = 0;
    for (var n = 1; n <= maxN; n++) {
      var start = FAN_START + ((n - 1) / maxN) * params.stagger;
      var st = clamp01((spread - start) / dur);
      var eased = st * st * (3 - 2 * st);
      travel[n] = eased;
      cum[n] = cum[n - 1] + eased;
    }

    var launch = easeInOutCubic(clamp01(state.launch));
    var Rnow = R * launch;
    var track = cursor.amt > 0.001;
    var reach = Math.max(1, params.reach * W);
    var sideReach = Math.max(1, params.sideReach * W);
    var kRise = chase(dt, params.grab);
    var kFall = chase(dt, params.release);
    var frontI = -1;
    var frontD = 1e9;
    var frontCell = 0;
    var overI = -1;
    var imageOffset = 0;
    var cellOf = function (slot) {
      return (((imageOffset - slot) % COUNT) + COUNT) % COUNT;
    };
    var probe = pointer.inside && pointer.seeded && interactive;
    var focusI = track ? over : -1;
    order.length = 0;

    for (var i = 0; i < COUNT; i++) {
      var slotIndex = signedOffset(i);
      var distance = Math.abs(slotIndex);
      var u = i === 0 ? clamp01(state.progress) : travel[distance];
      var cell = cellOf(slotIndex);
      var angle = params.seed * DEG + Math.sign(slotIndex) * step * cum[distance] + state.spin;
      var px = Math.cos(angle) * Rnow + cx;
      var py = Math.sin(angle) * Rnow + cy;
      rest[i].set(px, py);

      var angleDelta = angle - frontAngle;
      var toFront = Math.abs(Math.atan2(Math.sin(angleDelta), Math.cos(angleDelta)));
      if (toFront < frontD) {
        frontD = toFront;
        frontI = i;
        frontCell = cell;
      }

      var f = 0;
      var toX = 0;
      var toY = 0;
      if (track) {
        var dx = cursor.x - px;
        var dy = cursor.y - py;
        var dist = Math.hypot(dx, dy);
        f = smoothstep(reach, reach * 0.22, dist) * cursor.amt * u;
        if (f > 0.0001 && dist > 0.0001) {
          var lean = (params.pull * fit * f) / dist;
          toX = dx * lean;
          toY = dy * lean;
        }
      }
      var response = f > hoverF[i] ? kRise : kFall;
      hoverF[i] += (f - hoverF[i]) * response;
      leanX[i] += (toX - leanX[i]) * response;
      leanY[i] += (toY - leanY[i]) * response;

      var sf = 0;
      if (focusI >= 0 && i !== focusI) {
        var focusDist = Math.hypot(focusPos.x - px, focusPos.y - py);
        sf = smoothstep(sideReach, sideReach * 0.2, focusDist) * u;
      }
      sideF[i] += (sf - sideF[i]) * (sf > sideF[i] ? kRise : kFall);

      var pushX = 0;
      var pushY = 0;
      if (sideF[i] > 0.0001) {
        var awayX = px - focusPos.x;
        var awayY = py - focusPos.y;
        var awayDist = Math.hypot(awayX, awayY);
        if (awayDist > 0.0001) {
          var away = (params.sidePush * fit * sideF[i]) / awayDist;
          pushX = awayX * away;
          pushY = awayY * away;
        }
      }

      uniforms.uPos.value[i].set(px + leanX[i] + pushX, py + leanY[i] + pushY);
      uniforms.uRot.value[i] = (params.radial ? angle : angle + HALF_PI) * launch;

      var sx = i === 0
        ? easeOutCubic(clamp01((u - 0.5) / 0.46))
        : easeOutCubic(clamp01(u / 0.34));
      var sy = i === 0
        ? easeOutCubic(clamp01((u - 0.58) / 0.38))
        : easeOutCubic(clamp01((u - 0.06) / 0.36));
      var sw = swellOf(i);
      uniforms.uScale.value[i].set(sx * sw, sy * sw, 1 - params.sideDim * sideF[i], cell);

      if (probe && overI < 0) {
        var rot = uniforms.uRot.value[i];
        var hitX = cursor.x - (px + leanX[i] + pushX);
        var hitY = cursor.y - (py + leanY[i] + pushY);
        var cr = Math.cos(rot);
        var sr = Math.sin(rot);
        if (
          Math.abs(hitX * cr + hitY * sr) <= W * 0.5 * sx * sw &&
          Math.abs(-hitX * sr + hitY * cr) <= H * 0.5 * sy * sw
        ) {
          overI = i;
        }
      }
      order.push(i);
    }

    for (var clear = COUNT; clear < MAX_PLANES; clear++) {
      uniforms.uScale.value[clear].set(0, 0, 1, 0);
      hoverF[clear] = 0;
      leanX[clear] = 0;
      leanY[clear] = 0;
      sideF[clear] = 0;
    }

    over = overI;
    var wantedParticleCard = over;
    if (particleCard < 0 && wantedParticleCard >= 0) {
      particleCard = wantedParticleCard;
      particleFlow = 0;
    }
    var entering = particleCard >= 0 && particleCard === wantedParticleCard;
    var particleTarget = entering ? 1 : 0;
    var particleRate = entering ? params.focusParticleEnter : params.focusParticleExit;
    particleAmount += (particleTarget - particleAmount) * chase(dt, particleRate);
    if (!reducedMotion && particleCard >= 0) {
      particleFlow += dt * (entering ? params.focusParticleDrift : -params.focusParticleOut);
    }
    if (!entering && particleAmount < 0.015) {
      particleCard = wantedParticleCard;
      particleAmount = 0;
      particleFlow = 0;
    }

    if (particleCard >= 0) {
      var particlePos = uniforms.uPos.value[particleCard];
      var particleScale = uniforms.uScale.value[particleCard];
      var particleHalfW = W * 0.5 * particleScale.x;
      var particleHalfH = H * 0.5 * particleScale.y;
      var particleRMax = Math.min(particleHalfW, particleHalfH);
      var particleRound = smoothstep(0.3, 1, Math.min(particleScale.x, particleScale.y));
      var particleRadius = Math.min(
        particleRMax,
        particleRMax + (uniforms.uRadius.value - particleRMax) * particleRound,
      );
      uniforms.uFocusParticlePos.value.copy(particlePos);
      uniforms.uFocusParticleBox.value.set(
        particleHalfW,
        particleHalfH,
        particleRadius,
        uniforms.uRot.value[particleCard],
      );
    }
    uniforms.uFocusParticles.value.set(
      particleAmount,
      params.focusParticleReach * fit,
      Math.max(6, params.focusParticleCell * fit),
      params.focusParticleOpacity,
    );
    uniforms.uFocusParticleMotion.value.set(particleFlow, reducedMotion ? 0 : 1);

    if (over >= 0) focusPos.copy(rest[over]);
    if (frontI >= 0 && frontCell !== shown) {
      shown = frontCell;
      updateProjectReadout(shown);
    }

    order.sort(function (a, b) {
      return signedOffset(a) - signedOffset(b);
    });
    var edgeHalf = faceEdge * 0.5 * params.thread;
    var closed = spread > 0.995 && COUNT > 2;
    var linkCount = Math.min(closed ? COUNT : COUNT - 1, MAX_LINKS);

    for (var l = 0; l < linkCount; l++) {
      var ia = order[l];
      var ib = order[(l + 1) % COUNT];
      var ca = uniforms.uPos.value[ia];
      var cb = uniforms.uPos.value[ib];
      var scA = uniforms.uScale.value[ia];
      var scB = uniforms.uScale.value[ib];
      var shrinkA = (params.radial ? scA.y : scA.x) / swellOf(ia);
      var shrinkB = (params.radial ? scB.y : scB.x) / swellOf(ib);
      var sep = rest[ia].distanceTo(rest[ib]) - sepExtent * 0.5 * (shrinkA + shrinkB);
      var v = clamp01(sep / finalSep);
      var fl = 0;
      if (track && params.web > 0.0001) {
        var mx = (ca.x + cb.x) * 0.5;
        var my = (ca.y + cb.y) * 0.5;
        var webReach = Math.max(1, params.webReach * W);
        var webDist = Math.hypot(cursor.x - mx, cursor.y - my);
        fl = smoothstep(webReach, webReach * 0.15, webDist) * cursor.amt;
      }
      webF[l] += (fl - webF[l]) * (fl > webF[l] ? kRise : kFall);
      var width = Math.max(
        params.threadMin + (1 - params.threadMin) * Math.pow(1 - v, params.thin),
        params.web * webF[l],
      );
      var rEnd = edgeHalf * width - params.dissolve;
      var rMid = rEnd * (1 - (1 - params.pinch) * smoothstep(0, 0.7, v));
      uniforms.uLinkA.value[l].copy(ca);
      uniforms.uLinkB.value[l].copy(cb);
      uniforms.uLinkPar.value[l].set(
        rEnd,
        rMid,
        params.sag * g * Math.pow(v, 1.5),
        Math.min(params.fillet * g * smoothstep(0, 0.35, v), Math.max(rMid, 0) * 1.5),
      );
    }
    for (var unused = linkCount; unused < MAX_LINKS; unused++) {
      uniforms.uLinkPar.value[unused].set(-100, -100, 0, 0);
    }
    uniforms.uLinkCount.value = linkCount;
    uniforms.uK.value = params.goo * planeK * fit;
    uniforms.uWobble.value = params.wobble * fit * (1 - smoothstep(0.2, 0.95, state.progress));
    uniforms.uTextured.value = atlasReady ? 1 : 0;
    uniforms.uBlend.value = Math.max(0.5, params.blend * planeK * g);
    uniforms.uIntro.value.set(
      clamp01(state.progress),
      params.assembleSpread,
      Math.max(7, params.assembleCell * fit),
      state.progress < 0.999 ? params.assembleOpacity : 0,
    );
    uniforms.uCardParticles.value.set(
      clamp01(state.launch),
      params.assembleHaloReach * fit,
      Math.max(7, params.assembleCell * fit),
      state.launch < 0.999 ? params.assembleHaloOpacity : 0,
    );
    uniforms.uBandTop.value = params.glass ? params.bandTop * viewH : 0;
    uniforms.uBandBottom.value = params.glass ? params.bandBottom * viewH : 0;
    uniforms.uGlass.value.set(params.refract, params.squeeze, params.ripple, params.rippleFreq);
    uniforms.uFringe.value = params.glass ? params.fringe : 0;
    uniforms.uSheen.value = params.glass ? params.sheen : 0;
  }

  function advancePick(now) {
    if (!picking) return;
    var progress = clamp01((now - picking.start) / (picking.duration * 1000));
    state.spin = picking.from + (picking.to - picking.from) * easeInOutCubic(progress);
    if (progress >= 1) {
      state.spin = picking.to;
      picking = null;
    }
  }

  function advanceSpin(dt) {
    if (!interactive || dragging || picking) return;
    state.spin += spinVel * dt;
    spinVel *= Math.pow(params.damping, dt * 60);
    var off = 0;
    if (params.snap) {
      var slot = TAU / COUNT;
      var decay = Math.max(0.01, -Math.log(params.damping) * 60);
      var engage = Math.max(params.snapFrom, decay * slot * 0.5);
      var rate = 4.8 / Math.max(0.05, params.snapTime);
      if (!settling && Math.abs(spinVel) < engage) {
        var coast = state.spin + spinVel / decay;
        var phase = params.seed * DEG - frontAngle;
        snapTo = Math.round((coast + phase) / slot) * slot - phase;
        snapCap = Math.max(Math.abs(spinVel), slot * 0.5 * rate);
        settling = true;
      }
      if (settling) {
        off = snapTo - state.spin;
        var aim = Math.max(-snapCap, Math.min(snapCap, off * rate));
        spinVel += (aim - spinVel) * clamp01(rate * dt);
      }
    } else {
      settling = false;
    }
    if (Math.abs(spinVel) < 0.0015 && Math.abs(off) < 0.0008) {
      spinVel = 0;
      state.spin += off;
    }
  }

  function onWheel(e) {
    if (!interactive) return;
    e.preventDefault();
    var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    stopPick();
    settling = false;
    spinVel = Math.max(-params.maxSpeed, Math.min(params.maxSpeed, spinVel + delta * params.scrollSpeed));
  }

  function onPointerDown(e) {
    pointerTravel = 0;
    travelX = e.clientX;
    travelY = e.clientY;
    trackPointer(e);
    if (!interactive) return;
    stopPick();
    if (coarse) beginHold();
    dragging = true;
    settling = false;
    spinVel = 0;
    dragPrevAngle = pointerAngle(e);
    dragPrevTime = performance.now();
    renderer.domElement.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    trackPointer(e);
    pointerTravel += Math.abs(e.clientX - travelX) + Math.abs(e.clientY - travelY);
    travelX = e.clientX;
    travelY = e.clientY;
    if (coarse && !held && pointerTravel > 10) endHold();
    if (!dragging) return;
    var angle = pointerAngle(e);
    var delta = angle - dragPrevAngle;
    if (delta > Math.PI) delta -= TAU;
    if (delta < -Math.PI) delta += TAU;
    var turn = delta * params.dragSpeed;
    state.spin += turn;
    var now = performance.now();
    spinVel = turn / (Math.max(8, now - dragPrevTime) / 1000);
    dragPrevAngle = angle;
    dragPrevTime = now;
  }

  function onPointerUp(e) {
    trackPointer(e);
    endHold();
    if (!dragging) return;
    dragging = false;
    renderer.domElement.releasePointerCapture?.(e.pointerId);
  }

  function onPointerLeave() {
    if (!coarse) pointer.inside = false;
  }

  function onClick() {
    if (!interactive || pointerTravel >= 5 || over < 0) return;
    pick(over, performance.now());
  }

  stage.addEventListener('wheel', onWheel, { passive: false });
  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerUp);
  stage.addEventListener('pointerleave', onPointerLeave);
  stage.addEventListener('click', onClick);
  window.addEventListener('resize', resize);

  var replayButton = document.querySelector('[data-liquid-replay]');
  if (replayButton) replayButton.addEventListener('click', replay);

  projectListButtons = buildProjectList();
  resize();
  updateProjectReadout(0);

  var started = false;
  function startEntry() {
    if (started) return;
    started = true;
    replay();
  }
  atlas.first.then(startEntry).catch(startEntry);
  setTimeout(startEntry, 2500);

  var startTime = performance.now();
  var previous = startTime;
  function frame(now) {
    var dt = Math.min(0.05, (now - previous) / 1000);
    previous = now;
    uniforms.uTime.value = (now - startTime) / 1000;
    updateEntry(now);
    advancePick(now);
    advanceSpin(dt);
    updatePointer(dt);
    layout(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
