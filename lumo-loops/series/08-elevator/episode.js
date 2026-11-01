/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T, { tree: false, lamp: false });
const CX0 = 540,
  CW = 460,
  CHH = 580;
const GROUND = gy(CX0);
const yTop = 470,
  yBot = GROUND - CHH / 2 + 6;
const cabY = (t) =>
  lerp(yBot, yTop, sine(seg(t, 1.9, 7.9))) +
  lerp(0, 0, 0) +
  (t > 9.7 ? 0 : 0) -
  0 +
  (yBot - yBot) +
  lerp(0, yBot - yTop, sine(seg(t, 9.9, 11.7))) * 0 +
  0;
const cabPos = (t) => {
  const up = sine(seg(t, 1.9, 7.9)),
    down = sine(seg(t, 9.6, 11.0));
  return lerp(yBot, yTop, up * (1 - down));
};
// shaft + planets passing
const shaft = mk("g", {}, W.mid);
shaft.innerHTML = `<rect x="${CX0 - CW / 2 - 26}" y="-40" width="14" height="1500" fill="#3a3f86"/><rect x="${CX0 + CW / 2 + 12}" y="-40" width="14" height="1500" fill="#3a3f86"/><line class="cable" x1="${CX0}" y1="-40" x2="${CX0}" y2="400" stroke="#9aa3c6" stroke-width="8"/>`;
const cable = shaft.querySelector(".cable");
const FL = [
  [170, 1050, "#ff8a5a"],
  [900, 840, "#5aa8ff"],
  [170, 630, "#ffd36b"],
  [900, 430, "#ff8fc0"],
  [170, 250, "#b9a6ff"],
];
FL.forEach(([x, y, c], i) => {
  const g = mk("g", { transform: `translate(${x} ${y})` }, shaft);
  g.innerHTML = `<circle r="${52 + (i % 2) * 14}" fill="${c}"/><ellipse rx="${86 + (i % 2) * 14}" ry="16" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="7" transform="rotate(-18)"/>`;
});
const cab = mk("g", {}, W.mid);
cab.innerHTML = `<rect x="${-CW / 2}" y="${-CHH / 2}" width="${CW}" height="${CHH}" rx="26" fill="#3a3f86"/><rect x="${-CW / 2 + 22}" y="${-CHH / 2 + 22}" width="${CW - 44}" height="${CHH - 44}" rx="14" fill="#1a1d52"/><rect x="${-CW / 2 + 22}" y="${CHH / 2 - 70}" width="${CW - 44}" height="48" rx="8" fill="#2b2f70"/>
<g class="lights" transform="translate(0 ${-CHH / 2 - 36})"></g>`;
const lights = cab.querySelector(".lights");
const bulbs = [0, 1, 2, 3, 4].map((i) =>
  mk("circle", { cx: (i - 2) * 50, cy: 0, r: 15, fill: "#ffd45e", opacity: 0.25 }, lights),
);
const frame = mk("g", {}, W.fx);
frame.innerHTML = `<g class="dl"><rect x="${-CW / 2 + 22}" y="${-CHH / 2 + 22}" width="${(CW - 44) / 2}" height="${CHH - 92}" fill="#9aa3c6" stroke="#6b739c" stroke-width="5"/><rect x="${-CW / 2 + 34}" y="${-CHH / 2 + 60}" width="${(CW - 44) / 2 - 24}" height="${CHH - 170}" rx="8" fill="none" stroke="#c9cfe6" stroke-width="4" opacity=".7"/></g><g class="dr"><rect x="0" y="${-CHH / 2 + 22}" width="${(CW - 44) / 2}" height="${CHH - 92}" fill="#aab2d0" stroke="#6b739c" stroke-width="5"/><rect x="12" y="${-CHH / 2 + 60}" width="${(CW - 44) / 2 - 24}" height="${CHH - 170}" rx="8" fill="none" stroke="#c9cfe6" stroke-width="4" opacity=".7"/></g>`;
const dl = frame.querySelector(".dl"),
  dr = frame.querySelector(".dr");
