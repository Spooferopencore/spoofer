# SpooferOpencore

**SpooferOpencore** is a precision, client-side OpenCore SMBIOS and hardware identity spoofing web application. Designed for Hackintosh enthusiasts, macOS virtualization researchers, and bootloader engineers, it generates mathematically authentic Apple serial numbers, logic board MLBs, RFC 4122 v4 UUIDs, and Apple OUI-authenticated MAC ROMs, while providing direct live injection into OpenCore `config.plist` files.

---

## Key Features

- **Apple SMBIOS Engine**:
  - Over 40 verified Apple SMBIOS profiles (iMac, Mac Pro, Mac mini, MacBook Pro, MacBook Air, Mac Studio).
  - Genuine 12-character Apple Serial Number generation algorithm (valid factory plant codes, production year/week letters, and model code matching).
  - Authentic 17-character Board Serial Number (MLB) generator tied to manufacturing line codes and logic board parts.
  - Cryptographically secure RFC 4122 Version 4 `SystemUUID`.
  - Apple OUI-based MAC address generator with raw Hex and Base64 `<data>` encoding for OpenCore XML plists.

- **OpenCore `config.plist` Live Injector & XML Editor**:
  - Preloaded architecture presets (Intel 10th Gen Comet Lake, AMD Ryzen 3000/5000/7000, Intel 8th/9th Gen Laptops).
  - Upload custom `config.plist` files with drag-and-drop or file picker.
  - One-click injection into `PlatformInfo -> Generic` (`SystemProductName`, `SystemSerialNumber`, `MLB`, `SystemUUID`, `ROM`, `ProcessorType`).
  - Direct `.plist` file download and XML clipboard copy.

- **ACPI & Hardware ID Masking**:
  - **SSDT-SPOOF Generator**: Generate ACPI Source Language (`.dsl`) tables to spoof unsupported or OEM GPUs (e.g., AMD Navi 21 RX 6800/6900 XT fake ID `0x73BF`, RX 550 Polaris `0x67FF`, Intel UHD 630).
  - **MAC / Network HWID Masking**: Randomize primary network adapter (`en0`) MAC addresses using verified Apple Organizationally Unique Identifiers (OUIs) and generate macOS Terminal commands (`sudo ifconfig en0 ether ...`).

- **Apple iServices Readiness Audit**:
  - Real-time cryptographic compliance and formatting audit score (0-100%).
  - Checks for Serial length, MLB consistency, UUIDv4 compliance, and ROM format.
  - Step-by-step troubleshooting checklist for iCloud, iMessage, and FaceTime activation.

- **Batch Generation & Export**:
  - Generate bulk identity sets (5, 10, 25, 50 profiles) in a single run.
  - Searchable, responsive data table with individual quick-copy buttons.
  - Export batch credentials to `.csv` or `.json`.

- **Responsive Mobile & Desktop Design**:
  - Cyber-glass aesthetic with deep obsidian tones, electric cyan and neon purple accents, glassmorphic cards, and tactile Web Audio API sound synthesis.
  - Mobile drawer navigation with responsive touch targets and clean column collapsing.
  - Keyboard shortcuts (`G` to generate, `C` to copy serial, `1-6` to switch tabs).

---

## File Structure

```
/Users/admin/Desktop/SpooferOpencore/
├── index.html          # Semantic HTML5 layout and interactive workbench
├── css/
│   └── style.css       # Responsive cyber-glass design system & mobile queries
├── js/
│   ├── mac-models.js   # Apple hardware database, board IDs, and presets
│   ├── spoofer-engine.js # Cryptographic serial, MLB, UUID, ROM, plist & SSDT engine
│   └── app.js          # UI controller, audio synthesis, events, and exports
└── README.md           # Documentation and usage guide
```

---

## Quick Start / Running Locally

Since SpooferOpencore is built with pure Vanilla HTML5, CSS3, and JavaScript, it requires no build steps or dependencies.

You can run it directly using any local web server:

```bash
# Using Python 3
python3 -m http.server 8080

# Using Node.js (npx serve)
npx -y serve .
```

Then open `http://localhost:8080` (or `http://localhost:3000`) in any modern desktop or mobile browser.
