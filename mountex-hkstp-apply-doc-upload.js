/**
 * Company Info: document upload UI + prototype extraction into the apply form.
 * Loaded after mountex-hkstp-apply.js; invoked via window.initMountexCompanyDocUpload(deps).
 */
(function () {
  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initMountexCompanyDocUpload(deps) {
    const form = deps && deps.form;
    const bindAiTouch = deps && deps.bindAiTouch;
    const initialsFromName = deps && deps.initialsFromName;
    if (!form || !bindAiTouch || !initialsFromName) return;

    const root = form.querySelector("[data-doc-upload]");
    if (!root) return;

    const input = root.querySelector("[data-doc-input]");
    const dropzone = root.querySelector("[data-doc-dropzone]");
    const stateEmpty = root.querySelector("[data-doc-state-empty]");
    const busy = root.querySelector("[data-doc-busy]");
    let stateFilled = dropzone && dropzone.querySelector("[data-doc-state-filled]");
    let tagsRoot = dropzone && dropzone.querySelector("[data-doc-tags]");
    if (dropzone && busy && (!stateFilled || !tagsRoot)) {
      const filled = document.createElement("div");
      filled.className = "apply-doc-upload__state apply-doc-upload__state--filled";
      filled.setAttribute("data-doc-state-filled", "");
      filled.hidden = true;
      const tags = document.createElement("div");
      tags.className = "apply-doc-upload__tags";
      tags.setAttribute("data-doc-tags", "");
      filled.appendChild(tags);
      dropzone.insertBefore(filled, busy);
      stateFilled = filled;
      tagsRoot = tags;
    }
    if (!stateFilled || !tagsRoot) return;
    const picks = root.querySelectorAll("[data-doc-pick]");

    let queue = [];
    let uid = 0;
    let parseGen = 0;

    function fileKey(f) {
      return `${f.name}|${f.size}|${f.lastModified}`;
    }

    function formatSize(n) {
      if (n <= 0) return "0b";
      if (n < 1024) return `${Math.max(1, n)}b`;
      const kb = n / 1024;
      if (kb < 1024) return `${kb < 10 ? kb.toFixed(2) : Math.round(kb)}kb`;
      return `${(kb / 1024).toFixed(1)}mb`;
    }

    const docIcon =
      '<svg class="apply-doc-tag__ico" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M9.33 1.33H4a1.33 1.33 0 0 0-1.33 1.34v11.2a1.33 1.33 0 0 0 1.33 1.33h8a1.33 1.33 0 0 0 1.34-1.33V5.34L9.33 1.33z" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.33 1.33V5.33H13.3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    function renderTags() {
      tagsRoot.innerHTML = queue
        .map(
          (item) =>
            `<div class="apply-doc-tag">
              ${docIcon}
              <span class="apply-doc-tag__name">${escapeHtml(item.file.name)}</span>
              <span class="apply-doc-tag__size">${escapeHtml(formatSize(item.file.size))}</span>
              <button type="button" class="apply-doc-tag__remove" data-remove="${escapeHtml(item.id)}" aria-label="Remove ${escapeHtml(item.file.name)}">×</button>
            </div>`
        )
        .join("");
      const has = queue.length > 0;
      stateEmpty.hidden = has;
      stateFilled.hidden = !has;
    }

    function ensureFieldAi(fieldName) {
      const el = form.elements.namedItem(fieldName);
      if (!el || !("value" in el)) return;
      const wrap = el.closest(".apply-field");
      if (!wrap) return;
      wrap.classList.add("apply-field--ai-prefilled");
      el.classList.add("apply-input--ai");
      el.classList.remove("apply-input--ai-touched");
      bindAiTouch(el);
      const label = wrap.querySelector("label");
      if (label && !label.querySelector(".apply-ai-tag")) {
        label.appendChild(document.createTextNode(" "));
        const tag = document.createElement("span");
        tag.className = "apply-ai-tag apply-ai-tag--inline";
        tag.textContent = "AI Pre-filled";
        label.appendChild(tag);
      }
    }

    function applyDocumentExtract() {
      const last = queue[queue.length - 1].file;
      const salt = (last.size + last.name.length) % 3;
      const packs = [
        {
          company_name: "NovaTech Solutions Ltd",
          br_number: "22334455-000-03-21-5",
          incorporation_date: "2020-09-01",
          technology_sector: "fintech",
          team_size: "9",
          rd_percent: "72%",
          ownership_note: "100% — 2 co-founders",
          contact_name: "James Chen",
          contact_role: "CEO & Co-founder",
          email: "james@novatech.hk",
        },
        {
          company_name: "Skyline AI Limited",
          br_number: "99887766-000-01-22-1",
          incorporation_date: "2021-04-18",
          technology_sector: "ai",
          team_size: "14",
          rd_percent: "65%",
          ownership_note: "78% — founders + ESOP",
          contact_name: "Maya Liu",
          contact_role: "Managing Director",
          email: "maya@skyline-ai.hk",
        },
        {
          company_name: "GreenWave Cleantech Co.",
          br_number: "11223344-000-04-19-8",
          incorporation_date: "2019-12-05",
          technology_sector: "cleantech",
          team_size: "6",
          rd_percent: "80%",
          ownership_note: "85% — 3 founders",
          contact_name: "Daniel Ho",
          contact_role: "Founder",
          email: "daniel@greenwave.hk",
        },
      ];
      const data = packs[salt];

      ensureFieldAi("company_name");
      form.elements.namedItem("company_name").value = data.company_name;

      ensureFieldAi("br_number");
      form.elements.namedItem("br_number").value = data.br_number;

      ensureFieldAi("incorporation_date");
      form.elements.namedItem("incorporation_date").value = data.incorporation_date;

      ensureFieldAi("technology_sector");
      form.elements.namedItem("technology_sector").value = data.technology_sector;

      ensureFieldAi("team_size");
      form.elements.namedItem("team_size").value = data.team_size;

      ensureFieldAi("rd_percent");
      form.elements.namedItem("rd_percent").value = data.rd_percent;

      ensureFieldAi("ownership_note");
      form.elements.namedItem("ownership_note").value = data.ownership_note;

      const cName = form.elements.namedItem("contact_name");
      const cRole = form.elements.namedItem("contact_role");
      const cEmail = form.elements.namedItem("email");
      if (cName) cName.value = data.contact_name;
      if (cRole) cRole.value = data.contact_role;
      if (cEmail) cEmail.value = data.email;

      const av = document.querySelector("[data-avatar-primary]");
      if (av) av.textContent = initialsFromName(data.contact_name);
    }

    function scheduleParse() {
      if (queue.length === 0) {
        busy.hidden = true;
        picks.forEach((b) => {
          b.disabled = false;
        });
        return;
      }
      parseGen += 1;
      const gen = parseGen;
      busy.hidden = false;
      picks.forEach((b) => {
        b.disabled = true;
      });
      window.setTimeout(() => {
        if (gen !== parseGen) return;
        applyDocumentExtract();
        busy.hidden = true;
        picks.forEach((b) => {
          b.disabled = false;
        });
      }, 880);
    }

    function addIncoming(fileList) {
      const seen = new Set(queue.map((x) => fileKey(x.file)));
      for (let i = 0; i < fileList.length; i += 1) {
        const file = fileList[i];
        const k = fileKey(file);
        if (seen.has(k)) continue;
        seen.add(k);
        uid += 1;
        queue.push({ id: String(uid), file });
      }
      renderTags();
      scheduleParse();
    }

    picks.forEach((btn) => {
      btn.addEventListener("click", () => {
        input.click();
      });
    });

    dropzone.addEventListener("click", (e) => {
      if (e.target.closest(".apply-doc-tag__remove") || e.target.closest("[data-remove]")) return;
      if (e.target.closest("[data-doc-pick]")) return;
      input.click();
    });

    input.addEventListener("change", () => {
      if (input.files && input.files.length) addIncoming(input.files);
      input.value = "";
    });

    tagsRoot.addEventListener("click", (e) => {
      const rm = e.target && e.target.closest("[data-remove]");
      if (!rm) return;
      const id = rm.getAttribute("data-remove");
      queue = queue.filter((x) => x.id !== id);
      parseGen += 1;
      renderTags();
      if (queue.length) scheduleParse();
      else {
        busy.hidden = true;
        picks.forEach((b) => {
          b.disabled = false;
        });
      }
    });

    ["dragenter", "dragover"].forEach((ev) => {
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add("is-dragover");
      });
    });

    ["dragleave", "drop"].forEach((ev) => {
      dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove("is-dragover");
      });
    });

    dropzone.addEventListener("drop", (e) => {
      const dt = e.dataTransfer;
      if (!dt || !dt.files || !dt.files.length) return;
      addIncoming(dt.files);
    });

    dropzone.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        input.click();
      }
    });
  }

  window.initMountexCompanyDocUpload = initMountexCompanyDocUpload;
})();
