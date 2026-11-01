/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T);
const LX = 300,
  LY = gy(LX);
const CL = [
  [200, 380],
  [560, 250],
  [860, 420],
  [420, 640],
  [820, 780],
]; // cloud homes
const SH = [
  [110, 200],
  [700, 150],
  [980, 300],
  [300, 520],
  [640, 560],
]; // star homes
const th = [1.2, 1.55, 1.9, 2.25, 2.6]; // star i hides
const tf = [4.2, 5.4, 6.6, 7.8, 9.9]; // star i found (last = from the bulb)
const stars = SH.map((p, i) =>
  mk("use", { href: "#star5", fill: "#ffd45e", stroke: "#fff3c4", "stroke-width": 3 }, W.back),
);
const clouds = CL.map(() => {
  const g = mk("g", {}, W.fx);
  g.innerHTML = `<path d="M-90 34 C-130 34 -130 -18 -90 -18 C-90 -66 -26 -80 0 -40 C26 -80 98 -62 88 -14 C130 -14 130 34 92 34Z" fill="#eef3ff"/><path d="M-30 -2 Q-20 -12 -10 -2 M16 -2 Q26 -12 36 -2" stroke="#7d6f9a" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/><ellipse cx="-44" cy="12" rx="12" ry="7" fill="#f6b3c0" opacity=".7"/><ellipse cx="54" cy="12" rx="12" ry="7" fill="#f6b3c0" opacity=".7"/>`;
  return g;
});
const lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 12),
  sp2 = LK.sparks(W.fx, 12);
const hands = [
  mk("ellipse", { rx: 30, ry: 22, fill: "#f2e6cc", stroke: "#d9c9a8", "stroke-width": 3 }, W.fx),
  mk("ellipse", { rx: 30, ry: 22, fill: "#f2e6cc", stroke: "#d9c9a8", "stroke-width": 3 }, W.fx),
];
const bulbStar = mk("use", { href: "#star5", fill: "#fff3c4", opacity: 0 }, W.fx);
const checkOrder = [0, 1, 2, 3, 4];
const sx = (t) => LX,
  eyeY = LY - CH * 133;
