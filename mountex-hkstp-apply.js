(function () {
  const STEPS = 3;
  const params = new URLSearchParams(window.location.search);
  const programmeParam = (params.get("programme") || "").trim();

  const form = document.querySelector("[data-apply-form]");
  if (!form) return;

  const panels = Array.from(form.querySelectorAll("[data-step-panel]"));
  const visualSteps = Array.from(document.querySelectorAll("[data-visual-step]"));
  const programmeInput = form.querySelector("#programme");
  const applicantInput = form.querySelector("#applicant_type");
  const btnPrev = form.querySelector("[data-btn-prev]");
  const btnNext = form.querySelector("[data-btn-next]");
  const btnSubmit = form.querySelector("[data-btn-submit]");
  const reviewRoot = document.querySelector("[data-review]");
  const successEl = document.querySelector("[data-apply-success]");
  const formCard = document.querySelector("[data-apply-card]");
  const recoTitle = document.querySelector("[data-reco-title]");
  const recoBullets = document.querySelector("[data-reco-bullets]");
  const stepperFill = document.querySelector("[data-stepper-fill]");

  let step = 1;

  const programmeLabels = {
    ideation: "Ideation Programme",
    incubation: "Incubation Programme",
    codev: "Co-Dev Programme",
    leap: "LEAP Acceleration Programme",
    coaccel: "Co-Accel Programme",
    elite: "Elite Programme",
  };

  const sectorLabels = {
    ai: "Artificial Intelligence",
    fintech: "FinTech",
    biomed: "Biomedical",
    cleantech: "CleanTech",
    enterprise: "Enterprise",
    other: "Other",
  };

  const stageLabels = {
    idea: "Idea",
    prototype: "Prototype",
    mvp: "MVP",
    working: "Working Prototype",
    scaling: "Scaling",
  };

  const programmeCopilot = {
    "": {
      titleHtml: '<span class="apply-copilot-banner__title-muted">Select a programme</span>',
      text: "Choose your programme to see Copilot guidance.",
      showBadge: false,
    },
    ideation: {
      titleHtml:
        'Copilot Recommendation: <span class="apply-copilot-banner__accent">Ideation Programme</span>',
      text: "Early-stage ideas benefit from structured validation and mentor feedback — tell us about your hypothesis and next experiments.",
      showBadge: true,
    },
    incubation: {
      titleHtml:
        'Copilot Recommendation: <span class="apply-copilot-banner__accent">Incubation Programme</span>',
      text: "Based on your conversation, you have a working prototype and a team of 4. The Incubation Programme provides up to HKD 1.29M over 3 years with dedicated office space.",
      showBadge: true,
    },
    codev: {
      titleHtml: 'Copilot Recommendation: <span class="apply-copilot-banner__accent">Co-Dev Programme</span>',
      text: "Strong fit when you need a structured partner path and milestone-based delivery with HKSTP ecosystem partners.",
      showBadge: true,
    },
    leap: {
      titleHtml: 'Copilot Recommendation: <span class="apply-copilot-banner__accent">LEAP</span>',
      text: "Designed for teams ready to scale — emphasise traction, GTM, and your 12-month growth plan.",
      showBadge: true,
    },
    coaccel: {
      titleHtml: 'Copilot Recommendation: <span class="apply-copilot-banner__accent">Co-Accel Programme</span>',
      text: "Highlight joint outcomes with corporates or park companies and how you will co-deliver value.",
      showBadge: true,
    },
    elite: {
      titleHtml:
        '<span class="apply-copilot-banner__accent">Elite Programme</span> <span class="apply-copilot-banner__title-muted">(by invitation)</span>',
      text: "If you were invited, include your reference or sponsor contact so we can match your record.",
      showBadge: false,
    },
  };

  const programmeReco = {
    ideation: {
      title: "Ideation Programme",
      metrics: [
        { label: "Focus", value: "Validation" },
        { label: "Mentoring", value: "Included" },
        { label: "Stage", value: "Early" },
      ],
    },
    incubation: {
      title: "Incubation Programme",
      metrics: [
        { label: "Funding", value: "Up to HKD 1.29M" },
        { label: "Duration", value: "3 years" },
        { label: "Office Space", value: "Included" },
      ],
    },
    codev: {
      title: "Co-Dev Programme",
      metrics: [
        { label: "Model", value: "Partner PoC" },
        { label: "Milestones", value: "Agreed sprints" },
        { label: "Ecosystem", value: "Park network" },
      ],
    },
    leap: {
      title: "LEAP",
      metrics: [
        { label: "Focus", value: "Scale" },
        { label: "Network", value: "Mentors + investors" },
        { label: "Demo", value: "Demo Day" },
      ],
    },
    coaccel: {
      title: "Co-Accel Programme",
      metrics: [
        { label: "Collaboration", value: "Joint GTM" },
        { label: "Access", value: "Corporate intros" },
        { label: "Support", value: "Specialist coaches" },
      ],
    },
    elite: {
      title: "Elite Programme",
      metrics: [
        { label: "Access", value: "By invitation" },
        { label: "Support", value: "Dedicated AM" },
        { label: "Terms", value: "Per agreement" },
      ],
    },
  };

  function val(name) {
    const el = form.elements.namedItem(name);
    return el && "value" in el ? String(el.value).trim() : "";
  }

  function initialsFromName(name) {
    const s = name.trim();
    if (!s) return "?";
    const parts = s.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return s.slice(0, 2).toUpperCase();
  }

  function ensureDefaults() {
    if (programmeInput && !val("programme")) {
      programmeInput.value = "incubation";
    }
    if (applicantInput && !val("applicant_type")) {
      applicantInput.value = "company";
    }
  }

  function bindAiTouch(el) {
    if (el.dataset.applyAiBound) return;
    el.dataset.applyAiBound = "1";
    const markTouched = () => {
      el.classList.add("apply-input--ai-touched");
    };
    el.addEventListener("input", markTouched, { passive: true });
    el.addEventListener("change", markTouched, { passive: true });
  }

  /** First user edit on Copilot-filled inputs → normal (grey) field styling */
  function initAiPrefilledInputs() {
    form.querySelectorAll("input.apply-input--ai, select.apply-input--ai").forEach((el) => {
      bindAiTouch(el);
    });
  }

  function setProgrammeFromQuery() {
    const keys = Object.keys(programmeLabels);
    if (programmeParam && keys.includes(programmeParam) && programmeInput) {
      programmeInput.value = programmeParam;
    }
  }

  function updateCopilotBanner() {
    const key = val("programme") || "incubation";
    const cfg = programmeCopilot[key] || programmeCopilot.incubation;
    document.querySelectorAll("[data-copilot-title]").forEach((el) => {
      el.innerHTML = cfg.titleHtml;
    });
    document.querySelectorAll("[data-copilot-text]").forEach((el) => {
      el.textContent = cfg.text;
    });
    document.querySelectorAll("[data-copilot-badge]").forEach((el) => {
      el.hidden = !cfg.showBadge;
    });
  }

  /** App steps 1–3 map to visual steps 2–4 (visual step 1 = AI Match always done). */
  const FILL_PCT_BY_APP_STEP = { 1: 37.5, 2: 62.5, 3: 100 };

  function setStepperFill(appStep) {
    if (!stepperFill) return;
    const pct = FILL_PCT_BY_APP_STEP[appStep] ?? 0;
    stepperFill.style.width = `${pct}%`;
  }

  function syncVisualStepper(appStep) {
    const activeVisual = appStep + 1;
    visualSteps.forEach((node) => {
      const v = parseInt(node.dataset.visualStep, 10);
      if (!Number.isFinite(v)) return;
      node.classList.toggle("is-done", v < activeVisual);
      node.classList.toggle("is-active", v === activeVisual);
      node.classList.toggle("is-pending", v > activeVisual);
    });
    setStepperFill(appStep);
  }

  function showStep(n) {
    step = Math.min(Math.max(n, 1), STEPS);
    panels.forEach((el) => {
      const sn = parseInt(el.dataset.stepPanel, 10);
      el.hidden = sn !== step;
    });
    syncVisualStepper(step);
    if (btnPrev) btnPrev.hidden = step === 1;
    if (btnNext) btnNext.hidden = step === STEPS;
    if (btnSubmit) btnSubmit.hidden = step !== STEPS;
  }

  function validateStepCompany() {
    if (!val("company_name")) return "Please enter the company name.";
    if (!val("technology_sector")) return "Please select a technology sector.";
    if (!val("team_size")) return "Please enter the team size.";
    if (!val("contact_name")) return "Please enter the primary contact's name.";
    if (!val("contact_role")) return "Please enter the contact's role.";
    if (!val("email")) return "Please enter an email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val("email"))) return "Please enter a valid email address.";
    return "";
  }

  function validateStepProposal() {
    const required = [
      "project_title",
      "project_summary",
      "tech_description",
      "target_market",
      "problem_statement",
      "competitive_advantage",
      "current_stage",
      "milestones_12m",
    ];
    for (let i = 0; i < required.length; i += 1) {
      if (!val(required[i])) return "Please complete all required fields.";
    }
    return "";
  }

  function validateStepReview() {
    const d = form.querySelector("[name='declaration']");
    if (!d || !d.checked) return "Please confirm the declaration to submit your application.";
    return "";
  }

  function escapeHtml(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderRecommendation() {
    const pKey = val("programme");
    const reco = programmeReco[pKey];
    if (!recoTitle || !recoBullets) return;
    if (!reco) {
      recoTitle.textContent = "—";
      recoBullets.innerHTML = "";
      return;
    }
    recoTitle.textContent = reco.title;
    recoBullets.innerHTML = reco.metrics
      .map(
        (m) =>
          `<li class="apply-reco-metric"><span class="apply-reco-metric__k">${escapeHtml(m.label)}</span><span class="apply-reco-metric__v">${escapeHtml(m.value)}</span></li>`
      )
      .join("");
  }

  function renderReview() {
    if (!reviewRoot) return;
    const pKey = val("programme");
    const pLabel = programmeLabels[pKey] || pKey;
    const sector = sectorLabels[val("technology_sector")] || val("technology_sector");
    const stage = stageLabels[val("current_stage")] || val("current_stage");
    const i1 = initialsFromName(val("contact_name"));
    const i2 = initialsFromName(val("member2_name"));

    reviewRoot.innerHTML = `
      <section class="apply-review-card">
        <header class="apply-review-card__hd">
          <h3 class="apply-review-card__ttl">Company Information</h3>
          <button type="button" class="apply-edit-link" data-edit-step="1">Edit</button>
        </header>
        <div class="apply-review-card__grid">
          <div class="apply-review-kv"><span class="apply-review-k">Company Name</span><span class="apply-review-v">${escapeHtml(val("company_name"))}</span></div>
          <div class="apply-review-kv"><span class="apply-review-k">Business Registration No.</span><span class="apply-review-v">${escapeHtml(val("br_number") || "—")}</span></div>
          <div class="apply-review-kv"><span class="apply-review-k">Technology Sector</span><span class="apply-review-v">${escapeHtml(sector || "—")}</span></div>
          <div class="apply-review-kv"><span class="apply-review-k">Full-Time Team Size</span><span class="apply-review-v">${escapeHtml(val("team_size"))} members</span></div>
        </div>
        <p class="apply-review-team-label">Team Members</p>
        <div class="apply-review-team">
          <div class="apply-review-team-row">
            <span class="apply-review-av apply-review-av--dark">${escapeHtml(i1)}</span>
            <div>
              <div class="apply-review-name">${escapeHtml(val("contact_name"))}</div>
              <div class="apply-review-sub">${escapeHtml(val("contact_role"))} · ${escapeHtml(val("email"))}</div>
            </div>
          </div>
          ${val("member2_name") ? `<div class="apply-review-team-row">
            <span class="apply-review-av apply-review-av--orange">${escapeHtml(i2)}</span>
            <div>
              <div class="apply-review-name">${escapeHtml(val("member2_name"))}</div>
              <div class="apply-review-sub">${escapeHtml(val("member2_role"))} · ${escapeHtml(val("member2_email") || "")}</div>
            </div>
          </div>` : ""}
        </div>
      </section>
      <section class="apply-review-card">
        <header class="apply-review-card__hd">
          <h3 class="apply-review-card__ttl">Project Proposal</h3>
          <button type="button" class="apply-edit-link" data-edit-step="2">Edit</button>
        </header>
        <p class="apply-review-proj-title">${escapeHtml(val("project_title"))}</p>
        <p class="apply-review-proj-sum">${escapeHtml(val("project_summary"))}</p>
        <div class="apply-review-card__grid apply-review-card__grid--2">
          <div class="apply-review-kv"><span class="apply-review-k">Target Market</span><span class="apply-review-v">${escapeHtml(val("target_market"))}</span></div>
          <div class="apply-review-kv"><span class="apply-review-k">Current Stage</span><span class="apply-review-v">${escapeHtml(stage || "—")}</span></div>
        </div>
        <p class="apply-review-note"><strong>Programme</strong> · ${escapeHtml(pLabel)}</p>
      </section>`;
  }

  function clearErrors() {
    form.querySelectorAll(".apply-error").forEach((n) => n.remove());
  }

  function showError(message) {
    clearErrors();
    const div = document.createElement("p");
    div.className = "apply-error";
    div.setAttribute("role", "alert");
    div.textContent = message;
    form.querySelector(".apply-actions").before(div);
  }

  form.addEventListener("click", (e) => {
    const t = e.target && e.target.closest("[data-edit-step]");
    if (!t || !form.contains(t)) return;
    const target = parseInt(t.getAttribute("data-edit-step"), 10);
    if (!Number.isFinite(target)) return;
    clearErrors();
    showStep(target);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  if (btnNext) {
    btnNext.addEventListener("click", () => {
      clearErrors();
      let err = "";
      if (step === 1) err = validateStepCompany();
      else if (step === 2) err = validateStepProposal();
      if (err) {
        showError(err);
        return;
      }
      if (step === 2) {
        renderRecommendation();
        renderReview();
      }
      showStep(step + 1);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener("click", () => {
      clearErrors();
      showStep(step - 1);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    const err = validateStepReview();
    if (err) {
      showError(err);
      return;
    }
    if (formCard) formCard.hidden = true;
    if (successEl) successEl.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  ensureDefaults();
  setProgrammeFromQuery();
  ensureDefaults();
  updateCopilotBanner();
  initAiPrefilledInputs();
  if (typeof window.initMountexCompanyDocUpload === "function") {
    window.initMountexCompanyDocUpload({ form, bindAiTouch, initialsFromName });
  }
  showStep(1);
})();
