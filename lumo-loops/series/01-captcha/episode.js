/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T);

// ---------- captcha card ----------
const card = mk("g", {}, W.mid);
card.innerHTML = `<rect x="94" y="168" width="900" height="838" rx="44" fill="#000" opacity=".28"/>
<rect x="90" y="150" width="900" height="842" rx="44" fill="#f1f4fb"/>
<path d="M90 194 Q90 150 134 150 L946 150 Q990 150 990 194 L990 300 L90 300Z" fill="#3f86f5"/>
<use href="#star5" transform="translate(190 225) scale(2.4)" fill="#fff"/>
<g stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"><path d="M860 200 A34 34 0 1 1 826 236"/><path d="M826 236 l-4 -26 M826 236 l26 -6"/></g>
<rect class="glow" x="90" y="150" width="900" height="842" rx="44" fill="none" stroke="#4be08a" stroke-width="0"/>`;
const glowR = card.querySelector(".glow");
const gx = (c) => 126 + 135 + c * 276,
  gyc = (r) => 312 + 95 + r * 196;
const ICONS = {
  star: `<use href="#star5" fill="#ffd45e" stroke="#fff3c4" stroke-width="3" transform="scale(2.3)"/>`,
  moon: `<path d="M0 -56 A56 56 0 1 0 0 56 A74 74 0 0 1 0 -56Z" fill="#fff1c2" transform="translate(14 0) rotate(-20)"/>`,
  cloud: `<path d="M-62 28 C-92 28 -92 -12 -62 -12 C-62 -48 -14 -58 6 -28 C26 -58 78 -42 66 -8 C98 -8 98 28 68 28Z" fill="#eef3ff"/>`,
  planet: `<circle r="46" fill="#ff9d6b"/><ellipse rx="86" ry="18" fill="none" stroke="#ffd0a8" stroke-width="9" transform="rotate(-18)"/>`,
  comet: `<path d="M-90 40 Q-20 10 22 -22 L34 -6 Q-10 20 -90 40Z" fill="#9fd8ff" opacity=".8"/><circle cx="34" cy="-18" r="22" fill="#fff"/>`,
};
const KINDS = ["star", "moon", "cloud", "planet", "star", "star", "comet", "star", "cloud"];
const tiles = KINDS.map((k, i) => {
  const c = i % 3,
    r = Math.floor(i / 3);
  const g = mk("g", {}, card);
  g.innerHTML = `<g class="t"><rect x="-135" y="-95" width="270" height="190" rx="18" fill="${i % 2 ? "#232a67" : "#1c2158"}"/><circle cx="-100" cy="-60" r="3" fill="#fff" opacity=".7"/><circle cx="96" cy="-38" r="2.4" fill="#fff" opacity=".6"/><circle cx="60" cy="66" r="3" fill="#fff" opacity=".6"/>${ICONS[k]}
  <rect class="bd" x="-135" y="-95" width="270" height="190" rx="18" fill="#3f86f5" fill-opacity="0" stroke="#3f86f5" stroke-width="0"/>
  <g class="ck" opacity="0"><circle cx="-100" cy="-62" r="28" fill="#3f86f5"/><path d="M-114 -62 l10 11 l20 -22" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
  g.setAttribute("transform", `translate(${gx(c)} ${gyc(r)})`);
  return { g, t: g.querySelector(".t"), bd: g.querySelector(".bd"), ck: g.querySelector(".ck") };
});
// footer: robot / Lumo avatar + verify button
const foot = mk("g", {}, card);
foot.innerHTML = `<g transform="translate(205 943)"><rect x="-44" y="-40" width="88" height="80" rx="20" fill="#dfe6f5"/>
<g class="robot"><rect x="-26" y="-18" width="52" height="38" rx="9" fill="#8b97b8"/><circle cx="-10" cy="0" r="6" fill="#fff"/><circle cx="10" cy="0" r="6" fill="#fff"/><rect x="-2" y="-30" width="4" height="12" fill="#8b97b8"/><circle cy="-32" r="5" fill="#8b97b8"/></g>
<g class="av" opacity="0"><path d="M0 -26 C8 -16 28 -2 28 14 C28 30 14 36 0 36 C-14 36 -28 30 -28 14 C-28 -2 -8 -16 0 -26Z" fill="#f6e4c4"/><circle cx="-9" cy="10" r="5" fill="#2b223b"/><circle cx="9" cy="10" r="5" fill="#2b223b"/><circle cy="-32" r="7" fill="#f6ad3c"/></g></g>
<g class="vb" transform="translate(810 943)"><rect x="-120" y="-34" width="240" height="68" rx="20" fill="#3f86f5"/><path d="M-30 0 l18 18 l42 -40" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
<g class="spin" opacity="0"><circle r="22" fill="none" stroke="#fff" stroke-width="7" stroke-dasharray="40 100" stroke-linecap="round"/></g>
<g class="ok" opacity="0"><rect x="-120" y="-34" width="240" height="68" rx="20" fill="#2fd07a"/><path d="M-30 0 l18 18 l42 -40" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g></g>`;
const robot = foot.querySelector(".robot"),
  av = foot.querySelector(".av"),
  vb = foot.querySelector(".vb"),
  spin = foot.querySelector(".spin"),
  okB = foot.querySelector(".ok");
const vbIcon = vb.querySelector("path");

// cursor
const cur = mk("g", {}, W.top);
cur.setAttribute("transform", "translate(0 0)");
const curArrow = mk("g", {}, W.fx);
curArrow.innerHTML = `<circle class="rp" r="10" fill="none" stroke="#fff" stroke-width="5" opacity="0"/><path d="M0 0 L0 78 L20 60 L34 92 L52 84 L38 54 L66 54Z" fill="#fff" stroke="#2b223b" stroke-width="6" stroke-linejoin="round"/>`;
const rp = curArrow.querySelector(".rp");

const lumo = LK.lumo(W.chars);
const sp = LK.sparks(W.fx, 14);
const LX = 300,
  LY = gy(LX),
  HAND = [LX + 116 * CH, LY - CH * 190];
const VERIFY = [810, 943];
const KEYS = [
  [2.0, gx(1), gyc(0)],
  [2.7, gx(1), gyc(0)],
  [3.4, gx(0), gyc(0)],
  [4.2, gx(1), gyc(1)],
  [5.0, gx(2), gyc(1)],
  [5.8, gx(1), gyc(2)],
  [7.0, VERIFY[0], VERIFY[1]],
  [9.6, HAND[0], HAND[1]],
];
const CLICKS = [2.0, 2.7, 3.4, 4.2, 5.0, 5.8, 7.0];
const cursorAt = (t) => {
  let px = HAND[0],
    py = HAND[1];
  for (const [ta, x, y] of KEYS) {
    const p = sine(seg(t, ta - 0.55, ta));
    if (t < ta - 0.55) break;
    px = lerp(px, x, p);
    py = lerp(py, y, p);
    if (t < ta) break;
  }
  return [px, py];
};
const SELS = [
  [1, 2.0, 2.7],
  [0, 3.4, 99],
  [4, 4.2, 99],
  [5, 5.0, 99],
  [7, 5.8, 99],
];

function draw(t) {
  W.update(t);
  // card entrance/bounce
  const bounce = bump(t, 8.3, 9.0) * 0.02;
  card.setAttribute(
    "transform",
    `translate(540 570) scale(${f2(1 + bounce)}) translate(-540 -570)`,
  );
  glowR.setAttribute("stroke-width", f2(14 * win(t, 8.3, 10.6, 0.25)));
  const reset = 1 - sine(seg(t, 10.2, 11.4));
  tiles.forEach((tl, i) => {
    let sel = 0;
    for (const [idx, a, b] of SELS)
      if (idx === i) sel = sine(seg(t, a, a + 0.15)) * (1 - sine(seg(t, b, b + 0.15)));
    sel *= reset;
    tl.t.setAttribute("transform", `scale(${f2(1 - 0.1 * sel)})`);
    tl.bd.setAttribute("stroke-width", f2(10 * sel));
    tl.bd.setAttribute("fill-opacity", f2(0.18 * sel));
    tl.ck.setAttribute("opacity", f2(sel));
  });
  // verify button states
  const press = bump(t, 7.0, 7.2) * 0.06;
  const spinning = win(t, 7.15, 8.3, 0.1);
  const done = sine(seg(t, 8.3, 8.55)) * reset;
  vb.setAttribute(
    "transform",
    `translate(${VERIFY[0]} ${VERIFY[1]}) scale(${f2(1 - press + 0.08 * bump(t, 8.3, 8.9))})`,
  );
  vbIcon.setAttribute("opacity", f2(1 - spinning - done > 0 ? 1 - spinning - done : 0));
  spin.setAttribute("opacity", f2(spinning));
  spin.setAttribute("transform", `rotate(${f2(((t - 7.15) * 720) % 360)})`);
  okB.setAttribute("opacity", f2(done));
  robot.setAttribute("opacity", f2(1 - done));
  av.setAttribute("opacity", f2(done));
  // cursor
  const [cx, cy] = cursorAt(t);
  const vis = sine(seg(t, 1.1, 1.4)) * (1 - sine(seg(t, 9.6, 10.2)));
  curArrow.setAttribute("opacity", f2(vis));
  let pr = 0;
  for (const c of CLICKS) pr = Math.max(pr, bump(t, c, c + 0.4));
  curArrow.setAttribute(
    "transform",
    `translate(${f2(cx)} ${f2(cy)}) scale(${f2(1 - 0.08 * Math.sin(Math.PI * clamp(pr * 4, 0, 1)) * 0 - 0.06 * bump(t, 0, 0))})`,
  );
  let rr = 0,
    ro = 0;
  for (const c of CLICKS) {
    const q = seg(t, c, c + 0.4);
    if (q > 0 && q < 1) {
      rr = 10 + 60 * q;
      ro = 1 - q;
    }
  }
  rp.setAttribute("r", f2(rr));
  rp.setAttribute("opacity", f2(ro));
  // Lumo
  const id = LK.idle(t, T);
  const arm = sine(seg(t, 0.9, 1.3)) * (1 - sine(seg(t, 9.8, 10.4)));
  let tap = 0;
  for (const c of CLICKS) tap = Math.max(tap, bump(t, c, c + 0.18));
  const aR =
    arm > 0.01 ? { x: lerp(104, 116, arm), y: lerp(-112, -190, arm) + 14 * tap, o: arm } : null;
  const eyeY = LY - CH * 133;
  const lx = clamp((cx - LX) / 40, -7, 7) * vis + id.lx * (1 - vis),
    ly = clamp((cy - eyeY) / 90, -8, 8) * vis + id.ly * (1 - vis);
  const oops = win(t, 2.0, 2.9, 0.12),
    joy = win(t, 8.3, 10.3, 0.15);
  const hopJ = joy > 0 ? 34 * Math.abs(Math.sin(TAU * (t - 8.3) * 1.2)) : 0;
  const blink = LK.blinkAt(t, [0.9, 4.7, 6.6, 11.1]);
  lumo.set({
    x: LX,
    lift: hopJ,
    aR,
    sx: id.sx,
    sy: id.sy * (1 + 0.04 * tap),
    lx,
    ly,
    open: blink,
    happy: joy,
    ew: 1 + 0.18 * oops,
    eh: 1 + 0.3 * oops,
    mouth: oops * (1 - joy),
    glow: id.glow + 0.5 * tap + 0.6 * bump(t, 8.3, 8.9),
    glowR: 100 + 50 * bump(t, 8.3, 8.9),
  });
  sp.draw(t, 8.3, 0.9, VERIFY[0], VERIFY[1], 200, 90);
}
LK.run(T, draw);
