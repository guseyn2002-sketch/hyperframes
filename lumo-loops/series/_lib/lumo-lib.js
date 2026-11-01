/* Lumo Loops shared kit: world, Lumo, Wisp, helpers. All animation = pure function of t. */
window.LK = (function () {
  const NS = "http://www.w3.org/2000/svg",
    TAU = Math.PI * 2;
  const f2 = (v) => (Math.round(v * 100) / 100).toString();
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, p) => a + (b - a) * p;
  const seg = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
  const sine = (p) => 0.5 - 0.5 * Math.cos(Math.PI * p);
  const outCubic = (p) => 1 - Math.pow(1 - p, 3);
  const inCubic = (p) => p * p * p;
  const outQuad = (p) => 1 - (1 - p) * (1 - p);
  const outBack = (p) => 1 + 2.6 * Math.pow(p - 1, 3) + 1.6 * Math.pow(p - 1, 2);
  const bump = (t, a, b) => Math.sin(Math.PI * seg(t, a, b));
  const win = (t, a, b, f) => clamp((t - a) / f, 0, 1) * clamp((b - t) / f, 0, 1);
  const bez = (p0, p1, p2, p3, u) => {
    const v = 1 - u;
    return [
      v * v * v * p0[0] + 3 * v * v * u * p1[0] + 3 * v * u * u * p2[0] + u * u * u * p3[0],
      v * v * v * p0[1] + 3 * v * v * u * p1[1] + 3 * v * u * u * p2[1] + u * u * u * p3[1],
    ];
  };
  const prng = (seed) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const mk = (tag, attrs, parent) => {
    const el = document.createElementNS(NS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(el);
    return el;
  };
  const html = (parent, str) => {
    const g = mk("g", {}, parent);
    g.innerHTML = str;
    return g;
  };

  const CX = 540,
    CY = 2900,
    R = 1500,
    CH = 1.335;
  const gy = (x) => CY - Math.sqrt(R * R - (x - CX) * (x - CX)) + 6;

  const DEFS = `
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#110f31"/><stop offset=".7" stop-color="#1a1847"/><stop offset="1" stop-color="#231e57"/></linearGradient>
  <linearGradient id="planet" gradientUnits="userSpaceOnUse" x1="0" y1="1400" x2="0" y2="1920"><stop offset="0" stop-color="#6a82b6"/><stop offset=".3" stop-color="#566c9c"/><stop offset="1" stop-color="#2e3866"/></linearGradient>
  <linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f8dcaa"/><stop offset=".3" stop-color="#f6e4c4"/><stop offset=".55" stop-color="#f2ead7"/><stop offset="1" stop-color="#e9dec6"/></linearGradient>
  <radialGradient id="warm"><stop offset="0" stop-color="#ffc25a" stop-opacity=".85"/><stop offset=".4" stop-color="#ffb347" stop-opacity=".3"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
  <radialGradient id="bulbG" cx=".38" cy=".33"><stop offset="0" stop-color="#ffdc8c"/><stop offset=".55" stop-color="#f6ad3c"/><stop offset="1" stop-color="#ea932a"/></radialGradient>
  <radialGradient id="cool"><stop offset="0" stop-color="#d8eeff" stop-opacity=".8"/><stop offset="1" stop-color="#7ab8ff" stop-opacity="0"/></radialGradient>
  <linearGradient id="tail" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#ecfbff"/><stop offset=".5" stop-color="#8fd8f0" stop-opacity=".75"/><stop offset="1" stop-color="#8fd8f0" stop-opacity="0"/></linearGradient>
  <filter id="blur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="46"/></filter>
  <path id="spark" d="M0 -10 Q1.5 -1.5 10 0 Q1.5 1.5 0 10 Q-1.5 1.5 -10 0 Q-1.5 -1.5 0 -10Z"/>
  <path id="star5" d="M0 -30 L8.5 -10 L29 -9.5 L13 4 L18.5 25 L0 13 L-18.5 25 L-13 4 L-29 -9.5 L-8.5 -10Z"/>`;

  /* world: returns layers + update(t). opts: {lamp, tree, sky:false} */
  function world(svg, T, opts) {
    opts = Object.assign({ lamp: true, tree: true }, opts || {});
    svg.setAttribute("viewBox", "0 0 1080 1920");
    const defs = mk("defs", {}, svg);
    defs.innerHTML = DEFS;
    const cam = mk("g", { id: "cam" }, svg);
    mk("rect", { x: -40, y: -40, width: 1160, height: 2000, fill: "url(#sky)" }, cam);
    mk(
      "ellipse",
      { cx: 250, cy: 600, rx: 360, ry: 230, fill: "#33297a", opacity: ".5", filter: "url(#blur)" },
      cam,
    );
    mk(
      "ellipse",
      { cx: 900, cy: 950, rx: 300, ry: 190, fill: "#2d2670", opacity: ".5", filter: "url(#blur)" },
      cam,
    );
    const starG = mk("g", {}, cam),
      r = prng(31102026),
      stars = [];
    for (let i = 0; i < 90; i++) {
      const x = r() * 1080,
        y = r() * 1420,
        big = r() < 0.08;
      const el = big
        ? mk(
            "use",
            {
              href: "#spark",
              fill: "#fff6d8",
              transform: `translate(${f2(x)} ${f2(y)}) scale(${f2(0.9 + r() * 0.9)})`,
            },
            starG,
          )
        : mk("circle", { cx: f2(x), cy: f2(y), r: f2(1.6 + r() * 3.4), fill: "#fff" }, starG);
      stars.push({ el, k: 1 + Math.floor(r() * 6), ph: r() * TAU, base: 0.4 + r() * 0.6 });
    }
    const L = { cam, sky: mk("g", {}, cam) };
    L.back = mk("g", {}, cam); // behind planet (sun, moon, big props)
    mk("circle", { cx: CX, cy: CY, r: R, fill: "url(#planet)" }, cam);
    mk(
      "path",
      {
        d: "M-960 2900 A1500 1500 0 0 1 2040 2900",
        fill: "none",
        stroke: "#93abdb",
        "stroke-opacity": ".55",
        "stroke-width": 6,
      },
      cam,
    );
    let lampGlow = null,
      treeSway = null,
      treeOpen = null,
      treeClosed = null;
    if (opts.lamp) {
      const g = mk("g", { transform: `translate(106 ${f2(gy(106) + 4)})` }, cam);
      g.innerHTML = `<circle id="lampGlow" cx="0" cy="-560" r="230" fill="url(#warm)"/><rect x="-14" y="-520" width="28" height="526" rx="10" fill="#3a3354"/><rect x="-44" y="-622" width="88" height="98" rx="16" fill="#f8d595"/><rect x="-56" y="-642" width="112" height="24" rx="10" fill="#393154"/>`;
      lampGlow = g.querySelector("#lampGlow");
    }
    L.mid = mk("g", {}, cam); // props behind characters
    if (opts.tree) {
      const g = mk("g", { transform: `translate(1013 ${f2(gy(1013) + 4)})` }, cam);
      g.innerHTML = `<g id="treeSway"><rect x="-20" y="-230" width="40" height="232" rx="10" fill="#453a5a"/><circle cx="-30" cy="-320" r="108" fill="#5e928b"/><circle cx="62" cy="-340" r="104" fill="#416a66"/><circle cx="-4" cy="-410" r="112" fill="#5e928b"/><circle cx="46" cy="-300" r="80" fill="#4d7f78"/><g id="treeClosed" stroke="#24433f" stroke-width="6" fill="none" stroke-linecap="round"><path d="M-52 -330 Q-36 -318 -20 -330"/><path d="M20 -330 Q36 -318 52 -330"/></g><g id="treeOpen" opacity="0"><ellipse cx="-36" cy="-330" rx="12" ry="16" fill="#f4faff"/><ellipse cx="36" cy="-330" rx="12" ry="16" fill="#f4faff"/><circle class="pl" cx="-36" cy="-330" r="7.5" fill="#24433f"/><circle class="pr" cx="36" cy="-330" r="7.5" fill="#24433f"/></g><ellipse cx="-68" cy="-300" rx="14" ry="8" fill="#ff9aa2" opacity=".35"/><ellipse cx="68" cy="-300" rx="14" ry="8" fill="#ff9aa2" opacity=".35"/></g>`;
      treeSway = g.querySelector("#treeSway");
      treeOpen = g.querySelector("#treeOpen");
      treeClosed = g.querySelector("#treeClosed");
    }
    L.chars = mk("g", {}, cam);
    L.fx = mk("g", {}, cam);
    L.top = mk("g", {}, svg);
    const tree = { wake: 0, look: 1 };
    L.tree = tree;
    L.update = (t) => {
      const w = (k, p) => Math.sin((TAU * k * t) / T + (p || 0));
      for (const s of stars)
        s.el.setAttribute("opacity", f2(s.base * (0.65 + 0.35 * w(s.k, s.ph))));
      if (lampGlow) lampGlow.setAttribute("opacity", f2(0.82 + 0.08 * w(10) + 0.05 * w(17, 1)));
      if (treeSway) {
        treeSway.setAttribute("transform", `rotate(${f2(1.0 * w(2))})`);
        const o = clamp(tree.wake * 2.4, 0, 1);
        treeOpen.setAttribute("opacity", f2(o));
        treeClosed.setAttribute("opacity", f2(1 - o));
        treeOpen
          .querySelector(".pl")
          .setAttribute("transform", `translate(${f2(5 * tree.look)} 1)`);
        treeOpen
          .querySelector(".pr")
          .setAttribute("transform", `translate(${f2(5 * tree.look)} 1)`);
      }
    };
    return L;
  }

  const LUMO_SVG = `<g class="inner">
    <g class="feet"><rect class="fl" x="-48" y="-32" width="32" height="32" rx="14" fill="#d6c8ac"/><rect class="fr" x="16" y="-32" width="32" height="32" rx="14" fill="#d6c8ac"/></g>
    <ellipse class="al" rx="15" ry="11" fill="#f2e6cc" opacity="0"/><ellipse class="ar" rx="15" ry="11" fill="#f2e6cc" opacity="0"/>
    <path d="M0 -272 C28 -236 100 -160 100 -87 C100 -50 80 -22 40 -22 L-40 -22 C-80 -22 -100 -50 -100 -87 C-100 -160 -28 -236 0 -272Z" fill="url(#body)"/>
    <ellipse cx="-58" cy="-104" rx="16" ry="8" fill="#e5c8b8" opacity=".9"/><ellipse cx="58" cy="-104" rx="16" ry="8" fill="#e5c8b8" opacity=".9"/>
    <ellipse class="el" rx="13.5" ry="13.5" fill="#2b223b"/><ellipse class="er" rx="13.5" ry="13.5" fill="#2b223b"/>
    <g class="hp" stroke="#2b223b" stroke-width="7" fill="none" stroke-linecap="round" opacity="0"><path d="M-44 -128 Q-29 -150 -14 -128"/><path d="M14 -128 Q29 -150 44 -128"/></g>
    <ellipse class="mo" cx="0" cy="-96" rx="7" ry="9" fill="#2b223b" opacity="0"/>
    <g class="bulb"><circle class="gl" cx="0" cy="-298" r="100" fill="url(#warm)"/><rect x="-6" y="-280" width="12" height="12" rx="3" fill="#a08c70"/><circle class="co" cx="0" cy="-298" r="24" fill="url(#bulbG)"/><circle cx="-8" cy="-307" r="6" fill="#fff3d0" opacity=".95"/></g></g>`;
  const DEF = {
    x: 430,
    s: 1,
    lift: 0,
    rot: 0,
    sx: 1,
    sy: 1,
    fl: 0,
    fr: 0,
    lx: 0,
    ly: 0,
    open: 1,
    ew: 1,
    eh: 1,
    happy: 0,
    mouth: 0,
    glow: 0.9,
    glowR: 100,
    bx: 0,
    by: 0,
    aL: null,
    aR: null,
    vis: 1,
  };
  function lumo(parent) {
    const root = mk("g", {}, parent);
    root.innerHTML = LUMO_SVG;
    const q = (c) => root.querySelector(c);
    const inner = q(".inner"),
      fl = q(".fl"),
      fr = q(".fr"),
      al = q(".al"),
      ar = q(".ar"),
      el = q(".el"),
      er = q(".er"),
      hp = q(".hp"),
      mo = q(".mo"),
      bulb = q(".bulb"),
      gl = q(".gl"),
      co = q(".co");
    return {
      root,
      set(p) {
        const o = Object.assign({}, DEF, p);
        const y = o.y === undefined ? gy(o.x) : o.y;
        root.setAttribute("opacity", o.vis);
        root.setAttribute("transform", `translate(${f2(o.x)} ${f2(y)}) scale(${f2(CH * o.s)})`);
        inner.setAttribute(
          "transform",
          `translate(0 ${f2(-o.lift)}) rotate(${f2(o.rot)}) scale(${f2(o.sx)} ${f2(o.sy)})`,
        );
        fl.setAttribute("transform", `translate(0 ${f2(-o.fl)})`);
        fr.setAttribute("transform", `translate(0 ${f2(-o.fr)})`);
        [
          [al, o.aL],
          [ar, o.aR],
        ].forEach(([e, a]) => {
          if (!a) return e.setAttribute("opacity", 0);
          e.setAttribute("cx", f2(a.x));
          e.setAttribute("cy", f2(a.y));
          e.setAttribute("opacity", f2(a.o === undefined ? 1 : a.o));
        });
        [
          [el, -29],
          [er, 29],
        ].forEach(([e, bx]) => {
          e.setAttribute(
            "transform",
            `translate(${f2(bx + o.lx)} ${f2(-133 + o.ly)}) scale(${f2(o.ew)} ${f2(Math.max(0.08, o.eh * o.open))})`,
          );
          e.setAttribute("opacity", f2(1 - o.happy));
        });
        hp.setAttribute("opacity", f2(o.happy));
        mo.setAttribute("opacity", f2(clamp(o.mouth, 0, 1) * (1 - o.happy)));
        mo.setAttribute("transform", `translate(${f2(o.lx * 0.5)} 0)`);
        bulb.setAttribute("transform", `translate(${f2(o.bx)} ${f2(o.by)})`);
        const g = clamp(o.glow, 0, 1);
        gl.setAttribute("opacity", f2(g));
        gl.setAttribute("r", f2(o.glowR));
        co.setAttribute(
          "transform",
          `translate(0 -298) scale(${f2(0.8 + 0.2 * clamp(o.glow, 0, 1.6))}) translate(0 298)`,
        );
        co.setAttribute("opacity", f2(0.55 + 0.45 * clamp(o.glow * 1.2, 0, 1)));
      },
    };
  }
  /* periodic idle values (integer cycles per T so the loop seams) */
  function idle(t, T) {
    const br = Math.sin((TAU * 4 * t) / T);
    return {
      sx: 1 - 0.007 * br,
      sy: 1 + 0.014 * br,
      lx: 1.6 * Math.sin((TAU * 2 * t) / T),
      ly: -3 + Math.sin((TAU * 3 * t) / T),
      glow: 0.88 + 0.08 * Math.sin((TAU * 6 * t) / T),
    };
  }
  const blinkAt = (t, list) => {
    let b = 0;
    for (const a of list) b = Math.max(b, bump(t, a, a + 0.16));
    return Math.max(0.0, 1 - b);
  };

  function wisp(parent) {
    const g = mk("g", {}, parent);
    g.innerHTML = `<path d="M-20 -22 C-90 -26 -170 -10 -250 28 C-170 6 -90 8 -20 22Z" fill="url(#tail)"/><use href="#spark" fill="#fff" transform="translate(-110 2) scale(.9)"/><use href="#spark" fill="#d6f3ff" transform="translate(-170 14) scale(.65)"/><circle r="44" fill="#bdeaff" opacity=".3"/><path d="M-14 -22 Q-26 -50 -4 -36Z M14 -26 Q28 -52 6 -38Z" fill="#eaf8ff" stroke="#eaf8ff" stroke-width="5" stroke-linejoin="round"/><circle r="28" fill="#fff"/><ellipse cx="-9" cy="-3" rx="4" ry="5" fill="#292340"/><ellipse cx="9" cy="-3" rx="4" ry="5" fill="#292340"/><circle cx="0" cy="7" r="3.5" fill="#fc9bb4"/>`;
    return {
      g,
      set(x, y, rot, s, vis) {
        g.setAttribute(
          "transform",
          `translate(${f2(x)} ${f2(y)}) rotate(${f2(rot || 0)}) scale(${f2(s || 1)})`,
        );
        g.setAttribute("opacity", vis === undefined ? 1 : vis);
      },
    };
  }
  /* pool of sparkles: sp.draw(t, t0, dur, cx, cy, spread, grav) */
  function sparks(parent, n) {
    const a = [];
    for (let i = 0; i < n; i++)
      a.push({
        el: mk("use", { href: "#spark", fill: i % 2 ? "#ffe9a8" : "#dff1ff", opacity: 0 }, parent),
        ang: -Math.PI * (0.05 + 0.9 * (i / Math.max(1, n - 1))),
        sp: 0.7 + (0.6 * ((i * 7) % 5)) / 4,
      });
    return {
      draw(t, t0, dur, cx, cy, spread, grav) {
        const p = seg(t, t0, t0 + dur);
        a.forEach((s) => {
          if (p <= 0 || p >= 1) return s.el.setAttribute("opacity", 0);
          const d = outQuad(p) * spread * s.sp;
          s.el.setAttribute(
            "transform",
            `translate(${f2(cx + Math.cos(s.ang) * d)} ${f2(cy + Math.sin(s.ang) * d + (grav || 0) * p * p)}) scale(${f2(1.4 - 0.9 * p)})`,
          );
          s.el.setAttribute("opacity", f2(1 - p));
        });
      },
    };
  }
  function run(T, draw) {
    const S = { t: 0 };
    const tl = gsap.timeline({ paused: true });
    tl.to(S, { t: T, duration: T, ease: "none", onUpdate: () => draw(S.t) }, 0);
    draw(0);
    window.__timelines["main"] = tl;
  }
  return {
    NS,
    TAU,
    f2,
    clamp,
    lerp,
    seg,
    sine,
    outCubic,
    inCubic,
    outQuad,
    outBack,
    bump,
    win,
    bez,
    prng,
    mk,
    html,
    gy,
    CX,
    CY,
    R,
    CH,
    world,
    lumo,
    idle,
    blinkAt,
    wisp,
    sparks,
    run,
  };
})();
