/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, inCubic, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T);
const PX = 140,
  PY = 200,
  PS = 200,
  MI = 3;
const rnd = LK.prng(303);
const board = mk("g", {}, W.mid);
let stars = "";
for (let i = 0; i < 34; i++)
  stars += `<circle cx="${f2(PX + rnd() * 800)}" cy="${f2(PY + rnd() * 540)}" r="${f2(1.5 + rnd() * 2.6)}" opacity="${f2(0.5 + rnd() * 0.5)}"/>`;
const PIC = `<rect x="${PX}" y="${PY}" width="800" height="600" fill="url(#pz)"/><ellipse cx="${PX + 230}" cy="${PY + 220}" rx="280" ry="150" fill="#5446b8" opacity=".5"/><g fill="#fff">${stars}</g>
<path d="M${PX} ${PY + 540} Q${PX + 220} ${PY + 450} ${PX + 430} ${PY + 520} T${PX + 800} ${PY + 500} L${PX + 800} ${PY + 600} L${PX} ${PY + 600}Z" fill="#2a3a80"/>
<g transform="translate(${PX + 700} ${PY + 100})"><circle r="120" fill="url(#warm)" opacity=".7"/><path d="M0 -64 A64 64 0 1 0 0 64 A84 84 0 0 1 0 -64Z" fill="#fff1c2" transform="translate(16 0) rotate(-20)"/></g>`;
let defs = `<linearGradient id="pz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c2166"/><stop offset="1" stop-color="#34308f"/></linearGradient>
<linearGradient id="shine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<clipPath id="all"><rect x="${PX}" y="${PY}" width="800" height="600" rx="10"/></clipPath>`;
for (let i = 0; i < 12; i++) {
  const r = Math.floor(i / 4),
    c = i % 4,
    x0 = PX + c * PS,
    y0 = PY + r * PS;
  let sh = `<rect x="${x0 + 1.5}" y="${y0 + 1.5}" width="${PS - 3}" height="${PS - 3}" rx="6"/>`;
  if ((r + c) % 2 === 0 && c < 3) sh += `<circle cx="${x0 + PS}" cy="${y0 + 100}" r="28"/>`;
  if ((r + c) % 2 === 1 && r < 2) sh += `<circle cx="${x0 + 100}" cy="${y0 + PS}" r="28"/>`;
  defs += `<clipPath id="pc${i}">${sh}</clipPath>`;
}
board.innerHTML = `<defs>${defs}</defs><rect x="${PX - 20}" y="${PY - 20}" width="840" height="640" rx="28" fill="#2b2f70"/><rect class="hole" x="${PX + MI * PS}" y="${PY}" width="${PS}" height="${PS}" fill="#10123a"/>`;
const pieces = [];
for (let i = 0; i < 12; i++) {
  const g = mk("g", { "clip-path": `url(#pc${i})` }, board);
  g.innerHTML = PIC;
  pieces.push(g);
}
board.removeChild(pieces[MI]);
const shineG = mk("g", { "clip-path": "url(#all)" }, W.mid);
const shine = mk(
  "rect",
  { y: PY, width: 220, height: 600, fill: "url(#shine)", opacity: 0, transform: "skewX(-18)" },
  shineG,
);
const pm = mk("g", {}, W.fx);
pm.innerHTML = `<defs><clipPath id="pcm"><rect x="${PX + MI * PS + 1.5}" y="${PY + 1.5}" width="${PS - 3}" height="${PS - 3}" rx="6"/></clipPath></defs><g clip-path="url(#pcm)">${PIC}</g><rect x="${PX + MI * PS + 1.5}" y="${PY + 1.5}" width="${PS - 3}" height="${PS - 3}" rx="6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="4"/>`;
const MC = [PX + MI * PS + PS / 2, PY + PS / 2];
const moon = mk("g", {}, W.fx);
moon.innerHTML = `<circle r="260" fill="url(#warm)" opacity=".8"/><path d="M0 -64 A64 64 0 1 0 0 64 A84 84 0 0 1 0 -64Z" fill="#fff1c2" transform="translate(16 0) rotate(-20)"/>`;
const ring = mk(
  "circle",
  { r: 30, fill: "none", stroke: "#ffe39a", "stroke-width": 8, opacity: 0 },
  W.fx,
);
const lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 14),
  sp2 = LK.sparks(W.fx, 14);
const LX = 300,
  LY = gy(LX);

