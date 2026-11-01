/* eslint-disable no-unused-vars */
const T = 12;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU, bez } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T, { tree: false });
const OX = 860,
  DESKX0 = 640,
  GROUND = gy(OX);
const deskTop = GROUND - 170;
// owl librarian behind the desk
const owl = mk("g", {}, W.mid);
owl.innerHTML = `<g transform="translate(${OX} ${GROUND - 40})"><ellipse cx="0" cy="-130" rx="132" ry="160" fill="#8a7560"/><ellipse cx="0" cy="-100" rx="86" ry="112" fill="#e3d4b0"/><path d="M-96 -250 L-78 -310 L-40 -262Z M96 -250 L78 -310 L40 -262Z" fill="#8a7560"/>
<g class="eyes"><circle cx="-54" cy="-218" r="48" fill="#fff"/><circle cx="54" cy="-218" r="48" fill="#fff"/><circle class="pl" cx="-54" cy="-218" r="19" fill="#2b223b"/><circle class="pr" cx="54" cy="-218" r="19" fill="#2b223b"/>
<circle cx="-54" cy="-218" r="56" fill="none" stroke="#3a3354" stroke-width="8"/><circle cx="54" cy="-218" r="56" fill="none" stroke="#3a3354" stroke-width="8"/><path d="M-2 -222 L2 -222" stroke="#3a3354" stroke-width="8"/></g>
<g class="closed" opacity="0" stroke="#3a3354" stroke-width="9" fill="none" stroke-linecap="round"><path d="M-84 -214 Q-54 -190 -24 -214"/><path d="M24 -214 Q54 -190 84 -214"/></g>
<path d="M-14 -176 L14 -176 L0 -146Z" fill="#ff9a3c"/><path d="M-100 -120 Q-150 -60 -90 -20 Z" fill="#76624e"/><path d="M100 -120 Q150 -60 90 -20 Z" fill="#76624e"/></g>`;
const oEyes = owl.querySelector(".eyes"),
  oClosed = owl.querySelector(".closed"),
  opl = owl.querySelector(".pl"),
  opr = owl.querySelector(".pr");
const desk = mk("g", {}, W.fx);
desk.innerHTML = `<rect x="${DESKX0}" y="${deskTop}" width="440" height="${GROUND - deskTop + 30}" rx="10" fill="#7a5a3e"/><rect x="${DESKX0 - 14}" y="${deskTop - 16}" width="468" height="30" rx="10" fill="#9b7650"/><rect x="${DESKX0 + 30}" y="${deskTop + 40}" width="170" height="110" rx="8" fill="#6b4d34"/><circle cx="${DESKX0 + 115}" cy="${deskTop + 95}" r="9" fill="#d9b86c"/><rect x="${DESKX0 + 240}" y="${deskTop + 40}" width="170" height="110" rx="8" fill="#6b4d34"/><circle cx="${DESKX0 + 325}" cy="${deskTop + 95}" r="9" fill="#d9b86c"/>`;
// receipt strip along the ground
const strip = mk(
  "path",
  { fill: "none", stroke: "#f4f1e8", "stroke-width": 26, "stroke-linecap": "butt" },
  W.mid,
);
const stripLines = mk(
  "path",
  { fill: "none", stroke: "#cfc9b8", "stroke-width": 4, "stroke-dasharray": "14 22" },
  W.mid,
);
const book = mk("g", {}, W.fx);
book.innerHTML = `<g class="bk"><rect x="-76" y="-52" width="152" height="104" rx="9" fill="#3f7a5a"/><rect x="-76" y="-52" width="22" height="104" fill="#2e5e44"/><rect x="-40" y="-24" width="96" height="14" rx="3" fill="#d9b86c"/><rect x="-40" y="2" width="70" height="10" rx="3" fill="#d9b86c" opacity=".7"/><path d="M-76 -52 L-30 -20 L-76 -6 M76 52 L40 20 L76 6" stroke="#fff" stroke-opacity=".6" stroke-width="3" fill="none"/></g>`;
const dust = [];
for (let i = 0; i < 14; i++) dust.push(mk("circle", { r: 5, fill: "#e6dcc3", opacity: 0 }, W.fx));
const sheets = [];
for (let i = 0; i < 18; i++)
  sheets.push(
    mk("rect", { x: -14, y: -18, width: 28, height: 36, rx: 3, fill: "#f4f1e8", opacity: 0 }, W.fx),
  );