const moon = mk("g", {}, W.fx);
moon.innerHTML = `<circle r="260" fill="url(#warm)" opacity=".7"/><circle r="132" fill="#fff1c2"/><circle cx="-40" cy="-30" r="22" fill="#f1dfa0" opacity=".7"/><circle cx="50" cy="50" r="30" fill="#f1dfa0" opacity=".6"/><path d="M-62 -6 Q-42 -28 -22 -6 M22 -6 Q42 -28 62 -6" stroke="#7a5a2a" stroke-width="9" fill="none" stroke-linecap="round"/><ellipse cx="-84" cy="30" rx="22" ry="12" fill="#ffb3a0" opacity=".6"/><ellipse cx="84" cy="30" rx="22" ry="12" fill="#ffb3a0" opacity=".6"/><path d="M-26 40 Q0 66 26 40" stroke="#7a5a2a" stroke-width="8" fill="none" stroke-linecap="round"/>`;
const lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 12);
function draw(t) {
  W.update(t);
  const cy = cabPos(t);
  cab.setAttribute("transform", `translate(${CX0} ${f2(cy)})`);
  frame.setAttribute("transform", `translate(${CX0} ${f2(cy)})`);
  cable.setAttribute("y2", f2(cy - CHH / 2 - 40));
  const door =
    sine(seg(t, 0.1, 0.1)) * 0 + 1 - sine(seg(t, 0.8, 1.4)) * 1 + sine(seg(t, 0.8, 1.4)) * 0;
  const open =
    1 -
    sine(seg(t, 0.8, 1.4)) +
    sine(seg(t, 8.5, 9.1)) * (1 - sine(seg(t, 9.8, 10.3))) +
    sine(seg(t, 11.6, 11.99)) * 0;
  const o = clamp(
    1 -
      sine(seg(t, 0.8, 1.4)) +
      sine(seg(t, 8.5, 9.1)) -
      sine(seg(t, 9.7, 10.3)) +
      sine(seg(t, 11.1, 11.7)),
    0,
    1,
  );
  const wd = ((CW - 44) / 2) * (1 - 0.88 * o);
  dl.setAttribute(
    "transform",
    `translate(${f2((-(CW - 44) / 2) * 0 - ((CW - 44) / 2) * 0 - ((CW - 44) / 2 - wd))} 0)`,
  );
  dr.setAttribute("transform", `translate(${f2((CW - 44) / 2 - wd)} 0)`);
  // door panels are fixed width; slide them outwards
  const slide = ((CW - 44) / 2 - 12) * o;
  dl.setAttribute("transform", `translate(${f2(-slide)} 0)`);
  dr.setAttribute("transform", `translate(${f2(slide)} 0)`);
  bulbs.forEach((b, i) => {
    const lvl = clamp(((yBot - cy) / (yBot - yTop)) * 5.4, 0, 5);
    b.setAttribute("opacity", f2(0.25 + 0.75 * clamp(lvl - i, 0, 1)));
  });
  // moon peeks in at the top
  const mIn = sine(seg(t, 8.0, 8.8)) * (1 - sine(seg(t, 10.0, 10.8)));
  moon.setAttribute(
    "transform",
    `translate(${f2(lerp(1300, 880, mIn))} ${f2(yTop + 30 + 10 * Math.sin((TAU * 2 * t) / T))}) rotate(${f2(8 * Math.sin((TAU * 4 * t) / T) * mIn)}) scale(${f2(0.8 + 0.2 * mIn)})`,
  );
  moon.setAttribute("opacity", mIn > 0.01 ? 1 : 0);
  // Lumo rides inside
  const id = LK.idle(t, T);
  const wave = win(t, 8.6, 10.0, 0.2);
  const aR = wave > 0.01 ? { x: 116, y: -190 + 24 * Math.sin(TAU * 3 * t), o: wave } : null;
  const sway = Math.sin((TAU * 6 * t) / T) * 3 * win(t, 1.9, 7.9, 0.4);
  const watchUp = win(t, 1.4, 8.0, 0.3);
  const blink = LK.blinkAt(t, [0.8, 4.8, 11.2]);
  lumo.set({
    x: CX0 + sway,
    y: cy + CHH / 2 - 50,
    s: 0.9,
    aR,
    sx: id.sx,
    sy: id.sy,
    lx: lerp(id.lx, 0, watchUp) + 3 * wave,
    ly: lerp(id.ly, -8, watchUp),
    open: blink,
    happy: win(t, 8.6, 10.4, 0.2),
    glow: id.glow + 0.5 * bump(t, 8.0, 8.9),
    glowR: 100 + 40 * bump(t, 8.0, 8.9),
  });
  sp.draw(t, 8.2, 0.9, 880, yTop, 200, 70);
}
LK.run(T, draw);
