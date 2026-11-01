/* eslint-disable no-unused-vars */
const T = 12;
DEG = Math.PI / 180;
const { f2, clamp, lerp, seg, sine, outCubic, outBack, bump, win, mk, gy, CH, TAU } = LK;
const svg = document.getElementById("stage");
const W = LK.world(svg, T);
const rnd = LK.prng(1010);

// ---- Sun (behind the planet layer) ----
const SUN = { x: 700, y: 800, r: 150 },
  N = 16,
  L0 = 190,
  L1 = 46;
const sunG = mk("g", {}, W.back);
sunG.innerHTML = `<defs><radialGradient id="sunD" cx=".4" cy=".35"><stop offset="0" stop-color="#ffe9a0"/><stop offset=".6" stop-color="#ffc94a"/><stop offset="1" stop-color="#f6a82a"/></radialGradient></defs>
<circle cx="${SUN.x}" cy="${SUN.y}" r="380" fill="url(#warm)" opacity=".5"/>`;
const rays = [];
for (let j = 0; j < N; j++)
  rays.push({
    o: mk(
      "path",
      { fill: "none", stroke: "#ffb52c", "stroke-width": 26, "stroke-linecap": "round" },
      sunG,
    ),
    i: mk(
      "path",
      { fill: "none", stroke: "#ffd873", "stroke-width": 9, "stroke-linecap": "round" },
      sunG,
    ),
  });
