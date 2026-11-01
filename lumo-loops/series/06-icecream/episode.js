/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU, bez } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T);
const LX = 300,
  LY = gy(LX);
const COL = [
  ["#ff8a5a", "#ffb08a"],
  ["#5aa8ff", "#9cc9ff"],
  ["#ffd36b", "#fff0a8"],
  ["#ff8fc0", "#ffc0dc"],
];
const HOME = [
  [760, 360],
  [330, 470],
  [860, 700],
  [540, 250],
];
const NS = 4,
  ta = [2.4, 3.9, 5.4, 6.9],
  tret = [9.6, 10.0, 10.4, 10.8];
const cone = mk("g", {}, W.chars);
cone.innerHTML = `<path d="M-72 -232 L72 -232 L0 6Z" fill="#e2a85a"/><g stroke="#c58a3c" stroke-width="4" opacity=".7"><path d="M-48 -232 L26 -40 M-16 -232 L40 -90 M16 -232 L52 -140 M48 -232 L60 -190 M-72 -190 L-20 -40 M-72 -140 L-44 -60"/><path d="M48 -232 L-26 -40 M16 -232 L-40 -90 M-16 -232 L-52 -140 M-48 -232 L-60 -190 M72 -190 L20 -40 M72 -140 L44 -60"/></g><rect x="-84" y="-250" width="168" height="28" rx="12" fill="#f0c27a"/>`;
const scoops = [];
for (let i = 0; i < NS; i++) {
  const g = mk("g", {}, W.fx);
  g.innerHTML = `<circle r="86" fill="url(#warm)" opacity=".5"/><g class="sq"><circle cy="-6" r="74" fill="${COL[i][0]}"/><path d="M-74 14 Q-60 54 -40 22 Q-24 58 0 24 Q22 60 40 22 Q60 54 74 14 Z" fill="${COL[i][0]}"/><ellipse cx="-24" cy="-34" rx="22" ry="12" fill="${COL[i][1]}" opacity=".75" transform="rotate(-25 -24 -34)"/><path d="M-32 -2 Q-22 -14 -12 -2 M12 -2 Q22 -14 32 -2" stroke="#2b223b" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/><ellipse cx="-42" cy="12" rx="12" ry="7" fill="#fff" opacity=".35"/><ellipse cx="42" cy="12" rx="12" ry="7" fill="#fff" opacity=".35"/></g>`;
  scoops.push({ g, sq: g.querySelector(".sq") });
}
const wisp = LK.wisp(W.fx),
  lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 12);
const hearts = [];
for (let i = 0; i < 4; i++)
  hearts.push(
    mk(
      "path",
      { d: "M0 8 C-14 -4 -10 -16 0 -8 C10 -16 14 -4 0 8Z", fill: "#ff8fb0", opacity: 0 },
      W.fx,
    ),
  );
const landed = (t) =>
  ta.reduce((a, x) => a + sine(seg(t, x, x + 0.25)), 0) -
  tret.reduce((a, x) => a + sine(seg(t, x, x + 0.2)), 0) * 0;
