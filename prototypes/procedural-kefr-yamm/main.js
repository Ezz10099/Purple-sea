(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });
  const viewport = canvas.parentElement;
  const encounterCard = document.getElementById('encounterCard');
  const enemyMedallion = document.getElementById('enemyMedallion');
  const enemyType = document.getElementById('enemyType');
  const enemyName = document.getElementById('enemyName');
  const enemyDescription = document.getElementById('enemyDescription');
  const challengeButton = document.getElementById('challengeButton');
  const lightingButton = document.getElementById('lightingButton');
  const detailButton = document.getElementById('detailButton');
  const resetButton = document.getElementById('resetButton');
  const battleDialog = document.getElementById('battleDialog');
  const battleTitle = document.getElementById('battleTitle');
  const closeDialog = document.getElementById('closeDialog');
  const hint = document.getElementById('hint');

  const state = {
    width: 480,
    height: 760,
    scale: 1,
    offsetX: 240,
    offsetY: 205,
    dusk: false,
    reducedDetail: false,
    selectedEnemy: null,
    time: 0,
    dragging: false,
    dragStart: null,
    baseOffset: null,
    hitAreas: []
  };

  const palette = {
    foam: '#9cd8d1',
    sandTop: '#c9ad79',
    grassTop: '#6b7650',
    cliffTop: '#8a7b68',
    cliffSide: '#51483f',
    road: '#b39667',
    wallLight: '#c8b89a',
    wallMid: '#9c8060',
    wallDark: '#6c5138',
    wood: '#6b4329',
    woodDark: '#3f281c',
    roof: '#7b3f2a',
    roofDark: '#4f271d',
    sail: '#ddd0ae',
    shadow: 'rgba(5, 12, 14, .38)'
  };

  const enemies = [
    {
      id: 'shore-raiders',
      name: 'Shore Raiders',
      type: 'LEVEL 2 — BANDITS',
      description: 'A small raiding party watching the village road.',
      glyph: 'II',
      x: 7.4,
      y: 5.9,
      colour: '#a24736'
    },
    {
      id: 'cliff-jackals',
      name: 'Cliff Jackals',
      type: 'LEVEL 4 — BEASTS',
      description: 'Wild jackals blocking the path toward the hidden cliff cave.',
      glyph: 'IV',
      x: 9.3,
      y: 2.8,
      colour: '#87633d'
    },
    {
      id: 'wreck-scavengers',
      name: 'Wreck Scavengers',
      type: 'LEVEL 3 — COASTAL THREAT',
      description: 'Scavengers searching the beach beside a broken hull.',
      glyph: 'III',
      x: 3.4,
      y: 7.4,
      colour: '#496b68'
    }
  ];

  const houses = [
    { x: 3.3, y: 3.2, w: 1.45, d: 1.15, h: .78, roof: true },
    { x: 5.2, y: 3.0, w: 1.35, d: 1.05, h: .68, roof: false },
    { x: 6.8, y: 3.7, w: 1.55, d: 1.1, h: .74, roof: true },
    { x: 2.2, y: 4.8, w: 1.3, d: 1.0, h: .65, roof: false },
    { x: 4.6, y: 5.0, w: 1.7, d: 1.15, h: .72, roof: true },
    { x: 7.7, y: 2.15, w: 1.3, d: .92, h: .7, roof: false }
  ];

  const palms = [
    { x: 1.7, y: 3.5, s: .8 },
    { x: 8.4, y: 4.5, s: .75 },
    { x: 5.7, y: 1.6, s: .7 }
  ];

  function resize() {
    const rect = viewport.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    state.width = Math.max(320, rect.width);
    state.height = Math.max(420, rect.height);
    canvas.width = Math.round(state.width * dpr);
    canvas.height = Math.round(state.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    state.scale = Math.min(state.width / 480, state.height / 700);
    if (!state.dragging && !state.baseOffset) resetView();
  }

  function resetView() {
    state.offsetX = state.width * .51;
    state.offsetY = state.height * .24;
    state.baseOffset = { x: state.offsetX, y: state.offsetY };
  }

  function iso(x, y, z = 0) {
    const tileW = 45 * state.scale;
    const tileH = 24 * state.scale;
    return {
      x: state.offsetX + (x - y) * tileW / 2,
      y: state.offsetY + (x + y) * tileH / 2 - z * 38 * state.scale
    };
  }

  function path(points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
    ctx.closePath();
  }

  function polygon(points, fill, stroke = null, lineWidth = 1) {
    path(points);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function ellipse(x, y, rx, ry, fill, stroke = null, lineWidth = 1) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }
  }

  function line(a, b, colour, width = 1) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = colour;
    ctx.lineWidth = width;
    ctx.stroke();
  }

  function drawSea() {
    const gradient = ctx.createLinearGradient(0, 0, 0, state.height);
    gradient.addColorStop(0, state.dusk ? '#163b48' : '#135469');
    gradient.addColorStop(1, state.dusk ? '#071e28' : '#082f3d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, state.height);

    const spacing = 32 * state.scale;
    const waveCount = state.reducedDetail ? 18 : 42;
    ctx.globalAlpha = state.dusk ? .14 : .22;
    for (let i = 0; i < waveCount; i += 1) {
      const seed = (i * 79) % 97;
      const x = (seed / 97) * state.width + Math.sin(state.time * .0007 + i) * 10;
      const y = ((i * spacing + state.time * .01) % (state.height + 60)) - 30;
      ctx.beginPath();
      ctx.moveTo(x - 12, y);
      ctx.quadraticCurveTo(x, y - 4, x + 12, y);
      ctx.strokeStyle = palette.foam;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function drawIslandBase() {
    const top = [iso(1, 1, 0), iso(10.8, 1, 0), iso(10.8, 8.8, 0), iso(1, 8.8, 0)];
    const depth = .55;
    const coordinates = [[1, 1], [10.8, 1], [10.8, 8.8], [1, 8.8]];
    const lower = top.map((_, index) => iso(coordinates[index][0], coordinates[index][1], -depth));

    polygon([top[1], top[2], lower[2], lower[1]], palette.cliffSide);
    polygon([top[2], top[3], lower[3], lower[2]], '#665943');
    polygon([top[3], top[0], lower[0], lower[3]], '#746244');
    polygon(top, state.dusk ? '#6f6d50' : palette.grassTop, 'rgba(15,35,32,.35)', 1);

    const beach = [iso(1.2, 6.7, .02), iso(7.2, 6.7, .02), iso(8.8, 8.6, .02), iso(1.2, 8.6, .02)];
    polygon(beach, state.dusk ? '#947d5a' : palette.sandTop);

    const cliff = [iso(7.8, 1.1, .12), iso(10.7, 1.1, .12), iso(10.7, 4.3, .12), iso(8.4, 4.3, .12)];
    polygon(cliff, state.dusk ? '#696157' : palette.cliffTop);
  }

  function drawRoads() {
    const roads = [
      [[2.1, 7.6], [4.1, 6.1], [5.6, 5.0], [6.7, 3.8]],
      [[5.6, 5.0], [4.7, 3.7], [4.3, 2.1]],
      [[6.7, 3.8], [8.7, 3.0], [9.6, 2.0]]
    ];
    roads.forEach((road) => {
      ctx.beginPath();
      road.forEach(([x, y], index) => {
        const point = iso(x, y, .04);
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.strokeStyle = state.dusk ? '#8b7558' : palette.road;
      ctx.lineWidth = 10 * state.scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.strokeStyle = 'rgba(70,52,34,.35)';
      ctx.lineWidth = 2 * state.scale;
      ctx.stroke();
    });
  }

  function drawBox(x, y, width, depth, height, colours) {
    const p0 = iso(x, y, 0);
    const p1 = iso(x + width, y, 0);
    const p2 = iso(x + width, y + depth, 0);
    const p3 = iso(x, y + depth, 0);
    const t0 = iso(x, y, height);
    const t1 = iso(x + width, y, height);
    const t2 = iso(x + width, y + depth, height);
    const t3 = iso(x, y + depth, height);

    polygon([p1, p2, t2, t1], colours.right);
    polygon([p2, p3, t3, t2], colours.left);
    polygon([t0, t1, t2, t3], colours.top);
    return { p0, p1, p2, p3, t0, t1, t2, t3 };
  }

  function drawHouse(house, index) {
    const shadow = iso(house.x + house.w * .55, house.y + house.d * .7, 0);
    ellipse(shadow.x + 5 * state.scale, shadow.y + 8 * state.scale, 25 * state.scale, 9 * state.scale, palette.shadow);

    const box = drawBox(house.x, house.y, house.w, house.d, house.h, {
      top: state.dusk ? '#9a856c' : palette.wallLight,
      right: state.dusk ? '#77604d' : palette.wallMid,
      left: state.dusk ? '#584438' : palette.wallDark
    });

    const doorBase = iso(house.x + house.w * .68, house.y + house.d, .02);
    const doorTop = iso(house.x + house.w * .68, house.y + house.d, house.h * .55);
    ctx.strokeStyle = '#3a271e';
    ctx.lineWidth = Math.max(3, 5 * state.scale);
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(doorBase.x, doorBase.y);
    ctx.lineTo(doorTop.x, doorTop.y);
    ctx.stroke();

    if (house.roof) {
      const ridgeA = iso(house.x + house.w * .5, house.y, house.h + .42);
      const ridgeB = iso(house.x + house.w * .5, house.y + house.d, house.h + .42);
      polygon([box.t0, box.t1, ridgeB, ridgeA], state.dusk ? '#5e3027' : palette.roofDark);
      polygon([box.t1, box.t2, ridgeB], state.dusk ? '#703829' : palette.roof);
      polygon([box.t2, box.t3, ridgeB], '#5e3027');
    } else {
      ctx.strokeStyle = 'rgba(84,59,39,.55)';
      ctx.lineWidth = 2 * state.scale;
      path([box.t0, box.t1, box.t2, box.t3]);
      ctx.stroke();
    }

    if (!state.reducedDetail && index % 2 === 0) {
      const pot = iso(house.x + .18, house.y + house.d + .08, 0);
      ellipse(pot.x, pot.y, 4 * state.scale, 3 * state.scale, '#8a4d30');
    }
  }

  function drawPalm({ x, y, s }) {
    const base = iso(x, y, 0);
    const top = iso(x, y, 1.25 * s);
    line(base, top, '#70502d', 5 * state.scale * s);
    ellipse(base.x + 4, base.y + 5, 13 * state.scale * s, 5 * state.scale * s, palette.shadow);

    const leafColour = state.dusk ? '#354c3d' : '#466b49';
    for (let i = 0; i < 6; i += 1) {
      const angle = (Math.PI * 2 * i) / 6 + .3;
      const end = {
        x: top.x + Math.cos(angle) * 20 * state.scale * s,
        y: top.y + Math.sin(angle) * 8 * state.scale * s
      };
      line(top, end, leafColour, 4 * state.scale * s);
    }
    ellipse(top.x, top.y, 5 * state.scale * s, 3 * state.scale * s, '#314c35');
  }

  function drawDockAndBoat() {
    const dockStart = iso(4.1, 8.15, .08);
    const dockEnd = iso(4.1, 10.3, .08);
    const dockLeft = iso(3.55, 8.15, .08);
    const dockFarLeft = iso(3.55, 10.3, .08);
    polygon([dockLeft, dockStart, dockEnd, dockFarLeft], palette.wood, palette.woodDark, 1);

    if (!state.reducedDetail) {
      for (let i = 0; i < 5; i += 1) {
        const a = iso(3.55, 8.3 + i * .42, .09);
        const b = iso(4.1, 8.3 + i * .42, .09);
        line(a, b, 'rgba(42,25,16,.6)', 1);
      }
    }

    const boatX = 4.65;
    const boatY = 9.35;
    const hull = [
      iso(boatX - .7, boatY, .05),
      iso(boatX + .7, boatY, .05),
      iso(boatX + .45, boatY + .5, .05),
      iso(boatX - .45, boatY + .5, .05)
    ];
    polygon(hull, '#633923', '#2c1c16', 1);
    const mastBottom = iso(boatX, boatY + .18, .12);
    const mastTop = iso(boatX, boatY + .18, 1.05);
    line(mastBottom, mastTop, '#4d3422', 3 * state.scale);
    polygon([
      mastTop,
      { x: mastTop.x + 1, y: mastTop.y + 33 * state.scale },
      { x: mastTop.x + 26 * state.scale, y: mastTop.y + 30 * state.scale }
    ], state.dusk ? '#a89f88' : palette.sail, 'rgba(73,57,37,.5)', 1);
  }

  function drawWell() {
    const point = iso(5.4, 4.4, .05);
    ellipse(point.x, point.y, 12 * state.scale, 6 * state.scale, '#5a5146');
    ellipse(point.x, point.y - 2 * state.scale, 8 * state.scale, 4 * state.scale, '#171d1b');
    line({ x: point.x - 10 * state.scale, y: point.y - 4 * state.scale }, { x: point.x - 10 * state.scale, y: point.y - 24 * state.scale }, '#694a2d', 3 * state.scale);
    line({ x: point.x + 10 * state.scale, y: point.y - 4 * state.scale }, { x: point.x + 10 * state.scale, y: point.y - 24 * state.scale }, '#694a2d', 3 * state.scale);
    line({ x: point.x - 10 * state.scale, y: point.y - 22 * state.scale }, { x: point.x + 10 * state.scale, y: point.y - 22 * state.scale }, '#694a2d', 3 * state.scale);
  }

  function drawCliffCave() {
    const point = iso(9.7, 1.65, .12);
    ellipse(point.x, point.y + 2, 11 * state.scale, 16 * state.scale, '#252525');
    ctx.globalAlpha = .3 + Math.sin(state.time * .002) * .06;
    ellipse(point.x, point.y + 5, 5 * state.scale, 8 * state.scale, '#e4a447');
    ctx.globalAlpha = 1;
  }

  function drawMiniature(x, y, colour, scale = 1, silhouette = 'human') {
    const base = iso(x, y, .12);
    const size = state.scale * scale;
    ellipse(base.x + 4 * size, base.y + 5 * size, 10 * size, 4 * size, palette.shadow);

    if (silhouette === 'beast') {
      ellipse(base.x, base.y - 9 * size, 9 * size, 5 * size, colour);
      ellipse(base.x + 8 * size, base.y - 12 * size, 4 * size, 4 * size, colour);
      line({ x: base.x - 5 * size, y: base.y - 6 * size }, { x: base.x - 8 * size, y: base.y + 2 * size }, '#2a2018', 2 * size);
      line({ x: base.x + 4 * size, y: base.y - 6 * size }, { x: base.x + 3 * size, y: base.y + 2 * size }, '#2a2018', 2 * size);
      return;
    }

    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(base.x, base.y - 22 * size, 5 * size, 0, Math.PI * 2);
    ctx.fill();
    polygon([
      { x: base.x - 7 * size, y: base.y - 16 * size },
      { x: base.x + 7 * size, y: base.y - 16 * size },
      { x: base.x + 5 * size, y: base.y - 2 * size },
      { x: base.x - 5 * size, y: base.y - 2 * size }
    ], colour);
    line({ x: base.x - 3 * size, y: base.y - 3 * size }, { x: base.x - 5 * size, y: base.y + 4 * size }, '#2a211b', 2 * size);
    line({ x: base.x + 3 * size, y: base.y - 3 * size }, { x: base.x + 5 * size, y: base.y + 4 * size }, '#2a211b', 2 * size);
  }

  function drawPlayer() {
    drawMiniature(5.2, 7.25, '#2a6578', 1.08, 'human');
    const base = iso(5.2, 7.25, .12);
    ctx.fillStyle = '#e7d29a';
    ctx.font = `700 ${Math.max(8, 10 * state.scale)}px system-ui`;
    ctx.textAlign = 'center';
    ctx.fillText('YOU', base.x, base.y + 18 * state.scale);
  }

  function drawEnemy(enemy, index) {
    const base = iso(enemy.x, enemy.y, .1);
    const pulse = 1 + Math.sin(state.time * .003 + index) * .06;
    const selected = state.selectedEnemy?.id === enemy.id;
    const radius = (selected ? 20 : 17) * state.scale * pulse;

    ctx.globalAlpha = selected ? .45 : .27;
    ellipse(base.x, base.y + 2, radius, radius * .42, enemy.colour);
    ctx.globalAlpha = 1;
    ellipse(base.x, base.y + 2, radius, radius * .42, 'rgba(0,0,0,0)', selected ? '#ffe49a' : 'rgba(255,229,168,.7)', selected ? 2.5 : 1.2);

    if (enemy.id === 'cliff-jackals') {
      drawMiniature(enemy.x - .14, enemy.y, enemy.colour, .88, 'beast');
      drawMiniature(enemy.x + .18, enemy.y + .06, '#684931', .74, 'beast');
    } else {
      drawMiniature(enemy.x - .12, enemy.y, enemy.colour, .88, 'human');
      drawMiniature(enemy.x + .14, enemy.y + .08, '#553a2e', .72, 'human');
    }

    const badgeY = base.y - 46 * state.scale;
    ellipse(base.x, badgeY, 12 * state.scale, 12 * state.scale, '#112027', '#e3bf69', 1.5);
    ctx.fillStyle = '#ffe6a7';
    ctx.font = `800 ${Math.max(9, 11 * state.scale)}px Georgia`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(enemy.glyph, base.x, badgeY + .5);
    ctx.textBaseline = 'alphabetic';

    state.hitAreas.push({
      enemy,
      x: base.x,
      y: base.y - 14 * state.scale,
      radius: 30 * state.scale
    });
  }

  function drawForegroundMist() {
    const gradient = ctx.createLinearGradient(0, state.height * .65, 0, state.height);
    gradient.addColorStop(0, 'rgba(5,18,24,0)');
    gradient.addColorStop(1, state.dusk ? 'rgba(3,8,12,.5)' : 'rgba(6,26,33,.26)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, state.height * .65, state.width, state.height * .35);
  }

  function drawLighting() {
    if (!state.dusk) return;
    const overlay = ctx.createLinearGradient(0, 0, state.width, state.height);
    overlay.addColorStop(0, 'rgba(48,53,76,.18)');
    overlay.addColorStop(.55, 'rgba(24,20,35,.28)');
    overlay.addColorStop(1, 'rgba(4,9,16,.42)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, state.width, state.height);

    const torches = [iso(3.7, 4.3, .7), iso(6.8, 4.6, .7)];
    torches.forEach((point) => {
      const glow = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 38 * state.scale);
      glow.addColorStop(0, 'rgba(255,190,83,.34)');
      glow.addColorStop(1, 'rgba(255,190,83,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(point.x - 40 * state.scale, point.y - 40 * state.scale, 80 * state.scale, 80 * state.scale);
    });
  }

  function render(time) {
    state.time = time;
    state.hitAreas = [];
    ctx.clearRect(0, 0, state.width, state.height);

    drawSea();
    drawIslandBase();
    drawRoads();
    drawDockAndBoat();
    houses.forEach(drawHouse);
    palms.forEach(drawPalm);
    drawWell();
    drawCliffCave();
    drawPlayer();
    enemies.forEach(drawEnemy);
    drawLighting();
    drawForegroundMist();

    requestAnimationFrame(render);
  }

  function eventPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function enemyAt(point) {
    return state.hitAreas.find((area) => Math.hypot(point.x - area.x, point.y - area.y) <= area.radius)?.enemy || null;
  }

  function selectEnemy(enemy) {
    state.selectedEnemy = enemy;
    enemyMedallion.textContent = enemy.glyph;
    enemyMedallion.style.background = `radial-gradient(circle, ${enemy.colour}88, #1a1513 75%)`;
    enemyType.textContent = enemy.type;
    enemyName.textContent = enemy.name;
    enemyDescription.textContent = enemy.description;
    challengeButton.disabled = false;
    hint.style.opacity = '0';
    encounterCard.animate(
      [{ transform: 'translateY(4px)', opacity: .82 }, { transform: 'translateY(0)', opacity: 1 }],
      { duration: 180, easing: 'ease-out' }
    );
  }

  canvas.addEventListener('pointerdown', (event) => {
    const point = eventPosition(event);
    const enemy = enemyAt(point);
    if (enemy) {
      selectEnemy(enemy);
      return;
    }

    state.dragging = true;
    state.dragStart = point;
    state.baseOffset = { x: state.offsetX, y: state.offsetY };
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointermove', (event) => {
    if (!state.dragging) return;
    const point = eventPosition(event);
    state.offsetX = state.baseOffset.x + point.x - state.dragStart.x;
    state.offsetY = state.baseOffset.y + point.y - state.dragStart.y;
  });

  canvas.addEventListener('pointerup', (event) => {
    state.dragging = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener('pointercancel', () => {
    state.dragging = false;
  });

  challengeButton.addEventListener('click', () => {
    if (!state.selectedEnemy) return;
    battleTitle.textContent = `${state.selectedEnemy.name} selected`;
    if (typeof battleDialog.showModal === 'function') battleDialog.showModal();
  });

  closeDialog.addEventListener('click', () => battleDialog.close());

  lightingButton.addEventListener('click', () => {
    state.dusk = !state.dusk;
    lightingButton.textContent = state.dusk ? 'Day lighting' : 'Dusk lighting';
  });

  detailButton.addEventListener('click', () => {
    state.reducedDetail = !state.reducedDetail;
    detailButton.textContent = state.reducedDetail ? 'Restore detail' : 'Reduce detail';
  });

  resetButton.addEventListener('click', resetView);
  window.addEventListener('resize', resize);

  resize();
  requestAnimationFrame(render);
})();