function draw(t) {
  W.update(t);
  const id = LK.idle(t, T);
  // Lumo
  const cover = win(t, 0.5, 3.3, 0.25);
  const bulbPos = [LX, LY - CH * 298];
  let target = [540, 520],
    hopL = 0,
    joy = 0;
  for (let i = 0; i < 5; i++) {
    const a = tf[i] - 0.9,
      b = tf[i] + 0.9;
    if (t >= a && t < b) {
      target = i === 4 ? bulbPos : CL[i];
      joy = i === 4 ? 0 : bump(t, tf[i] - 0.1, tf[i] + 0.8);
      hopL = 30 * bump(t, a, tf[i]);
    }
  }
  const searching = t >= 3.4 && t < 10.8;
  const lx = searching ? clamp((target[0] - LX) / 40, -7, 7) : id.lx,
    ly = searching ? clamp((target[1] - eyeY) / 90, -8, 8) : id.ly;
  const lastSurprise = win(t, 9.3, 10.3, 0.1);
  const aL = null,
    aR = null;
  const counting = cover > 0 ? 8 * Math.abs(Math.sin(TAU * 2 * t)) * cover : 0;
  const blink = LK.blinkAt(t, [11.3]);
  const crossEye = lastSurprise;
  lumo.set({
    x: LX,
    lift: counting + hopL,
    aL,
    aR,
    sx: id.sx,
    sy: id.sy,
    lx: lerp(lx, 0, crossEye),
    ly: lerp(ly, -9, crossEye),
    open: cover > 0.5 ? 0.1 : blink,
    happy: clamp(joy * 1.4, 0, 1),
    ew: 1 + 0.2 * lastSurprise,
    eh: 1 + 0.3 * lastSurprise,
    mouth: lastSurprise,
    glow: id.glow + 0.8 * bump(t, 9.3, 10.4),
    glowR: 100 + 70 * bump(t, 9.3, 10.4),
  });
  hands.forEach((h, i) => {
    h.setAttribute("cx", f2(LX + (i ? 1 : -1) * 31 * CH));
    h.setAttribute("cy", f2(LY - CH * (130 + counting + hopL) + 4 * Math.sin(TAU * 2 * t)));
    h.setAttribute("opacity", f2(cover));
  });
  // clouds + stars
  CL.forEach((c, i) => {
    let x = c[0] + 14 * Math.sin((TAU * 2 * t) / T + i),
      y = c[1] + 8 * Math.sin((TAU * 3 * t) / T + i * 2);
    const aside = sine(seg(t, tf[i] - 0.45, tf[i] - 0.05)) * (1 - sine(seg(t, 10.9, 11.7)));
    const sh = i === 4 ? sine(seg(t, 8.6, 9.0)) * (1 - sine(seg(t, 10.9, 11.7))) : aside;
    x += sh * 230;
    const op = 1 - 0.85 * sh;
    clouds[i].setAttribute("transform", `translate(${f2(x)} ${f2(y)}) scale(0.9)`);
    clouds[i].setAttribute("opacity", f2(op));
    // star
    const hide = sine(seg(t, th[i], th[i] + 0.5)),
      found = sine(seg(t, tf[i], tf[i] + 0.55));
    const p0 = SH[i],
      p1 = [CL[i][0], CL[i][1]];
    let sxp,
      syp,
      sc = 1,
      so = 1,
      rot = 0;
    if (i < 4 || t < 9.6) {
      if (t < tf[i]) {
        sxp = lerp(p0[0], p1[0], hide);
        syp = lerp(p0[1], p1[1], hide);
        sc = lerp(1, 0.6, hide);
        if (hide > 0.9 && t > th[i] + 0.5) {
          so = 0;
        }
      } else {
        sxp = lerp(p1[0], p0[0], found);
        syp = lerp(p1[1], p0[1], found) - 100 * Math.sin(Math.PI * found);
        sc = lerp(0.6, 1, found);
        rot = 360 * found;
      }
    }
    if (i === 4) {
      if (t < 8.9) {
        sxp = lerp(p0[0], p1[0], hide);
        syp = lerp(p0[1], p1[1], hide);
        sc = lerp(1, 0.6, hide);
        so = t > th[4] + 0.55 ? 0 : 1;
      } else if (t < 9.9) {
        sxp = bulbPos[0];
        syp = bulbPos[1] - 10;
        sc = 0.2;
        so = 0;
      } else {
        const f = sine(seg(t, 9.9, 10.9));
        sxp = lerp(bulbPos[0], p0[0], f);
        syp = lerp(bulbPos[1], p0[1], f) - 120 * Math.sin(Math.PI * f);
        sc = lerp(0.3, 1, f);
        rot = 360 * f;
        so = 1;
      }
    }
    stars[i].setAttribute(
      "transform",
      `translate(${f2(sxp)} ${f2(syp)}) rotate(${f2(rot)}) scale(${f2(sc * (1.2 + 0.06 * Math.sin((TAU * 3 * t) / T + i)))})`,
    );
    stars[i].setAttribute("opacity", f2(so));
  });
  // star inside Lumo's bulb (peeks 8.9-9.9)
  const peek = sine(seg(t, 8.9, 9.3)) * (1 - sine(seg(t, 9.6, 9.95)));
  bulbStar.setAttribute("opacity", f2(peek));
  bulbStar.setAttribute(
    "transform",
    `translate(${f2(bulbPos[0])} ${f2(bulbPos[1] - CH * 4 - 16 * peek)}) scale(${f2(0.55 + 0.1 * Math.sin(TAU * 4 * t))})`,
  );
  for (let i = 0; i < 4; i++) {}
  [0, 1, 2, 3].forEach((i) => sp.draw(t, tf[i] + 0.4, 0.8, CL[i][0], CL[i][1], 120, 40));
  sp2.draw(t, 9.9, 0.9, bulbPos[0], bulbPos[1], 160, 60);
}
LK.run(T, draw);
