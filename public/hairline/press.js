/**
 * Press: a herbarium press, two lattice boards strapped round five sheets, one
 * per skill group, each with a leaf dried on it. The sheet under the pointer
 * slides out; everything above it lifts away, staggered outwards from it. The
 * slider is that gap. Hit tests read the rest pose, never the pose on screen.
 */
const {
  Cam, disposer, facing, fillet, fit, mk, open, poly, pointer, prism, proj, put, reflect, register,
  rings, rrect, seg, solid, tdone, tset, tval, tween, unproj,
} = HL;

const N = 5, W = 104, H = 84, BOARD = 6, SP = 12, TK = 10, PULL = 58, STEP = 40;
const NAMES = ["web · 9", "cloud · 6", "ml · 7", "evals · 3", "genai · 8"];
// Sheets are never squared up: one sits proud at rest, and it carries the bright leaf.
const REST = [4, -2, 30, 2, -1], SKEW = [0, 1.5, -1, 1, -0.5], PROUD = 2;
const LEAF = [[18, 5], [22, 6], [20, 7], [17, 5], [21, 5.5]];
const STRAPS = [28, W - 28];
const CROSS = [[8, 18], [W - 18, W - 8]];
const SLATS = [0, 1, 2, 3, 4].map((i) => [i * 18, i * 18 + 12]);
const restZ = (i) => BOARD + i * SP;
const TOP = restZ(N);

/** Where sheet i belongs while sheet a is chosen: the far end of the answer is clamped by the floor of REST. */
function dxFor(i, a) {
  if (a < 0) return REST[i];
  if (i === a) return PULL;
  return Math.min(REST[i], 6) + (Math.abs(i - a) === 1 ? 8 : 0);
}

