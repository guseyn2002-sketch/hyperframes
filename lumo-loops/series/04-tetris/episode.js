/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outQuad, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T, { tree: true });
const BX = 340,
  BY = 160,
  CS = 50,
  COLS = 8,
  ROWS = 16,
  BOT = BY + ROWS * CS;
const well = mk("g", {}, W.mid);
let grid = "";
for (let i = 1; i < COLS; i++)
  grid += `<line x1="${BX + i * CS}" y1="${BY}" x2="${BX + i * CS}" y2="${BOT}"/>`;
for (let j = 1; j < ROWS; j++)
  grid += `<line x1="${BX}" y1="${BY + j * CS}" x2="${BX + COLS * CS}" y2="${BY + j * CS}"/>`;
well.innerHTML = `<rect x="${BX - 14}" y="${BY - 14}" width="${COLS * CS + 28}" height="${ROWS * CS + 28}" rx="26" fill="#2b2f70"/><rect x="${BX}" y="${BY}" width="${COLS * CS}" height="${ROWS * CS}" fill="#12154a"/><g stroke="#2a2f78" stroke-width="2">${grid}</g>`;
// scripted game: [kind, cols[], rows[], spawn t, land t]
const GAME = [
  { k: "I", col: 0, w: 4, h: 1, ts: 0.9, tl: 1.9, row: 0 },
  { k: "O", col: 4, w: 2, h: 2, ts: 2.0, tl: 3.0, row: 0 },
  { k: "O", col: 6, w: 2, h: 2, ts: 3.1, tl: 4.1, row: 0 },
  { k: "I", col: 0, w: 4, h: 1, ts: 5.0, tl: 6.0, row: 0 },
  { k: "O", col: 0, w: 2, h: 2, ts: 6.9, tl: 7.7, row: 0 },
  { k: "O", col: 2, w: 2, h: 2, ts: 7.8, tl: 8.6, row: 0 },
  { k: "O", col: 4, w: 2, h: 2, ts: 8.7, tl: 9.5, row: 0 },
  { k: "O", col: 6, w: 2, h: 2, ts: 9.6, tl: 10.4, row: 0 },
];
const CLEARS = [
  { t: 4.6, rows: [0], dropT: 4.95 },
  { t: 6.5, rows: [0], dropT: 99 },
  { t: 11.0, rows: [0, 1], dropT: 99 },
];
const COLORS = { I: ["#8fd8ff", "#d6f1ff"], O: ["#ffd45e", "#fff3c4"] };
const cells = [];
GAME.forEach((p, pi) => {
  for (let dx = 0; dx < p.w; dx++)
    for (let dy = 0; dy < p.h; dy++) {
      const g = mk("g", {}, W.mid);
      g.innerHTML = `<rect x="-23" y="-23" width="46" height="46" rx="10" fill="${COLORS[p.k][0]}"/><rect x="-14" y="-17" width="22" height="9" rx="4" fill="${COLORS[p.k][1]}" opacity=".85"/><use href="#spark" fill="#fff" transform="translate(9 9) scale(.7)"/>`;
      cells.push({ g, pi, dx, dy, p });
    }
});
const rowAfter = (c, t) => {
  // landed row (0 bottom) incl. drop after a clear
  let r = c.p.row + c.dy;
  for (const cl of CLEARS) {
    if (cl.dropT < 90 && c.p.tl < cl.t && t > cl.dropT && !cl.rows.includes(r)) {
      r -= cl.rows.filter((q) => q < r).length;
    }
  }
  return r;
};
const clearedAt = (c) => {
  let r = c.p.row + c.dy;
  for (const cl of CLEARS)
    if (c.p.tl < cl.t) {
      if (cl.rows.includes(r)) return cl;
      r -= cl.dropT < 90 ? cl.rows.filter((q) => q < r).length : 0;
    }
  return null;
};
const pad = mk("g", {}, W.fx);
pad.innerHTML = `<rect x="-62" y="-30" width="124" height="60" rx="26" fill="#3b3d7c" stroke="#8d92e8" stroke-width="5"/><circle cx="-34" cy="0" r="12" fill="#14163f"/><circle cx="28" cy="-8" r="8" fill="#ff7a8a"/><circle cx="46" cy="6" r="8" fill="#7ad8ff"/>`;
const lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 14),
  sp2 = LK.sparks(W.fx, 14);
const flyers = [];
for (let i = 0; i < 16; i++)
  flyers.push(mk("use", { href: "#star5", fill: "#ffd45e", opacity: 0 }, W.fx));
