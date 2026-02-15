(() => {
  const nav = document.querySelector("#nav-main");
  const hamburger = nav?.querySelector(".hamburger");
  const expandedPanel = nav?.querySelector(".nav__expanded");

  function setNavState(isOpen) {
    if (!nav || !hamburger || !expandedPanel) {
      return;
    }

    nav.classList.toggle("nav--active", isOpen);
    document.body.classList.toggle("nav-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
    expandedPanel.setAttribute("aria-hidden", String(!isOpen));
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = !nav?.classList.contains("nav--active");
      setNavState(isOpen);
    });
  }

  nav?.querySelectorAll(".nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      setNavState(false);
    });
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setNavState(false);
    }
  });

  const footerYear = document.querySelector("#footer-year");
  if (footerYear) {
    footerYear.textContent = `© ${new Date().getFullYear()} A.T.J. All rights reserved.`;
  }

  // Mirror the source site behavior to avoid transition glitches during resize.
  const bodyClasses = document.body.classList;
  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    if (resizeTimer) {
      window.clearTimeout(resizeTimer);
      resizeTimer = 0;
    } else {
      bodyClasses.add("resizing");
    }

    resizeTimer = window.setTimeout(() => {
      bodyClasses.remove("resizing");
      resizeTimer = 0;
    }, 100);
  });

  const headingNodes = document.querySelectorAll(".clip-reveal");
  const fadeNodes = document.querySelectorAll(".fade-in-section");
  const countNodes = document.querySelectorAll(".countup");
  const monogramCard = document.querySelector("#monogram-card");
  const monogramPaths = document.querySelectorAll("#atj-monogram path");
  const typingLine = document.querySelector("#typing-line");
  const polishLine = document.querySelector("#polish-line");
  const polishButton = document.querySelector("#polish-button");
  const slider = document.querySelector(".before-after__input");
  const beforeAfter = document.querySelector("#before-after");
  const channelMixer = document.querySelector("#channel-mixer");
  const channelTabs = document.querySelectorAll(".channel-tab");
  const channelCopy = document.querySelector("#channel-copy");
  const skillNodes = document.querySelectorAll(".skill-node");
  const skillDetail = document.querySelector("#skill-detail");
  const roleChips = document.querySelectorAll(".role-chip-list li");

  const channelCopyMap = {
    journalistic: "Structuring narrative arcs, claims, and evidence for long-form communication.",
    social: "Designing high-frequency messaging for engagement, event uptake, and community response.",
    print: "Sharpening concise, high-impact wording for fixed-format collateral and campaign assets.",
  };

  const polishLines = [
    "Raw message -> clear message -> memorable message.",
    "Research -> insight -> campaign-ready narrative.",
    "Audience first. Message second. Channel third.",
    "Clarity, tone, evidence, then momentum.",
  ];
  let polishIdx = 0;

  if (slider && beforeAfter) {
    slider.addEventListener("input", () => {
      beforeAfter.style.setProperty("--split", `${slider.value}%`);
    });
  }

  channelTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      channelTabs.forEach((t) => t.classList.remove("is-active"));
      tab.classList.add("is-active");
      const key = tab.dataset.channel || "journalistic";
      if (channelCopy) {
        channelCopy.textContent = channelCopyMap[key] || channelCopyMap.journalistic;
      }
      if (!channelMixer) {
        return;
      }
      const bars = channelMixer.querySelectorAll(".channel-bars span");
      const sets = {
        journalistic: ["78%", "61%", "89%"],
        social: ["92%", "56%", "74%"],
        print: ["64%", "84%", "58%"],
      };
      const selected = sets[key] || sets.journalistic;
      bars.forEach((bar, idx) => {
        bar.style.setProperty("--bar", selected[idx]);
      });
    });
  });

  skillNodes.forEach((node) => {
    const updateSkillHighlight = () => {
      const roles = (node.dataset.roles || "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);

      if (skillDetail) {
        skillDetail.textContent = `${node.textContent} applied across ${roles.join(" and ")}.`;
      }

      roleChips.forEach((chip) => {
        const chipRole = chip.dataset.role || "";
        chip.classList.toggle("is-highlight", roles.includes(chipRole));
      });
    };

    node.addEventListener("mouseenter", updateSkillHighlight);
    node.addEventListener("focus", updateSkillHighlight);
  });

  if (polishButton && polishLine) {
    polishButton.addEventListener("click", () => {
      polishIdx = (polishIdx + 1) % polishLines.length;
      polishLine.textContent = polishLines[polishIdx];
    });
  }

  let hasTyped = false;
  function typeLine(node, text) {
    if (!node || hasTyped) {
      return;
    }
    hasTyped = true;
    node.textContent = "";
    let i = 0;
    const timer = window.setInterval(() => {
      node.textContent += text[i] || "";
      i += 1;
      if (i >= text.length) {
        window.clearInterval(timer);
      }
    }, 22);
  }

  function animateCount(node) {
    if (!node || node.dataset.counted === "true") {
      return;
    }
    node.dataset.counted = "true";
    const target = Number(node.dataset.target || 0);
    const start = performance.now();
    const duration = 1150;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      node.textContent = String(value);
      if (progress < 1) {
        window.requestAnimationFrame(tick);
      }
    }
    window.requestAnimationFrame(tick);
  }

  monogramPaths.forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    path.style.transition = "stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)";
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (entry.target.classList.contains("fade-in-section")) {
          entry.target.classList.add("is-visible");
        }
        if (entry.target.classList.contains("clip-reveal")) {
          entry.target.classList.add("is-revealed");
        }
        if (entry.target.classList.contains("countup")) {
          animateCount(entry.target);
        }
        if (entry.target.id === "typing-line") {
          typeLine(entry.target, entry.target.dataset.text || "");
        }
        if (entry.target.id === "monogram-card" && monogramCard) {
          monogramPaths.forEach((path) => {
            path.style.strokeDashoffset = "0";
          });
        }
      });
    },
    { threshold: 0.2 }
  );

  headingNodes.forEach((node) => revealObserver.observe(node));
  fadeNodes.forEach((node) => revealObserver.observe(node));
  countNodes.forEach((node) => revealObserver.observe(node));
  if (typingLine) revealObserver.observe(typingLine);
  if (monogramCard) revealObserver.observe(monogramCard);

  const asciiWomanCanvas = document.querySelector("#ascii-woman-canvas");
  if (asciiWomanCanvas instanceof HTMLCanvasElement) {
    const ctx = asciiWomanCanvas.getContext("2d");
    if (ctx) {
      const charset = "160/90";
      const stages = ["OXFORD", "RESEARCH", "CRICKET"];
      const stagePositions = [12, 32, 52];
      const cols = 68;
      const rows = 22;
      const tile = asciiWomanCanvas.closest(".interactive-tile");
      const state = {
        progress: 0,
        hover: false,
        cellW: 10,
        cellH: 10,
      };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      function put(map, x, y, kind, ch = "") {
        if (x < 0 || x >= cols || y < 0 || y >= rows) {
          return;
        }
        const key = `${x},${y}`;
        if (kind === "o") {
          map.set(key, { kind, ch });
          return;
        }
        if (!map.has(key)) {
          map.set(key, { kind, ch });
        }
      }

      function drawPattern(map, startX, startY, pattern) {
        pattern.forEach((line, row) => {
          [...line].forEach((ch, col) => {
            if (ch !== " " && ch !== "⠀") {
              put(map, startX + col, startY + row, "o", ch);
            }
          });
        });
      }

      function drawWoman(map, cx, baseY, action) {
        const head = [
          [-1, -12], [0, -12], [1, -12],
          [-2, -11], [-1, -11], [0, -11], [1, -11], [2, -11],
          [-2, -10], [-1, -10], [0, -10], [1, -10], [2, -10],
          [-1, -9], [0, -9], [1, -9],
        ];
        head.forEach(([dx, dy]) => put(map, cx + dx, baseY + dy, "w"));
        // Hair silhouette.
        [[-3, -12], [-3, -11], [-3, -10], [-2, -13], [-1, -13], [0, -13], [1, -13]].forEach(([dx, dy]) =>
          put(map, cx + dx, baseY + dy, "w")
        );

        for (let y = -8; y <= -3; y += 1) {
          put(map, cx, baseY + y, "w");
        }
        [[-1, -2], [0, -2], [1, -2]].forEach(([dx, dy]) => put(map, cx + dx, baseY + dy, "w"));

        for (let y = -1; y <= 3; y += 1) {
          put(map, cx - 1, baseY + y, "w");
          put(map, cx + 1, baseY + y, "w");
        }
        [[-2, 3], [2, 3]].forEach(([dx, dy]) => put(map, cx + dx, baseY + dy, "w"));

        if (action === 0) {
          // Reading/books pose.
          [[1, -6], [2, -6], [3, -6], [4, -6], [1, -5], [2, -5], [3, -5], [4, -5], [5, -5]].forEach(([dx, dy]) =>
            put(map, cx + dx, baseY + dy, "w")
          );
        } else if (action === 1) {
          // Research/writing pose.
          [[1, -6], [2, -6], [3, -6], [4, -6], [5, -6], [6, -6], [1, -5], [2, -5], [3, -5]].forEach(([dx, dy]) =>
            put(map, cx + dx, baseY + dy, "w")
          );
          [[-1, -6], [-2, -5], [-3, -4]].forEach(([dx, dy]) => put(map, cx + dx, baseY + dy, "w"));
        } else {
          // Cricket pose.
          [[1, -7], [2, -8], [3, -9], [4, -10], [4, -9], [2, -7], [3, -8]].forEach(([dx, dy]) =>
            put(map, cx + dx, baseY + dy, "w")
          );
        }
      }

      function drawBooks(map, cx, baseY) {
        const pattern = [
          " _______ ",
          "/      /,",
          "/      //",
          "/______//",
          "(______(/",
        ];
        drawPattern(map, cx + 3, baseY - 7, pattern);
      }

      function drawPen(map, cx, baseY) {
        const pattern = [
          "   .\".   ",
          "  /   \\  ",
          "  |  ||  ",
          "  |  ||  ",
          "  |  |/  ",
          "  |__|   ",
          "  |==|   ",
          "  |  |   ",
          "  |  |   ",
          "  \\__/   ",
          "   `     ",
        ];
        drawPattern(map, cx + 3, baseY - 10, pattern);
      }

      function drawCricket(map, cx, baseY) {
        const pattern = [
          "__.|█|",
          "__.|█|",
          "__.|█|",
          "__.|█|",
          "__.|█|",
          "_▄.|█|▄",
          "_█████",
          "_█████",
          "_█████",
          "_█████",
          "_█████",
          "_█████",
          "_█████",
          "_█████_",
          "_█████_",
          "_▀███▀_",
        ];
        drawPattern(map, cx + 3, baseY - 14, pattern);
        put(map, cx + 15, baseY - 8, "o", "o");
      }

      function easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
      }

      function resizeAsciiCanvas() {
        const rect = asciiWomanCanvas.getBoundingClientRect();
        asciiWomanCanvas.width = Math.floor(rect.width * dpr);
        asciiWomanCanvas.height = Math.floor(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        state.cellW = rect.width / cols;
        state.cellH = rect.height / rows;
      }

      function drawAsciiFrame(timeSeconds) {
        const rect = asciiWomanCanvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);
        ctx.fillStyle = "#0d0e13";
        ctx.fillRect(0, 0, rect.width, rect.height);

        const scene = new Map();
        const stage = Math.min(stages.length - 1, Math.floor(state.progress));
        const localProgress = state.progress - stage;
        let x = stagePositions[stage];

        if (stage < stages.length - 1) {
          const t = Math.min(localProgress / 0.92, 1);
          x = stagePositions[stage] + (stagePositions[stage + 1] - stagePositions[stage]) * easeOutCubic(t);
        }

        const baseY = 16;
        drawWoman(scene, Math.round(x), baseY, stage);
        if (stage === 0) drawBooks(scene, Math.round(x), baseY);
        if (stage === 1) drawPen(scene, Math.round(x), baseY);
        if (stage === 2) drawCricket(scene, Math.round(x), baseY);

        ctx.textBaseline = "top";
        ctx.textAlign = "left";
        ctx.font = `${Math.max(8, state.cellH * 0.9)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

        scene.forEach((value, key) => {
          const [gx, gy] = key.split(",").map(Number);
          const character =
            value.kind === "o"
              ? value.ch
              : charset[(gx * 3 + gy + Math.floor(timeSeconds * 10)) % charset.length];
          ctx.fillStyle = value.kind === "o" ? "#1400DC" : "#FFFFFF";
          ctx.fillText(character, gx * state.cellW, gy * state.cellH);
        });

        ctx.font = `${Math.max(9, state.cellH * 0.78)}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
        stages.forEach((label, idx) => {
          ctx.fillStyle = idx === stage ? "#8f84ff" : "#60616a";
          ctx.fillText(label, stagePositions[idx] * state.cellW - 2, (rows - 2) * state.cellH);
        });
      }

      function animateAsciiWoman(now) {
        const dt = Math.min(0.05, (now - (animateAsciiWoman.last || now)) / 1000);
        animateAsciiWoman.last = now;
        const speed = state.hover ? 0.42 : 0.16;
        state.progress += dt * speed;
        if (state.progress > stages.length + 0.2) {
          state.progress = 0;
        }
        drawAsciiFrame(now / 1000);
        window.requestAnimationFrame(animateAsciiWoman);
      }

      tile?.addEventListener("mouseenter", () => {
        state.hover = true;
      });
      tile?.addEventListener("mouseleave", () => {
        state.hover = false;
      });

      resizeAsciiCanvas();
      window.addEventListener("resize", resizeAsciiCanvas);
      window.requestAnimationFrame(animateAsciiWoman);
    }
  }

  const heroCanvas = document.querySelector("#ascii-hero-canvas");
  if (heroCanvas instanceof HTMLCanvasElement) {
    const ctx = heroCanvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const graySource = "160/90";
    const pinkSource = "ATJ";
    const particles = [];
    const mouse = { x: -9999, y: -9999 };

    function resizeCanvas() {
      const rect = heroCanvas.getBoundingClientRect();
      heroCanvas.width = Math.floor(rect.width * dpr);
      heroCanvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(220, Math.max(90, Math.floor((rect.width * rect.height) / 9500)));
      particles.length = 0;
      for (let i = 0; i < count; i += 1) {
        const isPink = Math.random() < 0.28;
        const source = isPink ? pinkSource : graySource;
        particles.push({
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
          ch: source[Math.floor(Math.random() * source.length)] || ".",
          size: 10 + Math.random() * 4,
          alpha: 0.18 + Math.random() * 0.35,
          color: isPink ? "#EA3365" : "#90919b",
        });
      }
    }

    function draw() {
      const rect = heroCanvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.fillStyle = "#090a0e";
      ctx.fillRect(0, 0, rect.width, rect.height);
      ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace";
      ctx.textBaseline = "middle";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -8 || p.x > rect.width + 8) p.vx *= -1;
        if (p.y < -8 || p.y > rect.height + 8) p.vy *= -1;

        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 120 * 120) {
          const force = (120 * 120 - distSq) / (120 * 120);
          p.x += (dx / 120) * force * 1.6;
          p.y += (dy / 120) * force * 1.6;
        }

        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
        ctx.fillText(p.ch, p.x, p.y);
      });

      ctx.globalAlpha = 1;
      window.requestAnimationFrame(draw);
    }

    heroCanvas.addEventListener("mousemove", (event) => {
      const rect = heroCanvas.getBoundingClientRect();
      mouse.x = event.clientX - rect.left;
      mouse.y = event.clientY - rect.top;
    });
    heroCanvas.addEventListener("mouseleave", () => {
      mouse.x = -9999;
      mouse.y = -9999;
    });

    resizeCanvas();
    draw();
    window.addEventListener("resize", resizeCanvas);
  }
})();