const face = mk("g", {}, sunG);
face.innerHTML = `<circle cx="${SUN.x}" cy="${SUN.y}" r="${SUN.r}" fill="url(#sunD)"/>
<g class="fc" transform="translate(${SUN.x} ${SUN.y})"><ellipse cx="-78" cy="30" rx="22" ry="12" fill="#ff8f5a" opacity=".55"/><ellipse cx="78" cy="30" rx="22" ry="12" fill="#ff8f5a" opacity=".55"/>
<g class="closed" stroke="#7a4a1c" stroke-width="8" fill="none" stroke-linecap="round"><path d="M-62 -6 Q-45 -24 -28 -6"/><path d="M28 -6 Q45 -24 62 -6"/></g>
<g class="open" opacity="0"><circle cx="-45" cy="-8" r="14" fill="#5a3512"/><circle cx="45" cy="-8" r="14" fill="#5a3512"/></g>
<path class="sm" d="M-22 36 Q0 56 22 36" stroke="#7a4a1c" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
const fc = face.querySelector(".fc"),
  fClosed = face.querySelector(".closed"),
  fOpen = face.querySelector(".open");

// ---- choreography constants ----
const CUT = { x: 527, y: 973 },
  LX = CUT.x - 116 * CH,
  LY = gy(LX);
const need = (LY - CUT.y) / CH - 190; // lift (local units) that puts the hand on the cut point
const t0 = 2.0,
  dt = 0.375,
  NS = 16;
const stepE = (f) => sine(clamp((f - 0.55) / 0.45, 0, 1));
const rotAt = (t) => {
  if (t < t0) return 0;
  if (t >= t0 + NS * dt) return 360;
  const k = (t - t0) / dt,
    n = Math.floor(k);
  return 22.5 * (n + stepE(k - n));
};
const cutTime = (n) => t0 + dt * (n + 0.3);
const orderOf = (j) => (((6 - j) % 16) + 16) % 16; // snip index that trims ray j
const lenOf = (j, t) => {
  const n = orderOf(j),
    tc = cutTime(n);
  let L = L0;
  if (t > tc) L = lerp(L0, L1, outCubic(seg(t, tc, tc + 0.12)));
  const tg = 8.4 + 0.11 * n;
  if (t > tg)
    L = lerp(
      L1,
      L0,
      outBack(seg(t, tg, tg + 1.2)) > 1
        ? 1 + (outBack(seg(t, tg, tg + 1.2)) - 1) * 0.6
        : outBack(seg(t, tg, tg + 1.2)),
    );
  return L;
};

// ---- falling hair → stars ----
const pieces = [];
for (let n = 0; n < NS; n++)
  pieces.push({
    g: mk("g", {}, W.fx),
    vx: lerp(-60, 40, rnd()),
    sx: lerp(160, 960, rnd()),
    sy: lerp(180, 620, rnd()),
    rot: lerp(-90, 90, rnd()),
  });
pieces.forEach((p) => {
  p.g.innerHTML = `<path class="st" d="M0 -48 Q14 0 0 48" fill="none" stroke="#ffb52c" stroke-width="22" stroke-linecap="round"/><use class="sr" href="#star5" fill="#ffd45e" stroke="#fff3c4" stroke-width="3" opacity="0"/>`;
});

// ---- scissors ----
const sc = mk("g", {}, W.fx);
sc.innerHTML = `<g class="a"><line x1="0" y1="0" x2="125" y2="0" stroke="#e3e7f5" stroke-width="11" stroke-linecap="round"/><circle cx="-36" cy="-17" r="17" fill="none" stroke="#ff6f6f" stroke-width="9"/></g>
<g class="b"><line x1="0" y1="0" x2="125" y2="0" stroke="#c8cde0" stroke-width="11" stroke-linecap="round"/><circle cx="-36" cy="17" r="17" fill="none" stroke="#ff6f6f" stroke-width="9"/></g><circle r="7" fill="#9aa3c0"/>`;
const scA = sc.querySelector(".a"),
  scB = sc.querySelector(".b");

const lumo = LK.lumo(W.chars);
const sp = LK.sparks(W.fx, 12);

function draw(t) {
  W.update(t);
  const rot = rotAt(t);
  // rays
  for (let j = 0; j < N; j++) {
    const a = (j * 22.5 + rot) * DEG,
      L = lenOf(j, t);
    const sway = 10 * Math.sin((TAU * 3 * t) / T + j * 0.8);
    const c = Math.cos(a),
      s = Math.sin(a);
    const r0 = SUN.r * 0.9,
      r1 = SUN.r + L,
      rm = (r0 + r1) / 2;
    const bx = SUN.x + c * r0,
      by = SUN.y + s * r0,
      tx = SUN.x + c * r1,
      ty = SUN.y + s * r1;
    const mx = SUN.x + c * rm - s * sway,
      my = SUN.y + s * rm + c * sway;
    const d = `M${f2(bx)} ${f2(by)} Q${f2(mx)} ${f2(my)} ${f2(tx)} ${f2(ty)}`;
    rays[j].o.setAttribute("d", d);
    rays[j].i.setAttribute("d", d);
  }
  // sun face
  const k = (t - t0) / dt,
    inCut = t >= t0 && t < t0 + NS * dt;
  const pulse = inCut ? 1 + 0.03 * Math.sin(Math.PI * clamp(((k % 1) - 0.3) / 0.5, 0, 1)) : 1;
  const grow = win(t, 8.4, 10.6, 0.1);
  const surprised = clamp(grow * 1.4, 0, 1) * (t > 8.8 && t < 10.4 ? 1 : 0);
  fc.setAttribute(
    "transform",
    `translate(${SUN.x} ${SUN.y}) scale(${f2(pulse * (1 + 0.04 * grow))})`,
  );
  fClosed.setAttribute("opacity", f2(1 - surprised));
  fOpen.setAttribute("opacity", f2(surprised));
  // Lumo
  const id = LK.idle(t, T);
  const cutW = win(t, 1.9, 8.1, 0.15);
  let lift = 0,
    aR = null;
  const kk = ((t - t0) / dt) % 1;
  if (cutW > 0) lift = cutW * (need - 40 + 40 * Math.cos(TAU * (kk - 0.3)));
  const raise = sine(seg(t, 1.3, 1.9)) * (1 - sine(seg(t, 8.0, 8.5)));
  if (raise > 0.01) aR = { x: lerp(104, 116, raise), y: lerp(-112, -190, raise), o: raise };
  const happy = win(t, 8.4, 9.2, 0.15) + win(t, 10.9, 11.7, 0.1) * 0;
  const shock = win(t, 9.0, 10.3, 0.12);
  const shrug = win(t, 10.2, 11.2, 0.2);
  const crouch = bump(t, 1.85, 2.05) * 0.1;
  const blink = LK.blinkAt(t, [0.9, 5.2, 7.9, 11.2]);
  lumo.set({
    x: LX,
    lift,
    aR,
    sx: id.sx * (1 + crouch * 0.6),
    sy: id.sy * (1 - crouch) * (1 - 0.1 * shrug),
    lx: lerp(id.lx, 6, cutW),
    ly: lerp(id.ly, -3, cutW),
    open: blink,
    happy: clamp(happy, 0, 1) * (1 - shock),
    ew: 1 + 0.2 * shock,
    eh: 1 + 0.35 * shock,
    mouth: shock,
    glow: id.glow + 0.7 * bump(t, 1.5, 1.9) + 0.9 * bump(t, 9.0, 9.5),
    glowR: 100 + 60 * bump(t, 9.0, 9.5),
  });
  // scissors
  const have = sine(seg(t, 1.3, 1.9)) * (1 - sine(seg(t, 8.0, 8.4)));
  const hx = LX + 116 * CH,
    hy = LY - CH * (190 + lift);
  sc.setAttribute("transform", `translate(${f2(hx)} ${f2(hy)}) rotate(20) scale(${f2(have)})`);
  sc.setAttribute("opacity", have > 0.01 ? 1 : 0);
  let open = 22;
  if (t >= t0 && t < t0 + NS * dt) {
    const f = ((t - t0) / dt) % 1;
    open =
      f < 0.2 ? 22 : f < 0.3 ? 22 * (1 - (f - 0.2) / 0.1) : 22 * sine(clamp((f - 0.3) / 0.7, 0, 1));
  } else if (t >= 1.3 && t < t0) open = 22 + 5 * Math.sin(TAU * 3 * t);
  scA.setAttribute("transform", `rotate(${f2(-open)})`);
  scB.setAttribute("transform", `rotate(${f2(open)})`);
  // falling hair → stars
  pieces.forEach((p, n) => {
    const tc = cutTime(n),
      q = seg(t, tc, tc + 1.5);
    if (q <= 0 || q >= 1) return p.g.setAttribute("opacity", 0);
    const st = p.g.querySelector(".st"),
      sr = p.g.querySelector(".sr");
    p.g.setAttribute("opacity", 1);
    let x, y, r, sc2, sOp, tOp;
    if (q < 0.45) {
      const u = q / 0.45;
      x = CUT.x + p.vx * u;
      y = CUT.y + 520 * u * u;
      r = p.rot * u;
      sc2 = 1 - 0.3 * u;
      tOp = 1 - sine(clamp((u - 0.6) / 0.4, 0, 1));
      sOp = 1 - tOp;
    } else {
      const u = (q - 0.45) / 0.55,
        e = sine(u);
      const x1 = CUT.x + p.vx,
        y1 = CUT.y + 520;
      x = lerp(x1, p.sx, e);
      y = lerp(y1, p.sy, e);
      r = lerp(p.rot, 0, e);
      sc2 = 0.7 + 0.2 * Math.sin(TAU * 3 * u);
      tOp = 0;
      sOp = 1 - sine(clamp((u - 0.55) / 0.45, 0, 1));
    }
    p.g.setAttribute(
      "transform",
      `translate(${f2(x)} ${f2(y)}) rotate(${f2(r)}) scale(${f2(sc2)})`,
    );
    st.setAttribute("opacity", f2(tOp));
    sr.setAttribute("opacity", f2(sOp));
  });
  sp.draw(t, 8.0, 0.7, hx, hy, 140, 60);
}
LK.run(T, draw);
