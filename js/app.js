/**
 * SpooferOpencore - Web Application Controller
 * Handles UI interactions, tabs, audio synthesis, clipboard,
 * real-time plist injection, search filters, and batch exports.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Web Audio Context for tactile futuristic SFX
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
  }

  function playTone(freq, type = "sine", duration = 0.08, gainVal = 0.05) {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy catch
    }
  }

  function playSuccessSound() {
    playTone(587.33, "sine", 0.06, 0.04);
    setTimeout(() => playTone(880, "sine", 0.09, 0.04), 60);
  }

  function playClickSound() {
    playTone(440, "triangle", 0.04, 0.03);
  }

  function playActionSound() {
    playTone(700, "sine", 0.05, 0.04);
  }

  // Toast System
  const toastContainer = document.getElementById("toast-container");
  function showToast(message, type = "info", duration = 3000) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type} animate-slide-in`;

    const iconMap = {
      success: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>`,
      info: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>`,
      warning: `<svg class="toast-icon" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>`
    };

    toast.innerHTML = `
      ${iconMap[type] || iconMap.info}
      <span class="toast-msg">${message}</span>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Copy to Clipboard Helper
  window.copyText = function(text, label = "Copied to clipboard") {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        playClickSound();
        showToast(label, "success");
      }).catch(() => {
        fallbackCopy(text, label);
      });
    } else {
      fallbackCopy(text, label);
    }
  };

  function fallbackCopy(text, label) {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    try {
      document.execCommand("copy");
      playClickSound();
      showToast(label, "success");
    } catch (e) {
      showToast("Failed to copy", "warning");
    }
    document.body.removeChild(el);
  }

  // App State
  let currentModel = MAC_MODELS[0].model;
  let currentIdentity = spooferEngine.generateIdentity(currentModel);
  let batchList = [];

  // Populate Model Selectors
  const modelSelect = document.getElementById("model-select");
  const batchModelSelect = document.getElementById("batch-model-select");

  function populateModelDropdowns() {
    if (!modelSelect) return;
    modelSelect.innerHTML = "";
    if (batchModelSelect) batchModelSelect.innerHTML = "";

    const categories = {};
    MAC_MODELS.forEach(m => {
      if (!categories[m.category]) categories[m.category] = [];
      categories[m.category].push(m);
    });

    Object.keys(categories).forEach(cat => {
      const group = document.createElement("optgroup");
      group.label = cat;

      categories[cat].forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.model;
        opt.textContent = `${m.model} - ${m.name}`;
        group.appendChild(opt);
      });

      modelSelect.appendChild(group);
      if (batchModelSelect) {
        batchModelSelect.appendChild(group.cloneNode(true));
      }
    });

    modelSelect.value = currentModel;
    if (batchModelSelect) batchModelSelect.value = currentModel;
  }

  // Update Model Details UI
  function updateModelSpecsUI(modelId) {
    const modelObj = MAC_MODELS.find(m => m.model === modelId) || MAC_MODELS[0];
    
    const specModelBadge = document.getElementById("spec-model-badge");
    const specFullName = document.getElementById("spec-fullname");
    const specCpu = document.getElementById("spec-cpu");
    const specBoardId = document.getElementById("spec-boardid");
    const specProcessorType = document.getElementById("spec-processortype");
    const specRecommended = document.getElementById("spec-recommended");
    const specMaxOS = document.getElementById("spec-maxos");

    if (specModelBadge) specModelBadge.textContent = modelObj.model;
    if (specFullName) specFullName.textContent = modelObj.name;
    if (specCpu) specCpu.textContent = modelObj.cpuFamily;
    if (specBoardId) specBoardId.textContent = modelObj.boardId;
    if (specProcessorType) specProcessorType.textContent = `${modelObj.processorType} (${parseInt(modelObj.processorType, 16)})`;
    if (specRecommended) specRecommended.textContent = modelObj.recommendedFor;
    if (specMaxOS) specMaxOS.textContent = modelObj.maxOS;
  }

  // Update Generated Identity Values in UI
  function renderIdentity(idObj) {
    currentIdentity = idObj;

    const elModel = document.getElementById("field-model");
    const elSerial = document.getElementById("field-serial");
    const elMlb = document.getElementById("field-mlb");
    const elUuid = document.getElementById("field-uuid");
    const elMac = document.getElementById("field-mac");
    const elRomHex = document.getElementById("field-rom-hex");
    const elRomB64 = document.getElementById("field-rom-b64");
    const elBoardId = document.getElementById("field-boardid");
    const elAppleCoverageBtn = document.getElementById("btn-apple-coverage");

    if (elModel) elModel.value = idObj.model;
    if (elSerial) elSerial.value = idObj.serialNumber;
    if (elMlb) elMlb.value = idObj.mlb;
    if (elUuid) elUuid.value = idObj.uuid;
    if (elMac) elMac.value = idObj.rom.macFormatted;
    if (elRomHex) elRomHex.value = idObj.rom.hexRaw;
    if (elRomB64) elRomB64.value = idObj.rom.base64;
    if (elBoardId) elBoardId.value = idObj.boardId;

    if (elAppleCoverageBtn) {
      elAppleCoverageBtn.href = `https://checkcoverage.apple.com/?locale=en_US&sn=${idObj.serialNumber}`;
    }

    // Run validation & audit
    runLiveAudit(idObj);

    // Update Plist preview if active
    updatePlistLivePreview();
  }

  // Generate New Identity
  function generateNew(modelId = currentModel) {
    playSuccessSound();
    const idObj = spooferEngine.generateIdentity(modelId);
    renderIdentity(idObj);
    showToast(`Generated new SMBIOS identity for ${idObj.model}`, "success");
  }

  // Live Audit Runner
  function runLiveAudit(idObj) {
    const audit = spooferEngine.auditIServices(idObj);
    const scoreVal = document.getElementById("audit-score-val");
    const scoreProgress = document.getElementById("audit-score-progress");
    const auditStatus = document.getElementById("audit-status-badge");
    const auditList = document.getElementById("audit-check-list");

    if (scoreVal) scoreVal.textContent = `${audit.score}%`;
    if (scoreProgress) {
      scoreProgress.style.width = `${audit.score}%`;
      scoreProgress.className = `progress-bar progress-${audit.status.toLowerCase()}`;
    }
    if (auditStatus) {
      auditStatus.textContent = audit.status;
      auditStatus.className = `status-pill status-${audit.status.toLowerCase()}`;
    }

    if (auditList) {
      auditList.innerHTML = audit.checks.map(c => `
        <div class="audit-item ${c.pass ? 'pass' : 'fail'}">
          <div class="audit-icon">${c.pass ? '✓' : '✗'}</div>
          <div class="audit-details">
            <span class="audit-name">${c.name}</span>
            <span class="audit-desc">${c.detail}</span>
          </div>
          <div class="audit-tag ${c.pass ? 'tag-pass' : 'tag-fail'}">${c.pass ? 'VALID' : 'ISSUE'}</div>
        </div>
      `).join("");
    }
  }

  // Serial Validator Interactive Box
  const serialValidateInput = document.getElementById("serial-validate-input");
  const serialValidateBtn = document.getElementById("serial-validate-btn");
  const serialValidateResult = document.getElementById("serial-validate-result");

  function validateCustomSerial() {
    if (!serialValidateInput || !serialValidateResult) return;
    const input = serialValidateInput.value.trim();
    if (!input) {
      serialValidateResult.innerHTML = `<span class="text-warning">Please enter a serial number to test.</span>`;
      return;
    }
    const val = spooferEngine.validateSerialNumber(input);
    if (!val.valid) {
      serialValidateResult.innerHTML = `
        <div class="validate-box fail animate-fade-in">
          <div class="val-header">Invalid Format: ${val.reason}</div>
          <p class="val-hint">Apple serials must be exactly 12 characters alphanumeric.</p>
        </div>
      `;
      playTone(220, "sawtooth", 0.15, 0.05);
    } else {
      serialValidateResult.innerHTML = `
        <div class="validate-box pass animate-fade-in">
          <div class="val-header">Valid Apple 12-char Serial Structure ✓</div>
          <div class="val-grid">
            <div><span class="lbl">Plant Code:</span> <strong>${val.plant}</strong> (${val.isKnownPlant ? 'Known Apple Facility' : 'Custom/Unregistered'})</div>
            <div><span class="lbl">Production Code:</span> <strong>Year ${val.yearChar}, Week ${val.weekChar}</strong></div>
            <div><span class="lbl">Model Code:</span> <strong>${val.modelCode}</strong></div>
            <div><span class="lbl">Matched Hardware:</span> <strong>${val.matchedModel}</strong> (${val.matchedModelName})</div>
          </div>
        </div>
      `;
      playSuccessSound();
    }
  }

  if (serialValidateBtn) {
    serialValidateBtn.addEventListener("click", validateCustomSerial);
  }
  if (serialValidateInput) {
    serialValidateInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") validateCustomSerial();
    });
  }

  // Config.plist Editor & Injector
  const plistEditor = document.getElementById("plist-editor");
  const presetSelect = document.getElementById("plist-preset-select");
  const btnInjectPlist = document.getElementById("btn-inject-plist");
  const btnCopyPlist = document.getElementById("btn-copy-plist");
  const btnDownloadPlist = document.getElementById("btn-download-plist");
  const btnUploadPlist = document.getElementById("btn-upload-plist");
  const fileInputPlist = document.getElementById("plist-file-input");

  function loadPreset(presetKey) {
    if (OC_PRESETS[presetKey] && plistEditor) {
      plistEditor.value = OC_PRESETS[presetKey].xml;
      showToast(`Loaded ${OC_PRESETS[presetKey].name} preset`, "info");
    }
  }

  function updatePlistLivePreview() {
    // If user hasn't loaded custom plist, ensure preset is synchronized
    if (presetSelect && OC_PRESETS[presetSelect.value] && plistEditor && !plistEditor.dataset.custom) {
      const injected = spooferEngine.injectIntoPlist(OC_PRESETS[presetSelect.value].xml, currentIdentity);
      plistEditor.value = injected;
    }
  }

  if (presetSelect) {
    presetSelect.addEventListener("change", (e) => {
      loadPreset(e.target.value);
      if (plistEditor) delete plistEditor.dataset.custom;
      updatePlistLivePreview();
    });
  }

  if (plistEditor) {
    plistEditor.addEventListener("input", () => {
      plistEditor.dataset.custom = "true";
    });
  }

  if (btnInjectPlist) {
    btnInjectPlist.addEventListener("click", () => {
      if (!plistEditor) return;
      playActionSound();
      const currentXml = plistEditor.value;
      const injected = spooferEngine.injectIntoPlist(currentXml, currentIdentity);
      plistEditor.value = injected;
      showToast(`Injected ${currentIdentity.model} credentials into config.plist!`, "success");
    });
  }

  if (btnCopyPlist) {
    btnCopyPlist.addEventListener("click", () => {
      if (!plistEditor) return;
      window.copyText(plistEditor.value, "config.plist XML copied to clipboard");
    });
  }

  if (btnDownloadPlist) {
    btnDownloadPlist.addEventListener("click", () => {
      if (!plistEditor) return;
      playActionSound();
      const blob = new Blob([plistEditor.value], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "config.plist";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Downloaded config.plist", "success");
    });
  }

  if (btnUploadPlist && fileInputPlist) {
    btnUploadPlist.addEventListener("click", () => {
      fileInputPlist.click();
    });

    fileInputPlist.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (plistEditor) {
            plistEditor.value = event.target.result;
            plistEditor.dataset.custom = "true";
            showToast(`Loaded ${file.name}`, "success");
          }
        };
        reader.readAsText(file);
      }
    });
  }

  // SSDT & HWID Generator
  const ssdtPresetSelect = document.getElementById("ssdt-preset-select");
  const ssdtPciPath = document.getElementById("ssdt-pcipath");
  const ssdtCode = document.getElementById("ssdt-code-output");
  const btnCopySsdt = document.getElementById("btn-copy-ssdt");
  const btnDownloadSsdt = document.getElementById("btn-download-ssdt");

  function refreshSSDT() {
    if (!ssdtCode) return;
    const presetVal = ssdtPresetSelect ? ssdtPresetSelect.value : "rx6800xt";
    const path = ssdtPciPath ? ssdtPciPath.value.trim() : "_SB_.PCI0.PEG0.PEGP";

    let fakeId = "0x73BF";
    let spoofName = "Radeon RX 6800 XT (Spoofed)";

    if (presetVal === "rx6900xt") {
      fakeId = "0x73BF";
      spoofName = "Radeon RX 6900 XT (Spoofed)";
    } else if (presetVal === "rx6600xt") {
      fakeId = "0x73FF";
      spoofName = "Radeon RX 6600 XT";
    } else if (presetVal === "rx550") {
      fakeId = "0x67FF";
      spoofName = "Radeon RX 550 (Baffin Fake ID)";
    } else if (presetVal === "uhd630") {
      fakeId = "0x3E9B";
      spoofName = "Intel UHD Graphics 630";
    }

    const dsl = spooferEngine.generateSSDT({
      pciPath: path,
      fakeDeviceId: fakeId,
      spoofName: spoofName
    });

    ssdtCode.value = dsl;
  }

  if (ssdtPresetSelect) ssdtPresetSelect.addEventListener("change", refreshSSDT);
  if (ssdtPciPath) ssdtPciPath.addEventListener("input", refreshSSDT);

  if (btnCopySsdt) {
    btnCopySsdt.addEventListener("click", () => {
      if (!ssdtCode) return;
      window.copyText(ssdtCode.value, "SSDT-SPOOF DSL source copied");
    });
  }

  if (btnDownloadSsdt) {
    btnDownloadSsdt.addEventListener("click", () => {
      if (!ssdtCode) return;
      playActionSound();
      const blob = new Blob([ssdtCode.value], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "SSDT-SPOOF.dsl";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Downloaded SSDT-SPOOF.dsl", "success");
    });
  }

  // NIC / MAC Address Randomizer tool
  const nicOuiSelect = document.getElementById("nic-oui-select");
  const nicMacOutput = document.getElementById("nic-mac-output");
  const nicCliOutput = document.getElementById("nic-cli-output");
  const btnRegenNic = document.getElementById("btn-regen-nic");

  function populateNicOuis() {
    if (!nicOuiSelect) return;
    nicOuiSelect.innerHTML = `<option value="RANDOM">⚡ Random Apple OUI</option>`;
    APPLE_MAC_OUIS.forEach(oui => {
      const opt = document.createElement("option");
      opt.value = oui;
      opt.textContent = `${oui} (Apple Inc.)`;
      nicOuiSelect.appendChild(opt);
    });
  }

  function refreshNic() {
    if (!nicMacOutput || !nicCliOutput) return;
    const selOui = nicOuiSelect ? nicOuiSelect.value : "RANDOM";
    const rom = spooferEngine.generateROM();
    let mac = rom.macFormatted;

    if (selOui !== "RANDOM") {
      const lower = [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
      ].map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(":");
      mac = `${selOui}:${lower}`;
    }

    nicMacOutput.value = mac;
    nicCliOutput.value = `sudo ifconfig en0 ether ${mac}`;
  }

  if (nicOuiSelect) nicOuiSelect.addEventListener("change", refreshNic);
  if (btnRegenNic) {
    btnRegenNic.addEventListener("click", () => {
      playActionSound();
      refreshNic();
      showToast("Generated new Apple MAC address", "success");
    });
  }

  // Batch Generator
  const batchCountSelect = document.getElementById("batch-count-select");
  const btnGenerateBatch = document.getElementById("btn-generate-batch");
  const batchTableBody = document.getElementById("batch-table-body");
  const btnExportBatchCsv = document.getElementById("btn-export-batch-csv");
  const btnExportBatchJson = document.getElementById("btn-export-batch-json");

  function runBatchGenerate() {
    if (!batchTableBody) return;
    playSuccessSound();
    const model = batchModelSelect ? batchModelSelect.value : currentModel;
    const count = batchCountSelect ? parseInt(batchCountSelect.value, 10) : 10;
    batchList = spooferEngine.generateBatch(model, count);

    batchTableBody.innerHTML = batchList.map((item, idx) => `
      <tr>
        <td class="col-num">${idx + 1}</td>
        <td><span class="badge badge-subtle">${item.model}</span></td>
        <td class="font-mono">${item.serialNumber}</td>
        <td class="font-mono text-muted">${item.mlb}</td>
        <td class="font-mono text-muted">${item.uuid}</td>
        <td class="font-mono">${item.rom.macFormatted}</td>
        <td>
          <button class="btn btn-xs btn-outline" onclick="copyText('${item.serialNumber}', 'Serial copied!')">Serial</button>
          <button class="btn btn-xs btn-outline" onclick="copyText('${item.mlb}', 'MLB copied!')">MLB</button>
        </td>
      </tr>
    `).join("");

    showToast(`Generated ${batchList.length} identity profiles`, "success");
  }

  if (btnGenerateBatch) btnGenerateBatch.addEventListener("click", runBatchGenerate);

  if (btnExportBatchCsv) {
    btnExportBatchCsv.addEventListener("click", () => {
      if (!batchList.length) {
        showToast("Generate a batch first", "warning");
        return;
      }
      playActionSound();
      const headers = ["Index", "Model", "SerialNumber", "MLB", "SystemUUID", "ROM_MAC", "ROM_Hex", "ROM_Base64"];
      const rows = batchList.map((item, i) => [
        i + 1,
        item.model,
        item.serialNumber,
        item.mlb,
        item.uuid,
        item.rom.macFormatted,
        item.rom.hexRaw,
        item.rom.base64
      ]);

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `SpooferOpencore_Batch_${batchList[0].model}_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Exported CSV file", "success");
    });
  }

  if (btnExportBatchJson) {
    btnExportBatchJson.addEventListener("click", () => {
      if (!batchList.length) {
        showToast("Generate a batch first", "warning");
        return;
      }
      playActionSound();
      const jsonStr = JSON.stringify(batchList, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `SpooferOpencore_Batch_${batchList[0].model}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Exported JSON file", "success");
    });
  }

  // Event Listeners for SMBIOS Controls
  if (modelSelect) {
    modelSelect.addEventListener("change", (e) => {
      currentModel = e.target.value;
      updateModelSpecsUI(currentModel);
      generateNew(currentModel);
    });
  }

  const btnGenerateMain = document.getElementById("btn-generate-main");
  if (btnGenerateMain) {
    btnGenerateMain.addEventListener("click", () => generateNew(currentModel));
  }

  const btnRandomizeAll = document.getElementById("btn-randomize-all");
  if (btnRandomizeAll) {
    btnRandomizeAll.addEventListener("click", () => {
      // Pick a random model from list
      const randomModel = MAC_MODELS[Math.floor(Math.random() * MAC_MODELS.length)].model;
      currentModel = randomModel;
      if (modelSelect) modelSelect.value = currentModel;
      updateModelSpecsUI(currentModel);
      generateNew(currentModel);
    });
  }

  const btnCopyFullJson = document.getElementById("btn-copy-full-json");
  if (btnCopyFullJson) {
    btnCopyFullJson.addEventListener("click", () => {
      const formatted = JSON.stringify(currentIdentity, null, 2);
      window.copyText(formatted, "Full identity JSON copied to clipboard");
    });
  }

  const btnQuickHeroGen = document.getElementById("btn-hero-quick-gen");
  if (btnQuickHeroGen) {
    btnQuickHeroGen.addEventListener("click", () => {
      generateNew(currentModel);
      // Smooth scroll to workbench
      const workbench = document.getElementById("workbench");
      if (workbench) workbench.scrollIntoView({ behavior: "smooth" });
    });
  }

  // Tab Navigation System
  const tabBtns = document.querySelectorAll(".nav-tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");

  function switchTab(targetTabId) {
    playClickSound();
    tabBtns.forEach(btn => {
      if (btn.dataset.tab === targetTabId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    tabPanes.forEach(pane => {
      if (pane.id === targetTabId) {
        pane.classList.add("active");
      } else {
        pane.classList.remove("active");
      }
    });

    // Close mobile drawer if open
    closeMobileDrawer();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      switchTab(btn.dataset.tab);
    });
  });

  // Mobile Drawer Toggle
  const mobileMenuToggle = document.getElementById("mobile-menu-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const drawerOverlay = document.getElementById("drawer-overlay");
  const drawerCloseBtn = document.getElementById("drawer-close-btn");

  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add("open");
    if (drawerOverlay) drawerOverlay.classList.add("active");
    document.body.classList.add("overflow-hidden");
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (drawerOverlay) drawerOverlay.classList.remove("active");
    document.body.classList.remove("overflow-hidden");
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener("click", openMobileDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener("click", closeMobileDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener("click", closeMobileDrawer);

  const drawerNavLinks = document.querySelectorAll(".drawer-nav-item");
  drawerNavLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      const tabTarget = link.dataset.tab;
      if (tabTarget) {
        e.preventDefault();
        switchTab(tabTarget);
      }
    });
  });

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById("sound-toggle-btn");
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      soundToggleBtn.classList.toggle("sound-off", !soundEnabled);
      soundToggleBtn.title = soundEnabled ? "Tactile Audio: Enabled" : "Tactile Audio: Muted";
      showToast(soundEnabled ? "Tactile Audio Enabled" : "Audio Muted", "info");
      if (soundEnabled) playSuccessSound();
    });
  }

  // Keyboard Shortcuts: 'g' to generate, 'c' to copy serial, '?' for shortcuts modal
  window.addEventListener("keydown", (e) => {
    // Only if not actively typing in an input or textarea
    if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName)) return;

    if (e.key === "g" || e.key === "G") {
      e.preventDefault();
      generateNew(currentModel);
    } else if (e.key === "c" || e.key === "C") {
      e.preventDefault();
      window.copyText(currentIdentity.serialNumber, `Copied Serial: ${currentIdentity.serialNumber}`);
    } else if (e.key === "1") {
      switchTab("tab-smbios");
    } else if (e.key === "2") {
      switchTab("tab-plist");
    } else if (e.key === "3") {
      switchTab("tab-acpi");
    } else if (e.key === "4") {
      switchTab("tab-iservices");
    } else if (e.key === "5") {
      switchTab("tab-batch");
    } else if (e.key === "6") {
      switchTab("tab-guide");
    }
  });

  // Initialize
  populateModelDropdowns();
  populateNicOuis();
  updateModelSpecsUI(currentModel);
  renderIdentity(currentIdentity);
  loadPreset("comet_lake");
  refreshSSDT();
  refreshNic();
  runBatchGenerate();
});