/** A leaf lying along x with its tip toward the sheet's free edge: outline, midrib and veins, in sheet coordinates. */
function leafOf(i) {
  const [L, w] = LEAF[i], x0 = W - 5 - L, y0 = H / 2, side = [];
  for (let k = 0; k <= 6; k++) side.push([x0 + (k / 6) * L, Math.pow(Math.sin((k / 6) * Math.PI), 0.8) * w]);
  const pts = [...side.map(([x, d]) => [x, y0 + d]), ...side.slice(1, -1).reverse().map(([x, d]) => [x, y0 - d])];
  const veins = [0.3, 0.55].flatMap((t) => [1, -1].map((s) => [[x0 + t * L, y0], [x0 + (t + 0.2) * L, y0 + s * w * 0.68]]));
  return { edge: fillet(pts, pts.map(() => 1), 2), rib: [[x0, y0], [x0 + L, y0]], veins };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = value, act = -1;

  // Fitted to the tallest pose and the farthest pull, so nothing leaves the frame at either end of the slider.
  const C = Cam(45, 0.5, 1.42);
  fit(C, [[-3, -2, 0], [W + PULL, H + 2, 0], [-3, H + 2, 0], [W + 3, -2, TOP + 26 + BOARD + 1], [W + PULL, 0, restZ(N - 1) + TK]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, rings(-3, -2, W + 3, H + 2, 3, 1)[0], 0, 14);

  /** One board's parts, crossbars under slats, at height z: [footprint, z0, z1], back to front. */
  const boardParts = (z) => [
    ...CROSS.map(([a, b]) => [rings(a, -2, b, H + 2, 1.5, 0.8), z, z + 3]),
    ...SLATS.map(([a, b]) => [rings(-3, a, W + 3, b, 2.5, 1.2), z + 3, z + BOARD]),
  ];
  const paint = (s, [[ring, inner], z0, z1]) => put(s, prism(P, front, ring, inner, z0, z1));

  // The lower board never moves.
  boardParts(0).forEach((part) => paint(solid(g), part));

  const farStraps = STRAPS.map(() => solid(g));
  const sheets = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g), s = solid(grp);
    const edge = mk("path", { class: "nf" + (i === PROUD ? " hi" : "") }, grp), vein = mk("path", { class: "nf lo" }, grp);
    sheets.push({ s, edge, vein, leaf: leafOf(i), dx: tween(REST[i]), z: tween(restZ(i)), drawn: "" });
  }
  const lid = boardParts(TOP).map(() => solid(g));
  const bands = STRAPS.map(() => solid(g)), nearStraps = STRAPS.map(() => solid(g));
  const buckles = STRAPS.map(() => [mk("path", {}, g), mk("path", { class: "nf lo" }, g)]);
  const lift = tween(0);
  let lidDrawn = null;

  function drawSheet(i, now) {
    const sh = sheets[i], dx = tval(sh.dx, now), z = tval(sh.z, now), key = dx + "," + z;
    if (key === sh.drawn) return;
    sh.drawn = key;
    const y = SKEW[i], top = z + TK, at = ([u, v]) => P(u + dx, v + y, top);
    const [ring, inner] = rings(dx, y, W + dx, H + y, 2.5, 1.2);
    put(sh.s, prism(P, front, ring, inner, z, top));
    sh.edge.setAttribute("d", poly(sh.leaf.edge.map(at)));
    sh.vein.setAttribute("d", open(sh.leaf.rib.map(at)) + sh.leaf.veins.map(([a, b]) => seg(at(a), at(b))).join(""));
  }

  function drawLid(l) {
    if (l === lidDrawn) return;
    lidDrawn = l;
    const zt = TOP + l, high = zt + BOARD + 1, mid = high * 0.62;
    boardParts(zt).forEach((part, k) => paint(lid[k], part));
    STRAPS.forEach((sx, k) => {
      const a = sx - 5, b = sx + 5;
      paint(farStraps[k], [rings(a, -1.5, b, 0, 0.5, 0.4), 0, high]);
      paint(bands[k], [rings(a, -1.5, b, H + 1.5, 1, 0.8), zt + BOARD, high]);
      paint(nearStraps[k], [rings(a, H, b, H + 1.5, 0.5, 0.4), 0, high]);
      const onStrap = (ring) => ring.map((q) => P(q.u, H + 1.5, q.v));
      buckles[k][0].setAttribute("d", poly(onStrap(rrect(a - 1.5, mid - 5, b + 1.5, mid + 5, 1.6, 4))));
      buckles[k][1].setAttribute("d", poly(onStrap(rrect(a + 0.5, mid - 3, b - 0.5, mid + 3, 0.8, 4))));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = !tdone(lift, now);
    sheets.forEach((sh, i) => { drawSheet(i, now); if (!tdone(sh.dx, now) || !tdone(sh.z, now)) moving = true; });
    drawLid(tval(lift, now));
    return moving;
  });
  bag.add(B.unregister);

  /** Casts the pointer down through the rest pose, top column first, so a moving sheet can never flip the choice. */
  function hit([sx, sy]) {
    for (let i = N - 1; i >= 0; i--) {
      const z0 = restZ(i), z1 = i === N - 1 ? TOP + BOARD + 1 : z0 + SP;
      for (const z of [z1, (z0 + z1) / 2, z0]) {
        const [x, y] = unproj(C, sx, sy, z);
        if (x >= -3 && x <= W + (i === act ? PULL : Math.max(REST[i], 3)) && y >= -2 && y <= H + 2) return i;
      }
    }
    return -1;
  }

  /** Applies the choice and the gap: motion spreads out from the sheet chosen, or the one let go. */
  function retarget(a, from) {
    const now = performance.now();
    sheets.forEach((sh, i) => {
      const delay = Math.abs(i - from) * STEP;
      tset(sh.dx, dxFor(i, a), now, delay);
      tset(sh.z, restZ(i) + (a >= 0 && i > a ? gap : 0), now, delay);
      const on = i === a;
      sh.s.sil.classList.toggle("hi", on);
      sh.edge.classList.toggle("hi", on || (a < 0 && i === PROUD));
    });
    tset(lift, a >= 0 ? gap : 0, now, (N - from) * STEP);
    B.wake();
  }

  function setActive(a) {
    if (a === act) return;
    const from = a >= 0 ? a : act;
    act = a;
    retarget(a, from);
    read.textContent = a < 0 ? "rest" : NAMES[a];
  }

  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { gap = v; if (act >= 0) retarget(act, act); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "press",
  means: "A plant press of five sheets, one per skill group: the sheet under the pointer slides out, and the press opens around it.",
  rules: [1, 2, 4, 5],
  range: [8, 16, 26],
  tour: [[173, 94], [242, 170], [137, 197], null],
  mount,
});
