/**
 * SpooferOpencore - Clean Light UI Controller
 * Simple, fast, zero-clutter logic for desktop and mobile
 */

document.addEventListener("DOMContentLoaded", () => {
  // Toast Notification System
  const toastContainer = document.getElementById("toast-container");
  function showToast(message, type = "success", duration = 2500) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.25s ease";
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // Copy to Clipboard
  window.copyText = function(text, label = "Copied to clipboard") {
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
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
      showToast(label, "success");
    } catch (e) {
      showToast("Unable to copy", "warning");
    }
    document.body.removeChild(el);
  }

  // App State
  let currentModel = MAC_MODELS[0].model;
  let currentIdentity = spooferEngine.generateIdentity(currentModel);

  // Populate Dropdown
  const modelSelect = document.getElementById("model-select");
  function populateModels() {
    if (!modelSelect) return;
    modelSelect.innerHTML = "";

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
    });

    modelSelect.value = currentModel;
  }

  // Update Model Summary
  function updateModelSpecs(modelId) {
    const modelObj = MAC_MODELS.find(m => m.model === modelId) || MAC_MODELS[0];
    const specCpu = document.getElementById("spec-cpu");
    const specBoardId = document.getElementById("spec-boardid");
    const specRecommended = document.getElementById("spec-recommended");

    if (specCpu) specCpu.textContent = modelObj.cpuFamily;
    if (specBoardId) specBoardId.textContent = modelObj.boardId;
    if (specRecommended) specRecommended.textContent = modelObj.recommendedFor;
  }

  // Render Identity to Input Fields
  function renderIdentity(idObj) {
    currentIdentity = idObj;

    const elModel = document.getElementById("field-model");
    const elSerial = document.getElementById("field-serial");
    const elMlb = document.getElementById("field-mlb");
    const elUuid = document.getElementById("field-uuid");
    const elMac = document.getElementById("field-mac");
    const elRomB64 = document.getElementById("field-rom-b64");
    const elAppleCoverage = document.getElementById("btn-apple-coverage");

    if (elModel) elModel.value = idObj.model;
    if (elSerial) elSerial.value = idObj.serialNumber;
    if (elMlb) elMlb.value = idObj.mlb;
    if (elUuid) elUuid.value = idObj.uuid;
    if (elMac) elMac.value = idObj.rom.macFormatted;
    if (elRomB64) elRomB64.value = idObj.rom.base64;

    if (elAppleCoverage) {
      elAppleCoverage.href = `https://checkcoverage.apple.com/?locale=en_US&sn=${idObj.serialNumber}`;
    }

    updatePlistPreview();
  }

  // Generate New Identity
  function generateNew() {
    currentIdentity = spooferEngine.generateIdentity(currentModel);
    renderIdentity(currentIdentity);
    showToast(`Generated credentials for ${currentIdentity.model}`);
  }

  // Plist XML Generator
  const plistEditor = document.getElementById("plist-editor");
  function updatePlistPreview() {
    if (!plistEditor) return;
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PlatformInfo</key>
  <dict>
    <key>Automatic</key>
    <true/>
    <key>CustomMemory</key>
    <false/>
    <key>Generic</key>
    <dict>
      <key>AdviseFeatures</key>
      <false/>
      <key>MaxBIOSVersion</key>
      <false/>
      <key>MLB</key>
      <string>${currentIdentity.mlb}</string>
      <key>ProcessorType</key>
      <integer>${currentIdentity.processorTypeDecimal}</integer>
      <key>ROM</key>
      <data>${currentIdentity.rom.base64}</data>
      <key>SpoofVendor</key>
      <true/>
      <key>SystemMemoryStatus</key>
      <string>Auto</string>
      <key>SystemProductName</key>
      <string>${currentIdentity.model}</string>
      <key>SystemSerialNumber</key>
      <string>${currentIdentity.serialNumber}</string>
      <key>SystemUUID</key>
      <string>${currentIdentity.uuid}</string>
    </dict>
    <key>UpdateDataHub</key>
    <true/>
    <key>UpdateNVRAM</key>
    <true/>
    <key>UpdateSMBIOS</key>
    <true/>
    <key>UpdateSMBIOSMode</key>
    <string>Create</string>
    <key>UseRawUuidEncoding</key>
    <false/>
  </dict>
</dict>
</plist>`;
    plistEditor.value = xml;
  }

  // Event Listeners
  if (modelSelect) {
    modelSelect.addEventListener("change", (e) => {
      currentModel = e.target.value;
      updateModelSpecs(currentModel);
      generateNew();
    });
  }

  const btnGenerate = document.getElementById("btn-generate");
  if (btnGenerate) {
    btnGenerate.addEventListener("click", generateNew);
  }

  const btnCopyAll = document.getElementById("btn-copy-all");
  if (btnCopyAll) {
    btnCopyAll.addEventListener("click", () => {
      const json = JSON.stringify(currentIdentity, null, 2);
      window.copyText(json, "Identity JSON copied to clipboard");
    });
  }

  const btnCopyPlist = document.getElementById("btn-copy-plist");
  if (btnCopyPlist && plistEditor) {
    btnCopyPlist.addEventListener("click", () => {
      window.copyText(plistEditor.value, "config.plist XML copied");
    });
  }

  const btnDownloadPlist = document.getElementById("btn-download-plist");
  if (btnDownloadPlist && plistEditor) {
    btnDownloadPlist.addEventListener("click", () => {
      const blob = new Blob([plistEditor.value], { type: "application/xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "config.plist";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Downloaded config.plist");
    });
  }

  // Mobile Drawer
  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const drawerBackdrop = document.getElementById("drawer-backdrop");
  const drawerClose = document.getElementById("drawer-close");

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add("open");
    if (drawerBackdrop) drawerBackdrop.classList.add("active");
  }

  window.closeDrawer = function() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (drawerBackdrop) drawerBackdrop.classList.remove("active");
  };

  if (mobileToggle) mobileToggle.addEventListener("click", openDrawer);
  if (drawerClose) drawerClose.addEventListener("click", window.closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener("click", window.closeDrawer);

  // Initialize
  populateModels();
  updateModelSpecs(currentModel);
  renderIdentity(currentIdentity);
});
