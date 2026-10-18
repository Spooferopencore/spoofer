# SpooferOpencore

**SpooferOpencore** is a clean, modern, light-mode OpenCore SMBIOS and hardware identity generator web application. It features a simplified, zero-clutter interface compatible with both desktop and mobile devices.

---

## Direct Download

- **Desktop Release**: [Download SpooferOpencore.zip](https://github.com/Spooferopencore/spoofer/releases/download/SpooferOpencore/SpooferOpencore.zip)
- Direct release package for offline OpenCore identity generation and EFI patching.

---

## Features

- **Clean Light Mode Interface**:
  - Crisp, minimalist Apple-style aesthetic with white card containers, clear typography, and zero extraneous clutter.
  - Fully responsive on both desktop monitors and mobile devices with a dedicated mobile drawer menu.

- **Fast SMBIOS Identity Generation**:
  - Instant generation of authentic Apple serial numbers (12 characters), logic board MLBs (17 characters), RFC 4122 v4 SystemUUIDs, and ROM MAC addresses.
  - One-click copy buttons for every field with toast confirmation.
  - Direct link to verify generated serials on Apple's official Check Coverage service.

- **OpenCore `config.plist` Sync**:
  - Automatically synchronizes generated credentials into a standard `PlatformInfo -> Generic` XML block.
  - Download as `config.plist` or copy directly to clipboard.

---

## File Structure

```
/Users/admin/Desktop/SpooferOpencore/
├── index.html          # Clean light mode interface & embedded download links
├── css/
│   └── style.css       # Clean light design system & responsive mobile rules
├── js/
│   ├── mac-models.js   # Curated Apple hardware profiles & board IDs
│   ├── spoofer-engine.js # Cryptographic generator engine
│   └── app.js          # Lightweight UI controller & clipboard handlers
└── README.md           # Documentation
```

---

## Running Locally

Run directly with Python 3 or any local HTTP server:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080` in your web browser.
