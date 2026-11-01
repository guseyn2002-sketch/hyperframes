/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T, { tree: true });

// A dawn-coloured world lives UNDER a night "curtain". The zip pulls the curtain apart down the middle.
const dawn = mk("g", {}, W.back);
dawn.innerHTML = `<defs><linearGradient id="dw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9e7a"/><stop offset=".55" stop-color="#ffcf8a"/><stop offset="1" stop-color="#ffe9b0"/></linearGradient>
<clipPath id="zipclip"><rect class="zc" x="0" y="0" width="1080" height="1400"/></clipPath></defs>`;
// night curtain halves (drawn in cam so they hide dawn); we build dawn above sky, curtain above dawn
const dawnBox = mk("g", {}, W.back);
dawnBox.innerHTML = `<rect x="-40" y="-40" width="1160" height="1800" fill="url(#dw)"/><circle cx="540" cy="1250" r="230" fill="#fff3c0" opacity=".9"/><circle cx="540" cy="1250" r="380" fill="url(#warm)"/>`;
const curtain = mk("g", {}, W.back);
curtain.innerHTML = `<path class="cl" d="" fill="#171548"/><path class="cr" d="" fill="#171548"/><g class="cs"></g>`;
const cl = curtain.querySelector(".cl"),
  cr = curtain.querySelector(".cr"),
  cs = curtain.querySelector(".cs");
const rnd = LK.prng(2020);
const cstars = [];
for (let i = 0; i < 46; i++)
  cstars.push({
    x: rnd() * 1080,
    y: rnd() * 1380,
    r: 1.6 + rnd() * 3,
    k: 1 + Math.floor(rnd() * 5),
    ph: rnd() * TAU,
    el: mk("circle", { fill: "#fff" }, cs),
  });
// zipper teeth line
const teeth = [];
const tg = mk("g", {}, W.back);
for (let i = 0; i < 24; i++)
  teeth.push([
    mk("rect", { width: 22, height: 10, rx: 3, fill: "#c9cfe6" }, tg),
    mk("rect", { width: 22, height: 10, rx: 3, fill: "#9aa3c6" }, tg),
  ]);
const pull = mk("g", {}, W.fx);
pull.innerHTML = `<rect x="-26" y="-34" width="52" height="68" rx="14" fill="#e9ecfa" stroke="#9aa3c6" stroke-width="5"/><circle cy="40" r="22" fill="none" stroke="#ff9e7a" stroke-width="10"/>`;

const ZX = 540; // zip line x
const zipY = (t) => 1380 - 1380 * sine(seg(t, 3.0, 6.4)) + 1380 * sine(seg(t, 9.0, 11.2)); // pulled up (open) then down (closed)
// y of the slider: 1380 (closed bottom) .. 0 (open to top)
const openAmt = (y) => y; // curtain is open below the slider? no: slider moves up = zip closing
function curtainPaths(y) {
  // closed above slider (y..0), open below (y..1380): opening widens toward bottom (V-shaped gap)
  const gap = (yy) => Math.max(0, yy - y) * 0.62;
  const pts = [],
    n = 28;
  for (let i = 0; i <= n; i++) {
    const yy = y + (1800 - y) * (i / n);
    pts.push([yy, gap(yy)]);
  }
  const left = [`M-40 -40 L${ZX} -40 L${ZX} ${f2(y)}`],
    right = [`M1120 -40 L${ZX} -40 L${ZX} ${f2(y)}`];
  pts.forEach(([yy, g]) => {
    left.push(`L${f2(ZX - g)} ${f2(yy)}`);
    right.push(`L${f2(ZX + g)} ${f2(yy)}`);
  });
  left.push(`L-40 1800 Z`);
  right.push(`L1120 1800 Z`);
  return [left.join(" "), right.join(" ")];
}

const lumo = LK.lumo(W.chars);
const sp = LK.sparks(W.fx, 14);
const LX = 270,
  LY = gy(LX);

function draw(t) {
  W.update(t);
  const y = zipY(t);
  const [dl, dr] = curtainPaths(clamp(y, 0, 1400));
  cl.setAttribute("d", dl);
  cr.setAttribute("d", dr);
  cstars.forEach((s) => {
    s.el.setAttribute("cx", f2(s.x));
    s.el.setAttribute("cy", f2(s.y));
    s.el.setAttribute("r", f2(s.r));
    s.el.setAttribute("opacity", f2(0.4 + 0.5 * Math.sin((TAU * s.k * t) / T + s.ph) * 0.5 + 0.25));
  });
  teeth.forEach(([a, b], i) => {
    const ty = 40 + i * 58;
    const gap = Math.max(0, ty - y) * 0.62;
    const closed = ty < y;
    a.setAttribute("x", f2(ZX - 22 - (closed ? 0 : gap) + (closed ? 2 : 0)));
    a.setAttribute("y", f2(ty));
    b.setAttribute("x", f2(ZX + (closed ? 0 : gap) - (closed ? 2 : 0)));
    b.setAttribute("y", f2(ty + 28));
    a.setAttribute("opacity", ty < 1380 ? 1 : 0);
    b.setAttribute("opacity", ty < 1380 ? 1 : 0);
  });
  const sliderVis = 1;
  pull.setAttribute(
    "transform",
    `translate(${ZX} ${f2(clamp(y, 40, 1380) - 10)}) rotate(${f2(6 * Math.sin(((TAU * 3 * t) / T) * 2 + y * 0.01))})`,
  );
  // Lumo pulls the slider by jumping / hanging; arm reaches to slider
  const grab = sine(seg(t, 1.6, 2.2)) * (1 - sine(seg(t, 11.2, 11.8)));
  const tgtY = clamp(y, 150, 1380);
  // Lumo hops along the ground x toward the slider x, jumping as the slider climbs (visual)
  const id = LK.idle(t, T);
  const walkX = lerp(LX, 440, sine(seg(t, 2.0, 3.0)) * (1 - sine(seg(t, 11.0, 11.8))));
  const jump = grab * clamp((1380 - tgtY) / 1380, 0, 1) * 160; // rising with the zip
  const pullDown = sine(seg(t, 9.0, 11.2));
  const hold = grab * (1 - 0.0);
  const aR = hold > 0.01 ? { x: 112, y: -240, o: hold } : null;
  const lift =
    jump * (1 - 0.5 * pullDown) * 0 + sine(seg(t, 3.0, 6.4)) * 150 * (1 - pullDown) * grab;
  const bob = Math.abs(Math.sin(TAU * 1.5 * t)) * 10 * win(t, 3.0, 6.4, 0.2);
  const happy = win(t, 6.8, 8.8, 0.2),
    shock = win(t, 6.4, 6.9, 0.05) * 0;
  const blink = LK.blinkAt(t, [0.9, 5.0, 10.6]);
  const hx = walkX + 112 * CH,
    hy = LY - CH * (240 + lift + bob);
  lumo.set({
    x: walkX,
    lift: lift + bob,
    aR,
    sx: id.sx,
    sy: id.sy,
    lx: lerp(id.lx, 2, grab),
    ly: lerp(id.ly, -8, grab),
    open: blink,
    happy,
    glow: id.glow + 0.6 * bump(t, 6.4, 7.0),
    glowR: 100 + 60 * bump(t, 6.4, 7.0),
  });
  sp.draw(t, 6.3, 0.9, ZX, 160, 260, 80);
}
LK.run(T, draw);