const stamp = mk("g", {}, W.fx);
stamp.innerHTML = `<rect x="-26" y="-64" width="52" height="40" rx="8" fill="#a8483a"/><rect x="-10" y="-26" width="20" height="34" fill="#7a5a3e"/><rect x="-34" y="6" width="68" height="14" rx="5" fill="#a8483a"/>`;
const ok = mk("g", {}, W.fx);
ok.innerHTML = `<circle r="54" fill="#2fd07a"/><path d="M-26 2 l16 18 l36 -40" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const sweat = mk(
  "path",
  { d: "M0 -14 C9 0 14 7 0 14 C-14 7 -9 0 0 -14Z", fill: "#9fd0ff", opacity: 0 },
  W.fx,
);
const lumo = LK.lumo(W.chars),
  sp = LK.sparks(W.fx, 12);
const rndD = LK.prng(11);
const LXf = (t) =>
  lerp(280, 430, sine(seg(t, 1.0, 2.0))) +
  lerp(0, -50, bump(t, 6.4, 7.6)) * 1 -
  lerp(0, 150, sine(seg(t, 10.4, 11.5)));
const deskBook = [OX - 20, deskTop - 44];
function draw(t) {
  W.update(t);
  const id = LK.idle(t, T);
  const LX = LXf(t),
    LY = gy(LX);
  // book travel: in Lumo's arms -> desk -> (owl opens, sheets fly) -> back to Lumo
  const hold0 = [LX + 20, LY - CH * 70],
    hold1 = [LX + 20, LY - CH * 70];
  let bx,
    by,
    br = 0,
    bs = 1;
  if (t < 2.4) {
    [bx, by] = hold0;
    by -= 5 * Math.abs(Math.sin(TAU * 2 * t)) * win(t, 1.0, 2.0, 0.1);
  } else if (t < 3.1) {
    const u = sine(seg(t, 2.4, 3.1));
    [bx, by] = bez(
      hold0,
      [hold0[0] + 80, hold0[1] - 200],
      [deskBook[0] - 150, deskBook[1] - 140],
      deskBook,
      u,
    );
    br = 20 * u;
  } else if (t < 9.2) {
    bx = deskBook[0];
    by = deskBook[1];
    bs = 1 + 0.12 * bump(t, 3.1, 3.4);
    br = 0;
  } else if (t < 10.3) {
    const u = sine(seg(t, 9.2, 10.3));
    const h = [LX + 20, LY - CH * 70];
    [bx, by] = bez(
      deskBook,
      [deskBook[0] - 120, deskBook[1] - 220],
      [h[0] + 100, h[1] - 140],
      h,
      u,
    );
    br = lerp(20, 0, u);
  } else {
    bx = LX + 20;
    by = LY - CH * 70;
  }
  book.setAttribute(
    "transform",
    `translate(${f2(bx)} ${f2(by)}) rotate(${f2(br)}) scale(${f2(bs * CH * 0.8)})`,
  );
  // owl: wakes at 3.1, sleeps again ~11.2
  const wake = sine(seg(t, 3.0, 3.3)) * (1 - sine(seg(t, 11.0, 11.5)));
  oEyes.setAttribute("opacity", f2(wake > 0.5 ? 1 : 0));
  oClosed.setAttribute("opacity", f2(wake > 0.5 ? 0 : 1));
  const shake = bump(t, 3.0, 3.5) * 6 * Math.sin(t * 60);
  owl.setAttribute("transform", `translate(${f2(shake)} 0)`);
  const tx = clamp((LX - OX) / 30, -12, -3);
  opl.setAttribute("transform", `translate(${f2(tx)} 0)`);
  opr.setAttribute("transform", `translate(${f2(tx)} 0)`);
  // dust puff
  dust.forEach((d, i) => {
    const q = seg(t, 3.1 + i * 0.03, 4.4);
    if (q <= 0 || q >= 1) return d.setAttribute("opacity", 0);
    const a = (i / 14) * TAU;
    d.setAttribute("cx", f2(deskBook[0] + Math.cos(a) * 130 * q));
    d.setAttribute("cy", f2(deskBook[1] - 20 + Math.sin(a) * 80 * q - 50 * q));
    d.setAttribute("r", f2(8 + 16 * q));
    d.setAttribute("opacity", f2(0.5 * (1 - q)));
  });
  // sheets fly away (40,000 years of calendar pages)
  sheets.forEach((s, i) => {
    const t0 = 3.4 + i * 0.12,
      q = seg(t, t0, t0 + 1.8);
    if (q <= 0 || q >= 1) return s.setAttribute("opacity", 0);
    const x = lerp(deskBook[0], -100, q) + 60 * Math.sin(q * 7 + i),
      y = lerp(deskBook[1], 300 + (i % 5) * 120, q) - 260 * Math.sin(Math.PI * q) * 0.6;
    s.setAttribute("transform", `translate(${f2(x)} ${f2(y)}) rotate(${f2(q * 540 + i * 30)})`);
    s.setAttribute("opacity", f2(1 - 0.5 * q));
  });
  // receipt strip from the desk to Lumo
  const L = sine(seg(t, 5.2, 7.4)) * (1 - sine(seg(t, 10.9, 11.7)));
  const pts = [];
  const total = 1400 * L;
  const start = [DESKX0 + 70, deskTop - 6];
  for (let s = 0; s <= total; s += 28) {
    let x, y;
    if (s < 120) {
      x = start[0] - s * 0.1;
      y = start[1] + s;
      if (y > GROUND + 18) y = GROUND + 18;
    } else {
      x = start[0] - 12 - (s - 120) * 0.95;
      y = GROUND + 22 + 10 * Math.sin((s - 120) * 0.02);
    }
    pts.push([x, y]);
  }
  const d = pts.length > 1 ? "M" + pts.map((p) => f2(p[0]) + " " + f2(p[1])).join(" L") : "M0 0";
  strip.setAttribute("d", d);
  stripLines.setAttribute("d", d);
  strip.setAttribute("opacity", L > 0.01 ? 1 : 0);
  stripLines.setAttribute("opacity", L > 0.01 ? 1 : 0);
  // stamp + check
  const sq = seg(t, 8.0, 8.6),
    down = sq < 0.5 ? sine(sq * 2) : 1 - sine((sq - 0.5) * 2);
  stamp.setAttribute(
    "transform",
    `translate(${f2(OX - 40)} ${f2(deskTop - 150 + 120 * down)}) scale(1.3)`,
  );
  stamp.setAttribute("opacity", f2(sq > 0 && sq < 1 ? 1 : 0));
  const okq = outBack(seg(t, 8.5, 9.1)) * (1 - sine(seg(t, 9.8, 10.4)));
  ok.setAttribute("transform", `translate(${f2(OX - 40)} ${f2(deskTop - 250)}) scale(${f2(okq)})`);
  ok.setAttribute("opacity", okq > 0.01 ? 1 : 0);
  // Lumo
  const shock = win(t, 5.4, 8.0, 0.2),
    hopB = 34 * bump(t, 6.6, 7.2);
  const carry = t < 2.4 || t > 10.3;
  const aL = carry || (t >= 2.4 && t < 3.0) ? { x: -86, y: -66, o: 1 } : null,
    aR = carry || (t >= 2.4 && t < 3.0) ? { x: 86, y: -66, o: 1 } : null;
  const happy = win(t, 9.6, 11.2, 0.25);
  const blink = LK.blinkAt(t, [0.5, 4.9, 11.4]);
  const sw = seg(t, 6.0, 7.2);
  sweat.setAttribute("opacity", f2(sw > 0 && sw < 1 ? 0.9 * Math.sin(Math.PI * sw) : 0));
  sweat.setAttribute(
    "transform",
    `translate(${f2(LX + 120 + 30 * sw)} ${f2(LY - CH * (270 - 60 * sw))}) scale(1.3)`,
  );
  lumo.set({
    x: LX,
    lift: hopB,
    aL,
    aR,
    sx: id.sx * (1 + 0.06 * shock),
    sy: id.sy * (1 - 0.06 * shock),
    lx: clamp((OX - LX) / 50, -7, 7),
    ly: shock > 0.2 ? 6 : id.ly,
    open: blink,
    happy,
    ew: 1 + 0.2 * shock,
    eh: 1 + 0.4 * shock,
    mouth: shock * (1 - happy),
    glow: id.glow - 0.3 * shock + 0.6 * happy,
  });
  sp.draw(t, 8.5, 0.9, OX - 40, deskTop - 250, 180, 60);
}
LK.run(T, draw);
