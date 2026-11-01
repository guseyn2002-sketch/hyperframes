/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T, { tree: true });
const rnd = LK.prng(505),
  NSTAR = 36;
const stars = [];
for (let i = 0; i < NSTAR; i++) {
  const hx = 70 + rnd() * 940,
    hy = 90 + rnd() * 780,
    a = rnd() * TAU,
    rr = 10 + rnd() * 80;
  stars.push({
    hx,
    hy,
    ox: Math.cos(a) * rr,
    oy: Math.sin(a) * rr,
    d: rnd() * 1.6,
    s: 0.5 + rnd() * 0.5,
    ph: rnd() * TAU,
    el: mk(
      "use",
      { href: "#star5", fill: i % 3 ? "#ffd45e" : "#fff3c4", stroke: "#fff3c4", "stroke-width": 3 },
      W.back,
    ),
  });
}
const ball = mk("g", {}, W.fx);
ball.innerHTML = `<circle class="g" r="200" fill="url(#warm)"/><circle class="c" r="60" fill="#fff3c4"/>`;
const bg = ball.querySelector(".g"),
  bc = ball.querySelector(".c");
const mag = mk("g", {}, W.fx);
mag.innerHTML = `<path d="M-62 40 L-62 -50 A62 62 0 0 1 62 -50 L62 40 L36 40 L36 -50 A36 36 0 0 0 -36 -50 L-36 40Z" fill="#ff5a6a"/><rect x="-62" y="14" width="26" height="30" fill="#e3e7f5"/><rect x="36" y="14" width="26" height="30" fill="#e3e7f5"/>`;
const rings = mk(
  "circle",
  { r: 20, fill: "none", stroke: "#ffe39a", "stroke-width": 8, opacity: 0 },
  W.fx,
);
const lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 14);
const LX = 330,
  LY = gy(LX),
  JUMP = 90;
const BALL = [LX + 40, 640];
function draw(t) {
  W.update(t);
  const hold = sine(seg(t, 1.0, 1.5)) * (1 - sine(seg(t, 8.8, 9.3)));
  const strain = win(t, 4.6, 6.4, 0.2),
    release = t >= 6.4;
  const lift = sine(seg(t, 1.4, 2.0)) * JUMP * (1 - sine(seg(t, 6.4, 6.9)));
  const shake = strain * 5 * Math.sin(t * 70);
  const hx = LX + 30 + shake,
    hy = LY - CH * (270 + lift);
  const tipX = hx,
    tipY = hy - CH * 20;
  // stars
  let absorbed = 0;
  stars.forEach((s) => {
    const inP = sine(seg(t, 2.0 + s.d, 3.6 + s.d)),
      outP = outBack(seg(t, 6.45, 8.0));
    const cxp = BALL[0] + s.ox,
      cyp = BALL[1] + s.oy;
    let x,
      y,
      a = 1,
      sc = s.s;
    if (t < 6.45) {
      x = lerp(s.hx, cxp, inP);
      y = lerp(s.hy, cyp, inP);
      absorbed += inP;
    } else {
      x = lerp(cxp, s.hx, outP);
      y = lerp(cyp, s.hy, outP);
    }
    const tw = 0.85 + 0.15 * Math.sin((TAU * 3 * t) / T + s.ph);
    s.el.setAttribute(
      "transform",
      `translate(${f2(x)} ${f2(y)}) scale(${f2(sc * tw * (t < 6.45 ? 1 - 0.35 * inP : 1))}) rotate(${f2(t < 6.45 ? 180 * inP : 180 + 180 * Math.min(1, outP))})`,
    );
    s.el.setAttribute("opacity", 1);
  });
  const frac = t < 6.45 ? absorbed / NSTAR : 0;
  const pop = t >= 6.45 ? 1 - seg(t, 6.45, 7.0) : 1;
  const rBall =
    (24 + 96 * frac) * (1 + 0.04 * Math.sin(((TAU * 5 * t) / T) * 2)) * (t >= 6.45 ? pop : 1);
  ball.setAttribute("opacity", frac > 0.02 || (t >= 6.45 && pop > 0.02) ? 1 : 0);
  ball.setAttribute("transform", `translate(${BALL[0]} ${BALL[1]})`);
  bc.setAttribute("r", f2(rBall));
  bg.setAttribute("r", f2(rBall * 3.2));
  // magnet follows the hand
  const dropP = seg(t, 6.4, 7.6);
  mag.setAttribute(
    "transform",
    `translate(${f2(hx)} ${f2(hy + dropP * dropP * 500)}) rotate(${f2(dropP * 140 + shake)}) scale(${f2(hold * 1.15 * (1 - sine(seg(t, 8.8, 9.3))) + 0.0)})`,
  );
  mag.setAttribute("opacity", hold > 0.01 && dropP < 1 ? 1 : 0);
  const rg = seg(t, 6.45, 7.2);
  rings.setAttribute("cx", BALL[0]);
  rings.setAttribute("cy", BALL[1]);
  rings.setAttribute("r", f2(60 + 600 * rg));
  rings.setAttribute("opacity", f2(rg > 0 && rg < 1 ? 0.8 * (1 - rg) : 0));
  rings.setAttribute("stroke-width", f2(12 * (1 - rg)));
  // Lumo
  const id = LK.idle(t, T);
  const aR = hold > 0.01 && t < 6.5 ? { x: 112, y: -250 - 0, o: hold } : null;
  const oops = win(t, 6.4, 7.6, 0.08),
    joy = win(t, 7.9, 10.9, 0.25);
  const hop = joy > 0.05 ? 34 * Math.abs(Math.sin(TAU * (t - 7.9) * 1.1)) : 0;
  const eyeY = LY - CH * 133;
  const tgt = t < 6.45 ? BALL : [540, 500];
  const blink = LK.blinkAt(t, [0.7, 9.8, 11.3]);
  lumo.set({
    x: LX + shake * 0.4,
    lift: lift + hop,
    aR,
    sx: id.sx * (1 + 0.1 * strain),
    sy: id.sy * (1 - 0.08 * strain),
    lx: clamp((tgt[0] - LX) / 40, -7, 7),
    ly: clamp((tgt[1] - eyeY) / 90, -8, 8),
    open: blink,
    happy: joy,
    ew: 1 + 0.2 * oops,
    eh: 1 + 0.4 * oops - 0.4 * strain,
    mouth: oops * (1 - joy),
    glow: id.glow + 0.9 * bump(t, 6.4, 7.4),
    glowR: 100 + 80 * bump(t, 6.4, 7.4),
  });
  sp.draw(t, 6.45, 0.9, BALL[0], BALL[1], 340, 100);
}
LK.run(T, draw);
