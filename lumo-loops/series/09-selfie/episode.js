/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, inCubic, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T);
const LX = 360,
  LY = gy(LX);
const TF = [3.2, 6.2, 9.2];
const mini = (kind) => {
  const lumoMini = `<g transform="translate(-34 22)"><path d="M0 -62 C8 -50 28 -34 28 -14 C28 2 14 8 0 8 C-14 8 -28 2 -28 -14 C-28 -34 -8 -50 0 -62Z" fill="#f6e4c4"/><circle cx="-9" cy="-20" r="4.4" fill="#2b223b"/><circle cx="9" cy="-20" r="4.4" fill="#2b223b"/><ellipse cx="-17" cy="-10" rx="5" ry="3" fill="#e5c8b8"/><ellipse cx="17" cy="-10" rx="5" ry="3" fill="#e5c8b8"/><circle cy="-70" r="8" fill="#f6ad3c"/></g>`;
  const bg = `<rect x="-95" y="-105" width="190" height="190" rx="6" fill="#1b2060"/><circle cx="-60" cy="-70" r="2" fill="#fff"/><circle cx="64" cy="-40" r="2" fill="#fff"/><circle cx="40" cy="60" r="2" fill="#fff"/>`;
  let body = bg;
  if (kind === 0)
    body += lumoMini + `<path d="M95 -105 L40 -80 L95 -60Z" fill="#9fd8ff" opacity=".8"/>`;
  if (kind === 1)
    body +=
      lumoMini +
      `<path d="M-95 -20 Q0 -50 95 -90 L95 10 Q0 10 -95 30Z" fill="#9fd8ff" opacity=".85"/><circle cx="60" cy="-30" r="40" fill="#fff"/>`;
  if (kind === 2)
    body +=
      lumoMini.replace("translate(-34 22)", "translate(-44 22)") +
      `<g transform="translate(52 -6)"><circle r="40" fill="#fff"/><ellipse cx="-14" cy="-6" rx="5" ry="6" fill="#292340"/><ellipse cx="12" cy="-6" rx="5" ry="6" fill="#292340"/><path d="M-12 12 Q0 24 12 12" stroke="#fc6b8a" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-22 -34 Q-34 -62 -6 -42Z M12 -38 Q30 -62 30 -32Z" fill="#fff"/></g>`;
  return (
    `<rect x="-112" y="-130" width="224" height="268" rx="10" fill="#f6f1e6"/>` +
    `<g transform="translate(0 -6) scale(.96)">${body}</g>`
  );
};
const polys = TF.map((tf, i) => {
  const g = mk("g", {}, W.top);
  g.innerHTML = mini(i);
  return g;
});
const SLOT = [
  [250, 230],
  [540, 200],
  [830, 230],
];
const comet = mk("g", {}, W.fx);
comet.innerHTML = `<path d="M-30 -34 C-200 -50 -420 -20 -640 30 C-420 -2 -200 14 -30 34Z" fill="url(#tail)"/><use href="#spark" fill="#fff" transform="translate(-260 -2) scale(1.2)"/><use href="#spark" fill="#d6f3ff" transform="translate(-420 14) scale(.9)"/><circle r="64" fill="#bdeaff" opacity=".35"/><circle r="42" fill="#fff"/>`;
const wisp = LK.wisp(W.fx);
const phone = mk("g", {}, W.fx);
phone.innerHTML = `<rect x="-44" y="-84" width="88" height="168" rx="18" fill="#3a3f86" stroke="#8d92e8" stroke-width="5"/><circle cx="-14" cy="-52" r="18" fill="#12154a" stroke="#c9cfe6" stroke-width="5"/><circle cx="-14" cy="-52" r="7" fill="#7ad8ff"/><circle cx="22" cy="-62" r="5" fill="#ffe39a"/>`;
const dots = [0, 1, 2].map((i) => mk("circle", { r: 14, fill: "#ffe39a", opacity: 0 }, W.fx));
const flash = mk("circle", { r: 20, fill: "#fff", opacity: 0 }, W.fx),
  wash = mk("rect", { x: 0, y: 0, width: 1080, height: 1920, fill: "#fff", opacity: 0 }, W.top);
const lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 12);
const HAND = (lift) => [LX + 116 * CH, LY - CH * (190 + lift)];
function draw(t) {
  W.update(t);
  const id = LK.idle(t, T);
  const arm = sine(seg(t, 0.7, 1.3)) * (1 - sine(seg(t, 11.0, 11.6)));
  const lift = 0,
    H = HAND(lift),
    ph = [H[0] + 26, H[1] - 150];
  phone.setAttribute(
    "transform",
    `translate(${f2(ph[0])} ${f2(ph[1])}) rotate(-14) scale(${f2(CH * 0.85 * arm)})`,
  );
  phone.setAttribute("opacity", arm > 0.01 ? 1 : 0);
  const lensG = [ph[0] - 14 * CH * 0.85 * Math.cos(-0.24), ph[1] - 52 * CH * 0.85];
  // countdown, flash
  let pose = 0,
    fl = 0,
    bounce = 0;
  TF.forEach((tf, k) => {
    for (let d = 0; d < 3; d++)
      if (k === 0 && d === 0) {
      }
    pose = Math.max(pose, win(t, tf - 0.9, tf + 0.5, 0.15));
    fl = Math.max(fl, bump(t, tf, tf + 0.35));
  });
  const k = TF.findIndex((tf) => t > tf - 1.3 && t < tf + 0.6);
  dots.forEach((d, i) => {
    const on = k >= 0 ? (t > TF[k] - 1.2 + i * 0.35 && t < TF[k] ? 1 : 0) : 0;
    d.setAttribute("opacity", on);
    d.setAttribute("cx", f2(ph[0] - 90 + i * 40));
    d.setAttribute("cy", f2(ph[1] - 150));
  });
  flash.setAttribute("cx", f2(lensG[0]));
  flash.setAttribute("cy", f2(lensG[1]));
  flash.setAttribute("r", f2(30 + 150 * fl));
  flash.setAttribute("opacity", f2(0.8 * fl));
  wash.setAttribute("opacity", f2(0.35 * fl));
  // comet photobombs
  const c1 = seg(t, TF[0] + 0.5, TF[0] + 2.0); // too late, passes after the shot
  const c2 = seg(t, TF[1] - 0.7, TF[1] + 0.7); // crosses right in front of the face
  let cx = 0,
    cy = 0,
    cvis = 0;
  if (c1 > 0 && c1 < 1) {
    cx = lerp(1500, -700, sine(c1));
    cy = lerp(620, 420, c1);
    cvis = 1;
  }
  if (c2 > 0 && c2 < 1) {
    cx = lerp(-300, 1500, sine(c2));
    cy = lerp(1030, 1060, c2);
    cvis = 1;
  }
  comet.setAttribute("opacity", cvis);
  comet.setAttribute(
    "transform",
    `translate(${f2(cx)} ${f2(cy)}) scale(${c2 > 0 && c2 < 1 ? 1.5 : 1})`,
  );
  // Wisp photobomb at third shot
  const wu = seg(t, TF[2] - 0.9, TF[2] + 1.5),
    wp = sine(clamp(wu / 0.4, 0, 1)) * (1 - sine(clamp((wu - 0.55) / 0.45, 0, 1)));
  wisp.set(lerp(1300, LX + 215, wp), LY - CH * 250, 0, 1.3, wp > 0.01 ? 1 : 0);
  // polaroids
  polys.forEach((p, i) => {
    const q = outBack(seg(t, TF[i] + 0.2, TF[i] + 1.0)),
      out = sine(seg(t, 11.0, 11.7));
    const x = lerp(ph[0], SLOT[i][0], q),
      y = lerp(ph[1], SLOT[i][1], q),
      s = lerp(0.1, 0.9, q) * (1 - 0.0 * out);
    p.setAttribute(
      "transform",
      `translate(${f2(x)} ${f2(y)}) rotate(${f2(lerp(180, (i - 1) * 6, q) + 2 * Math.sin((TAU * 2 * t) / T + i))}) scale(${f2(s)})`,
    );
    p.setAttribute("opacity", f2(t > TF[i] + 0.2 ? 1 - out : 0));
  });
  // Lumo
  const nextC = c1 > 0 && c1 < 1;
  const lookAtC = nextC ? clamp((cx - LX) / 40, -7, 7) : 0;
  const shock = win(t, TF[1] + 0.5, TF[1] + 1.6, 0.1);
  const joy = Math.max(pose * 0.0, win(t, TF[2] + 0.6, 10.9, 0.2));
  const smile = Math.max(
    win(t, TF[0] - 0.7, TF[0] + 0.4, 0.12),
    win(t, TF[1] - 0.7, TF[1] - 0.2, 0.08),
    win(t, TF[2] - 0.7, TF[2] + 0.4, 0.12),
  );
  const blink = LK.blinkAt(t, [0.4, 5.0, 11.3]);
  lumo.set({
    x: LX,
    lift: 20 * bump(t, TF[2] + 0.6, TF[2] + 1.4) + 24 * bump(t, TF[0] + 0.6, TF[0] + 1.4) * 0,
    rot: 5 * smile,
    aR: arm > 0.01 ? { x: 116, y: -190, o: arm } : null,
    sx: id.sx,
    sy: id.sy,
    lx: smile > 0.5 ? 6 : lerp(id.lx, lookAtC * 0.8, nextC ? 1 : 0),
    ly: smile > 0.5 ? -6 : id.ly,
    open: blink,
    happy: clamp(smile + joy, 0, 1) * (1 - shock),
    ew: 1 + 0.25 * shock,
    eh: 1 + 0.4 * shock,
    mouth: shock,
    glow: id.glow + 0.8 * fl,
    glowR: 100 + 80 * fl,
  });
  TF.forEach((tf) =>
    sp.draw(t, tf + 0.2, 0.9, SLOT[TF.indexOf(tf)][0], SLOT[TF.indexOf(tf)][1] + 140, 150, 40),
  );
}
LK.run(T, draw);