function mpos(t) {
  if (t < 1.0) return { x: 300, y: -260, r: 0, s: 1, pa: 1, ma: 0, ms: 1 };
  if (t < 2.2) {
    const u = outCubic(seg(t, 1.0, 2.2));
    return { x: 300, y: lerp(-260, 840, u), r: 540 * (1 - u), s: 1, pa: 1, ma: 0, ms: 1 };
  }
  if (t < 3.0)
    return {
      x: 300,
      y: 840 - 0.3 * 110 * Math.sin(Math.PI * seg(t, 2.1, 2.9)),
      r: 0,
      s: 1,
      pa: 1,
      ma: 0,
      ms: 1,
    };
  if (t < 4.0) {
    const u = seg(t, 3.0, 4.0);
    return {
      x: lerp(300, MC[0], u),
      y: lerp(840, MC[1], u) - 150 * Math.sin(Math.PI * u),
      r: 360 * u,
      s: 1,
      pa: 1,
      ma: 0,
      ms: 1,
    };
  }
  if (t < 5.2)
    return { x: MC[0], y: MC[1], r: 0, s: 1 + 0.12 * bump(t, 4.0, 4.3), pa: 1, ma: 0, ms: 1 };
  const out = seg(t, 5.2, 6.6),
    leave = seg(t, 10.2, 11.5);
  let x = lerp(MC[0], 540, sine(out)),
    y = lerp(MC[1], 520, sine(out));
  if (t >= 6.6) y += 14 * Math.sin((TAU * 2 * t) / T);
  y = lerp(y, -320, LK.inCubic(leave));
  return {
    x,
    y,
    r: 0,
    s: 1,
    pa: 1 - seg(t, 5.4, 6.4),
    ma: seg(t, 5.4, 6.4),
    ms: lerp(1, 2.2, sine(out)),
  };
}
function draw(t) {
  W.update(t);
  const m = mpos(t);
  const vis = t >= 1.0 && t < 11.6;
  pm.setAttribute("opacity", vis ? f2(m.pa) : 0);
  pm.setAttribute(
    "transform",
    `translate(${f2(m.x)} ${f2(m.y)}) rotate(${f2(m.r)}) scale(${f2(m.s)}) translate(${-MC[0]} ${-MC[1]})`,
  );
  moon.setAttribute("opacity", vis ? f2(m.ma) : 0);
  moon.setAttribute("transform", `translate(${f2(m.x)} ${f2(m.y)}) scale(${f2(m.ms)})`);
  // shine + landing ring
  const sh = seg(t, 4.1, 5.0);
  shine.setAttribute("x", f2(lerp(PX - 300, PX + 1000, sh)));
  shine.setAttribute("opacity", f2(sh > 0 && sh < 1 ? 0.9 : 0));
  const rg = seg(t, 4.0, 4.6);
  ring.setAttribute("cx", MC[0]);
  ring.setAttribute("cy", MC[1]);
  ring.setAttribute("r", f2(30 + 200 * outCubic(rg)));
  ring.setAttribute("opacity", f2(rg > 0 && rg < 1 ? 0.9 * (1 - rg) : 0));
  ring.setAttribute("stroke-width", f2(10 * (1 - rg)));
  // Lumo
  const id = LK.idle(t, T);
  const catchJ = Math.sin(Math.PI * seg(t, 2.0, 2.7)) * 110;
  const arms = win(t, 1.9, 3.2, 0.15);
  const aL = arms > 0.01 ? { x: -104, y: lerp(-112, -250, arms), o: arms } : null,
    aR = arms > 0.01 ? { x: 104, y: lerp(-112, -250, arms), o: arms } : null;
  const joy = win(t, 4.1, 10.8, 0.25);
  const hop = t > 4.2 && t < 6.4 ? 40 * Math.abs(Math.sin(TAU * (t - 4.2) * 1.0)) : 0;
  const eyeY = LY - CH * 133;
  const track = t >= 1.0 && t < 11.4;
  const fx = m.ma > 0.5 || t > 4 ? m.x : m.x,
    fy = m.y;
  const lx = track ? clamp((fx - LX) / 40, -7, 7) : id.lx,
    ly = track ? clamp((fy - eyeY) / 90, -8, 8) : id.ly;
  const blink = LK.blinkAt(t, [0.7, 6.9, 11.7]);
  lumo.set({
    x: LX,
    lift: catchJ + hop,
    aL,
    aR,
    sx: id.sx,
    sy: id.sy,
    lx,
    ly,
    open: blink,
    happy: t > 5.8 && t < 10.6 ? win(t, 5.8, 10.6, 0.3) : 0,
    glow: id.glow + 0.6 * bump(t, 4.0, 4.6),
    glowR: 100 + 60 * bump(t, 4.0, 4.6),
    ew: 1 + 0.15 * bump(t, 1.8, 2.4),
    eh: 1 + 0.25 * bump(t, 1.8, 2.4),
  });
  sp.draw(t, 4.0, 0.9, MC[0], MC[1], 240, 80);
  sp2.draw(t, 5.4, 1.0, 540, 520, 300, 40);
}
LK.run(T, draw);