function stackAt(t, i, hand, lean) {
  const y = -250 - 38 - i * 100;
  const a = (lean * Math.PI) / 180;
  return [hand[0] + Math.sin(a) * -y * CH * 1, hand[1] + Math.cos(a) * y * CH];
}
function draw(t) {
  W.update(t);
  const id = LK.idle(t, T);
  const nl = ta.reduce((a, x, i) => a + (t > x + 0.15 && t < tret[i] ? 1 : 0), 0);
  const lean =
    (4 + 3 * nl) *
    Math.sin((TAU * 3 * t) / T) *
    sine(seg(t, 2.0, 3.0)) *
    (1 - sine(seg(t, 9.6, 11.0)));
  const hop = Math.abs(Math.sin(TAU * 1.5 * t)) * 0;
  const arm = sine(seg(t, 0.8, 1.4)) * (1 - sine(seg(t, 11.0, 11.7)));
  const lift = 0;
  const hand = [LX + 112 * CH, LY - CH * 190];
  cone.setAttribute(
    "transform",
    `translate(${f2(hand[0])} ${f2(hand[1])}) rotate(${f2(lean)}) scale(${f2(CH * 0.8)})`,
  );
  cone.setAttribute("opacity", f2(arm));
  scoops.forEach((s, i) => {
    const hx = HOME[i][0],
      hy = HOME[i][1] + 14 * Math.sin((TAU * 2 * t) / T + i);
    let x = hx,
      y = hy,
      sx = 1,
      sy = 1,
      rot = 0;
    const tf = ta[i] - 0.9,
      tr = tret[i];
    if (t >= tf && t < tr) {
      const [px, py] = stackAt(t, i, hand, lean);
      if (t < ta[i]) {
        const u = sine(seg(t, tf, ta[i]));
        const c1 = [hx, hy - 160],
          c2 = [px + 220, py - 320];
        [x, y] = bez([hx, hy], c1, c2, [px, py], u);
        rot = 360 * u;
      } else {
        x = px;
        y = py;
        rot = lean * 0.6;
        const q = bump(t, ta[i], ta[i] + 0.3);
        sx = 1 + 0.2 * q;
        sy = 1 - 0.22 * q;
      }
    } else if (t >= tr && t < tr + 0.9) {
      const [px, py] = stackAt(tr, i, hand, 0),
        u = outBack(seg(t, tr, tr + 0.9)),
        uu = sine(seg(t, tr, tr + 0.9));
      x = lerp(px, hx, uu);
      y = lerp(py, hy, uu) - 120 * Math.sin(Math.PI * uu);
      rot = -360 * uu;
    }
    s.g.setAttribute(
      "transform",
      `translate(${f2(x)} ${f2(y)}) rotate(${f2(rot)}) scale(${f2(0.9 * sx)} ${f2(0.9 * sy)})`,
    );
  });
  // Wisp licks the top scoop
  const wu = seg(t, 7.8, 9.4);
  const top = stackAt(t, 3, hand, lean);
  if (wu > 0 && wu < 1) {
    const x =
        wu < 0.5
          ? lerp(1300, top[0] + 110, outCubic(wu / 0.5))
          : lerp(top[0] + 110, -300, LK.inCubic((wu - 0.5) / 0.5)),
      y = lerp(520, top[1], sine(clamp(wu / 0.5, 0, 1))) - 60 * Math.sin(Math.PI * wu);
    wisp.set(x, y, wu < 0.5 ? 8 : -8, 0.9, 1);
  } else wisp.set(0, 0, 0, 0.001, 0);
  hearts.forEach((h, i) => {
    const q = seg(t, 8.5 + i * 0.12, 9.5 + i * 0.12);
    h.setAttribute("opacity", f2(q > 0 && q < 1 ? 1 - q : 0));
    h.setAttribute(
      "transform",
      `translate(${f2(top[0] - 60 + i * 40)} ${f2(top[1] - 130 - 90 * q)}) scale(${f2(1.2 + 0.4 * i * 0.2)})`,
    );
  });
  const wob = win(t, 6.9, 9.6, 0.3);
  const happy = win(t, 7.4, 9.6, 0.25);
  const blink = LK.blinkAt(t, [0.7, 4.7, 11.4]);
  const topY = t > 2 && t < 10 ? top[1] : 400;
  lumo.set({
    x: LX,
    lift,
    rot: -lean * 0.8,
    aR: arm > 0.01 ? { x: 112, y: -190, o: arm } : null,
    sx: id.sx,
    sy: id.sy,
    lx:
      clamp((top[0] - LX) / 40, -7, 7) * (t > 2 && t < 10 ? 1 : 0) +
      id.lx * (t > 2 && t < 10 ? 0 : 1),
    ly: -6 * (t > 2 && t < 10 ? 1 : 0) + id.ly * (t > 2 && t < 10 ? 0 : 1),
    open: blink,
    happy,
    ew: 1 + 0.2 * wob,
    eh: 1 + 0.3 * wob,
    glow: id.glow + 0.5 * bump(t, 8.4, 9.2),
  });
  sp.draw(t, 8.4, 0.9, top[0], top[1], 160, 60);
}
LK.run(T, draw);
