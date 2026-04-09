(function () {
  const I18N = {
    yue: {
      msg1:
        "你好！我係你嘅 HKSTP AI 助手。我可以幫你配對最合適嘅計劃、檢查資格、同埋全程指導你申請 — 一次傾計搞定。",
      msg2: "請講下你嘅初創公司 — 你哋係做些咩、使命係些咩、同埋依家現狀。或者試下以下選項：",
      placeholder: "用自然語言描述你嘅公司或問題…",
      reply: "收到！我會根據你嘅資料建議下一步，亦可帶你去合適嘅計劃頁面。",
      voiceLabel: "正在聽粵語…",
      voiceDraft: "我哋係… 我哋嘅使命係… 依家現狀係…",
    },
    zh: {
      msg1:
        "你好！我是你的 HKSTP AI 助手。我可以帮你匹配最合适的计划、检查资格，并全程指导你申请。",
      msg2: "请介绍一下你的初创公司 — 你们在做什么、使命是什么、以及现状。或试试以下选项：",
      placeholder: "用自然语言描述你的公司或问题…",
      reply: "收到！我会根据你的资料建议下一步，也可以带你进入合适的计划页面。",
      voiceLabel: "正在听普通话…",
      voiceDraft: "我们是… 我们的使命是… 目前进展是…",
    },
    en: {
      msg1:
        "Hi! I'm your HKSTP AI assistant. I can match the right programme, check eligibility, and guide your application end-to-end.",
      msg2:
        "Tell me about your startup — what you do, your mission, and where you are today. Or try one of the options below:",
      placeholder: "Describe your company or question in natural language…",
      reply: "Got it! I’ll suggest next steps based on your profile and can take you to the right programme.",
      voiceLabel: "Listening in English…",
      voiceDraft: "We are… Our mission is… Our status is…",
    },
  };

  const APPLY_HREF = "applied.html";

  const PROGRAMMES = [
    {
      id: "ideation",
      title: "创意启发计划",
      titleAccent: true,
      subtitle: "创业前期 | 零股权种子资金",
      desc: "通过系统化指导、种子资金、导师辅导及科技园生态圈支持，将创新意念孵化为可行事业。",
      metrics: [
        { label: "资金", value: "HKD 100K", accent: true },
        { label: "为期", value: "1 年", accent: true },
        { label: "申请窗口", value: "1 月 / 5 月 / 9 月", accent: true, wide: true },
      ],
      req: "持香港身份证、年满 18 岁、具备创新意念",
      cta: { label: "申请", variant: "orange" },
    },
    {
      id: "incubation",
      title: "培育计划",
      subtitle: "早期阶段 | 三年深度支援",
      desc: "从技术开发、市场探索到商业发展，协助你把首批方案推进至具商业化准备。",
      metrics: [
        { label: "资金", value: "HKD 1.29M" },
        { label: "为期", value: "3 年" },
        { label: "申请", value: "全年", wide: true },
      ],
      req: "香港注册公司、成立少于 5 年、具备原型／MVP",
      cta: { label: "申请", variant: "dark" },
    },
    {
      id: "codev",
      title: "共创发展计划",
      subtitle: "伙伴驱动 | 共创意念与培育",
      desc: "与龙头企业伙伴共创，提供上市支持及专属导师，设「共创意念」或「共创培育」路径。",
      metrics: [
        { label: "路径", value: "2 条" },
        { label: "模式", value: "企业伙伴" },
        { label: "审批", value: "约 3 个月", wide: true },
      ],
      req: "欢迎早期初创参与",
      cta: { label: "申请", variant: "dark" },
    },
    {
      id: "leap",
      title: "LEAP 加速计划",
      subtitle: "成长阶段 | 全球拓展",
      desc: "以约 470 万港元计划价值迈向国际，对接逾 70 家企业伙伴，并获得大湾区／东盟市场拓展支援。",
      metrics: [
        { label: "计划价值", value: "HKD 4.7M" },
        { label: "现金", value: "HKD 1.2M" },
        { label: "股权", value: "5% 认股权", wide: true },
      ],
      req: "科技园租户、产品已达市场就绪",
      cta: { label: "申请", variant: "dark" },
    },
    {
      id: "coaccel",
      title: "协创加速计划",
      subtitle: "深科技 | 公私合营基金",
      desc: "香港首个 PPP 创科基金，与顶级有限合伙人共同投资生成式人工智能、智联系统及可持续发展等领域。",
      metrics: [
        { label: "投资额", value: "HKD 15.6M" },
        { label: "为期", value: "24 个月" },
        { label: "模式", value: "股权投资", wide: true },
      ],
      req: "科技园租户、深科技、生成式 AI／物联网／绿色科技",
      cta: { label: "申请", variant: "dark" },
    },
    {
      id: "elite",
      title: "精英计划",
      subtitle: "规模化 | 邀请制 | 上市前",
      desc: "面向成熟初创、剑指全球市场的专属计划，研发开支最高可获约一半资助，并附 IPO／并购筹备支援。",
      metrics: [
        { label: "研发资助", value: "HKD 21.5M" },
        { label: "租金补助", value: "HKD 1.5M" },
        { label: "入选", value: "仅限邀请", wide: true },
      ],
      req: "估值约 5,000 万–1 亿美元、员工 30 人以上",
      cta: { label: "仅限邀请", variant: "muted" },
    },
  ];

  function renderProgrammes() {
    const grid = document.querySelector("[data-programme-grid]");
    if (!grid) return;
    grid.innerHTML = PROGRAMMES.map((p) => buildCard(p)).join("");
  }

  function buildCard(p) {
    const titleClass = p.titleAccent ? "prog-card__title prog-card__title--accent" : "prog-card__title";
    const metricsHtml = p.metrics
      .map((m) => {
        const wide = m.wide ? " prog-metric--wide" : "";
        const valClass = m.accent ? " prog-metric__value prog-metric__value--accent" : " prog-metric__value";
        return `<div class="prog-metric${wide}"><p class="prog-metric__label">${m.label}</p><p class="${valClass}">${m.value}</p></div>`;
      })
      .join("");
    const applyUrl = p.id ? `${APPLY_HREF}?programme=${encodeURIComponent(p.id)}` : APPLY_HREF;
    let btnHtml = "";
    if (p.cta.variant === "orange") {
      btnHtml = `<a class="btn btn--primary" style="padding:8px 20px;font-size:12.16px;font-weight:600;display:inline-flex;align-items:center;justify-content:center" href="${applyUrl}">${p.cta.label}</a>`;
    } else if (p.cta.variant === "dark") {
      btnHtml = `<a class="btn btn--dark" href="${applyUrl}">${p.cta.label}</a>`;
    } else {
      btnHtml = `<button type="button" class="btn btn--muted" disabled>${p.cta.label}</button>`;
    }
    return `
      <article class="prog-card">
        <div class="prog-card__head">
          <h3 class="${titleClass}">${p.title}</h3>
          <p class="prog-card__subtitle">${p.subtitle}</p>
        </div>
        <div class="prog-card__body">
          <p class="prog-card__desc">${p.desc}</p>
          <div class="prog-metrics">${metricsHtml}</div>
        </div>
        <div class="prog-card__foot">
          <p class="prog-card__req">${p.req}</p>
          ${btnHtml}
        </div>
      </article>`;
  }

  function setupDropdown() {
    const root = document.querySelector("[data-dropdown]");
    if (!root) return;
    const trigger = root.querySelector("[data-dropdown-trigger]");
    const panel = root.querySelector(".nav-dropdown__panel");
    if (!trigger || !panel) return;

    function close() {
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    function toggle() {
      const open = panel.hidden;
      panel.hidden = !open;
      trigger.setAttribute("aria-expanded", String(open));
    }

    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    });

    panel.addEventListener("click", (e) => e.stopPropagation());
    document.addEventListener("click", () => close());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function setupCopilot() {
    const root = document.querySelector("[data-copilot]");
    if (!root) return;
    const messagesEl = root.querySelector("[data-messages]");
    const input = root.querySelector("[data-chat-input]");
    const sendBtn = root.querySelector("[data-send]");
    const langRoot = root.querySelector("[data-lang-toggle]");
    const msg1 = root.querySelector('[data-i18n="msg1"]');
    const msg2 = root.querySelector('[data-i18n="msg2"]');
    const voiceBar = root.querySelector("[data-voice-bar]");
    const voiceLabelEl = root.querySelector("[data-voice-label]");
    const voiceToggle = root.querySelector("[data-voice-toggle]");

    let lang = "yue";
    let voiceListening = false;
    let voiceSavedInput = "";

    function currentVoiceDraft() {
      return I18N[lang].voiceDraft;
    }

    function applyLang(next) {
      lang = next;
      const t = I18N[lang];
      if (msg1) msg1.textContent = t.msg1;
      if (msg2) msg2.textContent = t.msg2;
      if (input) input.placeholder = t.placeholder;
      if (voiceLabelEl) voiceLabelEl.textContent = t.voiceLabel;
      if (voiceListening && input) input.value = t.voiceDraft;
      langRoot.querySelectorAll("button").forEach((b) => {
        b.classList.toggle("is-active", b.dataset.lang === lang);
      });
    }

    function setVoiceListening(on) {
      voiceListening = on;
      if (!voiceBar || !voiceToggle || !input) return;
      voiceBar.hidden = !on;
      voiceToggle.setAttribute("aria-pressed", String(on));
      voiceToggle.classList.toggle("is-listening", on);
      if (on) {
        voiceSavedInput = input.value;
        input.value = currentVoiceDraft();
        input.focus();
      } else {
        const draft = currentVoiceDraft();
        if (input.value === draft) {
          input.value = voiceSavedInput;
        }
      }
    }

    if (voiceToggle) {
      voiceToggle.addEventListener("click", (e) => {
        e.preventDefault();
        setVoiceListening(!voiceListening);
      });
    }

    langRoot.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-lang]");
      if (!btn) return;
      applyLang(btn.dataset.lang);
    });

    function appendBubble(role, text) {
      const wrap = document.createElement("div");
      wrap.className = role === "user" ? "bubble bubble--user" : "bubble bubble--assistant";
      const label = document.createElement("div");
      label.className = "bubble__label";
      label.textContent = role === "user" ? "You" : "HKSTP Copilot";
      const p = document.createElement("p");
      p.className = "bubble__text";
      p.textContent = text;
      wrap.appendChild(label);
      wrap.appendChild(p);
      messagesEl.appendChild(wrap);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function send() {
      if (voiceListening) setVoiceListening(false);
      const text = (input.value || "").trim();
      if (!text) return;
      appendBubble("user", text);
      input.value = "";
      window.setTimeout(() => {
        appendBubble("assistant", I18N[lang].reply);
      }, 450);
    }

    sendBtn.addEventListener("click", send);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && voiceListening) {
        e.preventDefault();
        setVoiceListening(false);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        send();
      }
    });

    root.querySelectorAll("[data-chip]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const q = chip.dataset.chip || "";
        input.value = q;
        input.focus();
      });
    });

    applyLang(lang);
  }

  renderProgrammes();
  setupDropdown();
  setupCopilot();
})();
