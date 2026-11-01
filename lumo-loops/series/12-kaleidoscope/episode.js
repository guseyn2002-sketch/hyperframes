/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T);
const LX = 300,
  LY = gy(LX);
const MX = 600,
  MY = 620,
  MR = 400;
const mand = mk("g", {}, W.fx);
const defs = mk("defs", {}, mand);
const wedge = mk("g", { id: "wedge" }, defs);
mk("circle", { cx: 0, cy: 0, r: MR + 90, fill: "url(#warm)", opacity: 0.5 }, mand);
const PAL = ["#ff8fc0", "#ffd36b", "#8fe0c0", "#9cc9ff", "#c9a6ff", "#ff9d6b"];
const shards = [];
for (let k = 0; k < 9; k++)
  shards.push({ el: mk("path", { fill: PAL[k % 6], opacity: 0.88 }, wedge), k });
const disc = mk("g", {}, mand);
const wedges = [];
for (let w = 0; w < 12; w++)
  wedges.push(
    mk("use", { href: "#wedge", transform: `rotate(${w * 30}) scale(1 ${w % 2 ? -1 : 1})` }, disc),
  );
const clip = mk("clipPath", { id: "mclip" }, defs);
mk("circle", { r: MR }, clip);
disc.setAttribute("clip-path", "url(#mclip)");
mk(
  "circle",
  { r: MR, fill: "none", stroke: "#fff", "stroke-opacity": ".5", "stroke-width": 10 },
  mand,
);
const scope = mk("g", {}, W.fx);
scope.innerHTML = `<rect x="-26" y="-190" width="52" height="260" rx="14" fill="#d9a85a"/><rect x="-30" y="-130" width="60" height="20" rx="6" fill="#f0c27a"/><rect x="-30" y="-30" width="60" height="20" rx="6" fill="#f0c27a"/><rect x="-34" y="-196" width="68" height="30" rx="10" fill="#9b7040"/><circle cy="-190" r="14" fill="#3a2a60"/>`;
const lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 14);
const hand = (lift) => [LX + 100 * CH, LY - CH * (200 + lift)];
function draw(t) {
  W.update(t);
  const id = LK.idle(t, T);
  const arm = sine(seg(t, 0.7, 1.4)) * (1 - sine(seg(t, 11.0, 11.7)));
  const bloom = outBack(seg(t, 2.0, 3.2)) * (1 - sine(seg(t, 10.0, 11.3)));
  const lift = 0,
    H = hand(lift);
  // scope points from hand toward the mandala centre
  const ang = (Math.atan2(MY - H[1], MX - H[0]) * 180) / Math.PI + 90;
  scope.setAttribute(
    "transform",
    `translate(${f2(H[0])} ${f2(H[1] + 10)}) rotate(${f2(ang * 0.35)}) scale(${f2(CH * 0.85 * arm)})`,
  );
  scope.setAttribute("opacity", arm > 0.01 ? 1 : 0);
  mand.setAttribute(
    "transform",
    `translate(${MX} ${MY}) rotate(${f2(((360 * t) / T) * 1)}) scale(${f2(Math.max(0.001, bloom))})`,
  );
  mand.setAttribute("opacity", bloom > 0.01 ? 1 : 0);
  // animate the base wedge: shards drift radially; everything periodic over T
  shards.forEach(({ el, k }) => {
    const ph = (TAU * (2 + (k % 3)) * t) / T + k * 0.9;
    const r0 = MR * (0.18 + ((0.1 * k) / 8) * 3),
      r1 = r0 + MR * (0.18 + 0.1 * Math.sin(ph));
    const a0 = 1 + (7 * ((k * 7) % 5)) / 4,
      a1 = a0 + 13 + 8 * Math.sin(ph * 0.5 + k);
    const P = (r, a) => [r * Math.cos((a * Math.PI) / 180), r * Math.sin((a * Math.PI) / 180)];
    const p1 = P(r0, a0),
      p2 = P(r1, a0 + 4),
      p3 = P(r1 + 40, a1),
      p4 = P(r0 + 30, a1 + 2);
    el.setAttribute(
      "d",
      `M${f2(p1[0])} ${f2(p1[1])} L${f2(p2[0])} ${f2(p2[1])} L${f2(p3[0])} ${f2(p3[1])} L${f2(p4[0])} ${f2(p4[1])}Z`,
    );
    el.setAttribute("fill", PAL[(k + Math.floor(((t / T) * 6 + k * 0.0) % 6)) % 6]);
  });
  // Lumo looks through the scope
  const looking = bloom > 0.05 ? 1 : 0;
  const awe = win(t, 2.4, 9.8, 0.4);
  const wonder = bump(t, 2.0, 3.4);
  const tilt = 6 * Math.sin((TAU * 2 * t) / T) * awe;
  const hop = 18 * bump(t, 3.0, 3.6) + 22 * bump(t, 9.2, 9.8);
  const blink = LK.blinkAt(t, [0.6, 7.2, 11.3]);
  lumo.set({
    x: LX,
    lift: hop,
    rot: tilt,
    aR: arm > 0.01 ? { x: 100, y: -200, o: arm } : null,
    sx: id.sx,
    sy: id.sy,
    lx: lerp(id.lx, clamp((MX - LX) / 40, -7, 7), awe),
    ly: lerp(id.ly, -8, awe),
    open: blink,
    happy: win(t, 4.2, 9.6, 0.4) * (1 - 0.0),
    ew: 1 + 0.25 * wonder,
    eh: 1 + 0.4 * wonder,
    mouth: wonder * 0.8,
    glow: id.glow + 0.5 * bump(t, 2.0, 3.4),
  });
  sp.draw(t, 2.2, 1.0, MX, MY, 420, 40);
}
LK.run(T, draw);