const LX = 280,
  LY = gy(LX);
const cx = (col) => BX + col * CS + CS / 2,
  cyRow = (r) => BOT - CS / 2 - r * CS;

function draw(t) {
  W.update(t);
  cells.forEach((c, i) => {
    const p = c.p,
      col = p.col + c.dx,
      hidden = t < p.ts;
    if (hidden) return c.g.setAttribute("opacity", 0);
    let x,
      y,
      sc = 1,
      op = 1;
    const landY = cyRow(p.row + c.dy);
    if (t < p.tl) {
      const u = seg(t, p.ts, p.tl);
      x = lerp(cx(3 + c.dx), cx(col), sine(clamp(u / 0.4, 0, 1)));
      y = lerp(BY - 90 - c.dy * CS, landY, u * u);
    } else {
      x = cx(col);
      y = cyRow(rowAfter(c, t));
      if (t < p.tl + 0.15) sc = 1 + 0.12 * Math.sin(Math.PI * seg(t, p.tl, p.tl + 0.15));
    }
    const cl = clearedAt(c);
    if (cl && t > cl.t) {
      const q = seg(t, cl.t, cl.t + 0.45);
      op = 1 - sine(clamp((q - 0.5) / 0.5, 0, 1));
      sc *= 1 + 0.25 * Math.sin(Math.PI * clamp(q * 2, 0, 1));
      if (q > 0.99) op = 0;
    }
    c.g.setAttribute("transform", `translate(${f2(x)} ${f2(y)}) scale(${f2(sc)})`);
    c.g.setAttribute("opacity", f2(op));
  });
  // cleared stars fly into the sky
  CLEARS.forEach((cl, ci) => {
    for (let k = 0; k < 8; k++) {
      const fl = flyers[ci * 5 + (k % 5)];
      if (k >= 5) continue;
      const q = seg(t, cl.t + 0.2, cl.t + 1.4);
      if (q <= 0 || q >= 1) {
        fl.setAttribute("opacity", 0);
        continue;
      }
      const sx = cx(k + (ci === 2 ? 1 : 0) * 0 + (k % 3)),
        sy = cyRow(0);
      const ex = 120 + 840 * ((k * 0.37 + ci * 0.21) % 1),
        ey = 80 + 60 * ((k * 0.61 + ci) % 3);
      fl.setAttribute(
        "transform",
        `translate(${f2(lerp(sx, ex, sine(q)))} ${f2(lerp(sy, ey, sine(q)))}) scale(${f2(0.5 + 0.3 * Math.sin(TAU * 3 * q))})`,
      );
      fl.setAttribute("opacity", f2(1 - sine(clamp((q - 0.6) / 0.4, 0, 1))));
    }
  });
  // Lumo with a gamepad
  const id = LK.idle(t, T);
  let react = 0;
  CLEARS.forEach((cl) => {
    react = Math.max(react, bump(t, cl.t, cl.t + 0.8));
  });
  const falling = GAME.find((p) => t >= p.ts && t < p.tl);
  const tx = falling ? cx(falling.col + 1) : BX + 200,
    ty = falling ? lerp(BY, cyRow(0), seg(t, falling.ts, falling.tl) ** 2) : BY + 300;
  const eyeY = LY - CH * 133;
  const lx = clamp((tx - LX) / 40, -7, 7),
    ly = clamp((ty - eyeY) / 90, -8, 8);
  const press = falling ? 3 * Math.sin(TAU * 2.5 * t) : 0;
  const aL = { x: -92, y: -66 + press, o: 1 },
    aR = { x: 92, y: -66 - press, o: 1 };
  const happy = clamp(react * 1.6, 0, 1);
  const jump = 46 * react;
  const blink = LK.blinkAt(t, [0.6, 5.7, 11.6]);
  lumo.set({
    x: LX,
    lift: jump,
    aL,
    aR,
    sx: id.sx,
    sy: id.sy,
    lx,
    ly,
    open: blink,
    happy,
    glow: id.glow + 0.7 * react,
    glowR: 100 + 60 * react,
    rot: 3 * Math.sin((TAU * 2 * t) / T) * 0,
  });
  pad.setAttribute(
    "transform",
    `translate(${f2(LX)} ${f2(LY - CH * (62 + jump))}) scale(${f2(CH * 0.9)}) rotate(${f2(-5 + press)})`,
  );
  CLEARS.forEach((cl) => sp.draw(t, cl.t, 0.9, BX + (CS * COLS) / 2, cyRow(0), 260, 80));
}
LK.run(T, draw);
