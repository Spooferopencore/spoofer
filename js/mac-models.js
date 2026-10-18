/**
 * SpooferOpencore - Apple SMBIOS & Hardware Database
 * Contains authentic Apple hardware metadata, Board IDs, Model Codes,
 * Processor Types, and Valid OUIs for OpenCore SMBIOS generation.
 */

const MAC_MODELS = [
  // iMac
  {
    model: "iMac20,2",
    name: "iMac (Retina 5K, 27-inch, 2020) - i9",
    category: "Desktop",
    boardId: "Mac-AF89B6B845142378",
    cpuFamily: "Intel 10th Gen Core i9 (Comet Lake)",
    processorType: "0x0F01",
    modelCodes: ["0D6V", "0D6W", "0D6X", "0D6Y"],
    recommendedFor: "Intel 10th/11th/12th/13th Gen Desktop with dGPU (RX 5000/6000)",
    year: "2020",
    maxOS: "macOS Sonoma / Sequoia",
    chassisType: "0x09"
  },
  {
    model: "iMac20,1",
    name: "iMac (Retina 5K, 27-inch, 2020) - i5/i7",
    category: "Desktop",
    boardId: "Mac-CFF7D910A743CAAF",
    cpuFamily: "Intel 10th Gen Core i5/i7 (Comet Lake)",
    processorType: "0x0F01",
    modelCodes: ["0D6P", "0D6Q", "0D6R", "0D6S"],
    recommendedFor: "Intel 10th Gen Desktop with iGPU UHD 630 or AMD dGPU",
    year: "2020",
    maxOS: "macOS Sonoma / Sequoia",
    chassisType: "0x09"
  },
  {
    model: "iMac19,1",
    name: "iMac (Retina 5K, 27-inch, 2019)",
    category: "Desktop",
    boardId: "Mac-AA95B1DDAB278B95",
    cpuFamily: "Intel 9th Gen Core i5/i9 (Coffee Lake Refresh)",
    processorType: "0x0901",
    modelCodes: ["JV3N", "JV3P", "JV3Q", "JV3R"],
    recommendedFor: "Intel 8th/9th Gen Coffee Lake Desktop + AMD dGPU",
    year: "2019",
    maxOS: "macOS Sonoma",
    chassisType: "0x09"
  },
  {
    model: "iMac18,3",
    name: "iMac (Retina 5K, 27-inch, 2017)",
    category: "Desktop",
    boardId: "Mac-BE088AF8C5EB4FA2",
    cpuFamily: "Intel 7th Gen Core i5/i7 (Kaby Lake)",
    processorType: "0x0901",
    modelCodes: ["J1G5", "J1G6", "J1G7", "J1G8"],
    recommendedFor: "Intel 7th Gen Kaby Lake Desktop with dGPU",
    year: "2017",
    maxOS: "macOS Ventura",
    chassisType: "0x09"
  },
  {
    model: "iMacPro1,1",
    name: "iMac Pro (2017)",
    category: "Workstation",
    boardId: "Mac-7BA5B2D9E42DDD94",
    cpuFamily: "Intel Xeon W (Skylake-X)",
    processorType: "0x0F01",
    modelCodes: ["HX87", "HX88", "HX89", "HX8C"],
    recommendedFor: "Intel X299, AMD Ryzen (without iGPU), High Core Count PCs with dGPU",
    year: "2017",
    maxOS: "macOS Sonoma / Sequoia",
    chassisType: "0x09"
  },

  // Mac Pro
  {
    model: "MacPro7,1",
    name: "Mac Pro (2019, Rack / Tower)",
    category: "Workstation",
    boardId: "Mac-27AD2F918AE68F61",
    cpuFamily: "Intel Xeon W (Cascade Lake)",
    processorType: "0x0A01",
    modelCodes: ["K3F7", "K3F8", "K3F9", "P7QM"],
    recommendedFor: "AMD Ryzen (Threadripper / 3000 / 5000 / 7000) & Intel X99/X299 with dGPU",
    year: "2019",
    maxOS: "macOS Sonoma / Sequoia",
    chassisType: "0x07"
  },

  // Mac mini
  {
    model: "Macmini8,1",
    name: "Mac mini (2018)",
    category: "Mini Desktop",
    boardId: "Mac-7BA5B2DFE22DDD8C",
    cpuFamily: "Intel 8th Gen Core i3/i5/i7 (Coffee Lake)",
    processorType: "0x0901",
    modelCodes: ["KXPG", "KXPH", "KXPJ", "KXPK"],
    recommendedFor: "Intel 8th/9th/10th Gen mini PCs using iGPU (UHD 630) only",
    year: "2018",
    maxOS: "macOS Sonoma / Sequoia",
    chassisType: "0x10"
  },

  // MacBook Pro
  {
    model: "MacBookPro16,1",
    name: "MacBook Pro (16-inch, 2019)",
    category: "Laptop",
    boardId: "Mac-E7203C0F68AA0004",
    cpuFamily: "Intel 9th Gen Core i7/i9 (Coffee Lake-H)",
    processorType: "0x0905",
    modelCodes: ["MD6N", "MD6P", "MD6Q", "MD6R"],
    recommendedFor: "High performance laptops with 8th/9th/10th Gen Intel + switchable dGPU",
    year: "2019",
    maxOS: "macOS Sonoma / Sequoia",
    chassisType: "0x0A"
  },
  {
    model: "MacBookPro16,4",
    name: "MacBook Pro (16-inch, 2019, 5600M)",
    category: "Laptop",
    boardId: "Mac-A61BADE1FDAD7B05",
    cpuFamily: "Intel 9th/10th Gen Core i9",
    processorType: "0x0905",
    modelCodes: ["NJ79", "NJ7A", "NJ7B"],
    recommendedFor: "Laptops with AMD Radeon RX 5600M / RX 5500M dGPU",
    year: "2020",
    maxOS: "macOS Sonoma / Sequoia",
    chassisType: "0x0A"
  },
  {
    model: "MacBookPro15,2",
    name: "MacBook Pro (13-inch, 2018/2019, 4 TB3)",
    category: "Laptop",
    boardId: "Mac-827FB448E656EC26",
    cpuFamily: "Intel 8th Gen Quad-Core (Coffee Lake-U)",
    processorType: "0x0905",
    modelCodes: ["JH3D", "JH3F", "JH3G", "JH3H"],
    recommendedFor: "Intel 8th Gen Kaby Lake-R / Coffee Lake-U laptops with Iris Plus 655",
    year: "2018",
    maxOS: "macOS Sonoma",
    chassisType: "0x0A"
  },
  {
    model: "MacBookPro15,1",
    name: "MacBook Pro (15-inch, 2018/2019)",
    category: "Laptop",
    boardId: "Mac-937A206F2EE63C01",
    cpuFamily: "Intel 8th/9th Gen 6-Core i7/i9",
    processorType: "0x0905",
    modelCodes: ["JG5H", "JG5J", "JG5K", "JG5L"],
    recommendedFor: "Intel 8th/9th Gen H-Series laptops",
    year: "2018",
    maxOS: "macOS Sonoma",
    chassisType: "0x0A"
  },
  {
    model: "MacBookPro14,1",
    name: "MacBook Pro (13-inch, 2017, 2 TB3)",
    category: "Laptop",
    boardId: "Mac-B4831CEBD5210C4C",
    cpuFamily: "Intel 7th Gen Dual-Core (Kaby Lake-U)",
    processorType: "0x0605",
    modelCodes: ["HV22", "HV29", "HV2C", "HV2D"],
    recommendedFor: "Intel 7th Gen Kaby Lake-U Ultrabooks (Intel HD 620 / Iris 640)",
    year: "2017",
    maxOS: "macOS Ventura",
    chassisType: "0x0A"
  },

  // MacBook Air
  {
    model: "MacBookAir9,1",
    name: "MacBook Air (Retina, 13-inch, 2020)",
    category: "Laptop",
    boardId: "Mac-0CFF9C7C2B63DF8D",
    cpuFamily: "Intel 10th Gen Core i3/i5/i7 (Ice Lake-Y)",
    processorType: "0x0605",
    modelCodes: ["MNHX", "MNHY", "MNH0", "MNH1"],
    recommendedFor: "Intel 10th Gen Ice Lake laptops with Iris Plus G4/G7",
    year: "2020",
    maxOS: "macOS Sonoma / Sequoia",
    chassisType: "0x0A"
  },
  {
    model: "MacBookAir8,2",
    name: "MacBook Air (Retina, 13-inch, 2019)",
    category: "Laptop",
    boardId: "Mac-226CB7964C85179B",
    cpuFamily: "Intel 8th Gen Dual-Core (Amber Lake-Y)",
    processorType: "0x0605",
    modelCodes: ["LYM9", "LYMC", "LYMD"],
    recommendedFor: "Intel 8th Gen ultra-thin laptops with UHD 617",
    year: "2019",
    maxOS: "macOS Sonoma",
    chassisType: "0x0A"
  },

  // Mac Studio (Reference / SMBIOS M-series emulation)
  {
    model: "Mac13,1",
    name: "Mac Studio (M1 Max, 2022)",
    category: "Studio",
    boardId: "Mac-A78C4714A4EC50D7",
    cpuFamily: "Apple M1 Max (ARM64)",
    processorType: "0x1101",
    modelCodes: ["Q6N2", "Q6N3", "Q6N4"],
    recommendedFor: "ARM64 / KVM Virtualization / Reference Identity",
    year: "2022",
    maxOS: "macOS Sequoia",
    chassisType: "0x10"
  }
];

// Valid Apple Plant Codes (First 3 digits of 12-char serial)
const APPLE_PLANT_CODES = [
  { code: "C02", location: "TechCom / Quanta Computer (China)" },
  { code: "FVF", location: "Foxconn (Zhengzhou, China)" },
  { code: "D25", location: "Foxconn (Chengdu, China)" },
  { code: "C07", location: "Quanta Computer (Shanghai, China)" },
  { code: "W88", location: "Foxconn (Shenzhen, China)" },
  { code: "G86", location: "Pegatron (Shanghai, China)" },
  { code: "F5K", location: "Foxconn (China, Refurbished / Service)" },
  { code: "CK2", location: "Foxconn (Cork, Ireland)" }
];

// Valid Apple Year & Week encoding characters (Characters 4 & 5)
// Apple uses alphanumeric code for half-year and week
const APPLE_DATE_CODES = [
  { charYear: "Z", year: 2019, half: 2 },
  { charYear: "C", year: 2020, half: 1 },
  { charYear: "D", year: 2020, half: 2 },
  { charYear: "F", year: 2021, half: 1 },
  { charYear: "G", year: 2021, half: 2 },
  { charYear: "H", year: 2022, half: 1 },
  { charYear: "J", year: 2022, half: 2 },
  { charYear: "K", year: 2023, half: 1 },
  { charYear: "L", year: 2023, half: 2 }
];

// Apple Week letters inside a half-year (1 to 27)
const APPLE_WEEK_CHARS = [
  "1","2","3","4","5","6","7","8","9",
  "C","D","F","G","H","J","K","L","M",
  "N","P","Q","R","T","V","W","X","Y"
];

// Genuine Apple MAC Address OUIs (first 3 octets)
const APPLE_MAC_OUIS = [
  "00:17:F2",
  "00:1C:B3",
  "00:1F:5B",
  "00:23:12",
  "00:25:00",
  "00:26:BB",
  "10:9A:DD",
  "14:10:9F",
  "3C:07:54",
  "40:6C:8F",
  "54:26:96",
  "60:03:08",
  "70:56:81",
  "88:66:5A",
  "A4:83:E7",
  "AC:DE:48",
  "BC:92:6B",
  "C8:69:CD",
  "E0:AC:CB",
  "F4:5C:89"
];

// Preconfigured OpenCore config.plist presets for one-click testing
const OC_PRESETS = {
  "comet_lake": {
    name: "Intel 10th Gen Desktop (Comet Lake - iMac20,1)",
    model: "iMac20,1",
    bootArgs: "-v keepsyms=1 debug=0x100 alcid=1",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Booter</key>
  <dict>
    <key>Quirks</key>
    <dict>
      <key>AvoidRuntimeDefrag</key>
      <true/>
      <key>DevirtualiseMmio</key>
      <true/>
      <key>EnableSafeModeSlide</key>
      <true/>
      <key>ProtectUefiServices</key>
      <true/>
      <key>RebuildAppleMemoryMap</key>
      <true/>
      <key>SetupVirtualMap</key>
      <false/>
      <key>SyncRuntimePermissions</key>
      <true/>
    </dict>
  </dict>
  <key>NVRAM</key>
  <dict>
    <key>Add</key>
    <dict>
      <key>7C436110-AB2A-4BBB-A880-FE41995C9F82</key>
      <dict>
        <key>boot-args</key>
        <string>-v keepsyms=1 debug=0x100 alcid=1</string>
        <key>csr-active-config</key>
        <data>AAAAAA==</data>
        <key>prev-lang:kbd</key>
        <string>en-US:0</string>
      </dict>
    </dict>
  </dict>
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
      <string>C02025102CD0000A1</string>
      <key>ProcessorType</key>
      <integer>3841</integer>
      <key>ROM</key>
      <data>AAEX8AAA</data>
      <key>SpoofVendor</key>
      <true/>
      <key>SystemMemoryStatus</key>
      <string>Auto</string>
      <key>SystemProductName</key>
      <string>iMac20,1</string>
      <key>SystemSerialNumber</key>
      <string>C02DN0X90D6P</string>
      <key>SystemUUID</key>
      <string>A5B83C7E-2F30-410E-91C7-B9A34DE9528C</string>
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
</plist>`
  },
  "ryzen_desktop": {
    name: "AMD Ryzen 3000/5000/7000 (MacPro7,1)",
    model: "MacPro7,1",
    bootArgs: "-v keepsyms=1 debug=0x100 npci=0x2000 alcid=1 agdpmod=pikera",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PlatformInfo</key>
  <dict>
    <key>Automatic</key>
    <true/>
    <key>Generic</key>
    <dict>
      <key>AdviseFeatures</key>
      <false/>
      <key>MLB</key>
      <string>F5K931405GUFHDD1M</string>
      <key>ProcessorType</key>
      <integer>3841</integer>
      <key>ROM</key>
      <data>ESIzRFVm</data>
      <key>SpoofVendor</key>
      <true/>
      <key>SystemProductName</key>
      <string>MacPro7,1</string>
      <key>SystemSerialNumber</key>
      <string>F5KZ905YP7QM</string>
      <key>SystemUUID</key>
      <string>3A9D9871-E922-4B44-934C-30D8A56DF75E</string>
    </dict>
    <key>UpdateDataHub</key>
    <true/>
    <key>UpdateNVRAM</key>
    <true/>
    <key>UpdateSMBIOS</key>
    <true/>
    <key>UpdateSMBIOSMode</key>
    <string>Create</string>
  </dict>
</dict>
</plist>`
  },
  "laptop_coffeelake": {
    name: "Intel Laptop 8th/9th Gen (MacBookPro16,1)",
    model: "MacBookPro16,1",
    bootArgs: "-v keepsyms=1 debug=0x100 -wegnoegpu alcid=3",
    xml: `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PlatformInfo</key>
  <dict>
    <key>Automatic</key>
    <true/>
    <key>Generic</key>
    <dict>
      <key>AdviseFeatures</key>
      <false/>
      <key>MLB</key>
      <string>C02941300GU00001M</string>
      <key>ProcessorType</key>
      <integer>2309</integer>
      <key>ROM</key>
      <data>3C0754A1</data>
      <key>SpoofVendor</key>
      <true/>
      <key>SystemProductName</key>
      <string>MacBookPro16,1</string>
      <key>SystemSerialNumber</key>
      <string>C02ZJ0Z4MD6N</string>
      <key>SystemUUID</key>
      <string>7B91E230-01C5-430C-A4EF-D0C9985913A1</string>
    </dict>
    <key>UpdateDataHub</key>
    <true/>
    <key>UpdateNVRAM</key>
    <true/>
    <key>UpdateSMBIOS</key>
    <true/>
    <key>UpdateSMBIOSMode</key>
    <string>Create</string>
  </dict>
</dict>
</plist>`
  }
};

// Universal Global Scope Binding
if (typeof window !== "undefined") {
  window.MAC_MODELS = MAC_MODELS;
  window.APPLE_PLANT_CODES = APPLE_PLANT_CODES;
  window.APPLE_DATE_CODES = APPLE_DATE_CODES;
  window.APPLE_WEEK_CHARS = APPLE_WEEK_CHARS;
  window.APPLE_MAC_OUIS = APPLE_MAC_OUIS;
  window.OC_PRESETS = OC_PRESETS;
}
if (typeof globalThis !== "undefined") {
  globalThis.MAC_MODELS = MAC_MODELS;
  globalThis.APPLE_PLANT_CODES = APPLE_PLANT_CODES;
  globalThis.APPLE_DATE_CODES = APPLE_DATE_CODES;
  globalThis.APPLE_WEEK_CHARS = APPLE_WEEK_CHARS;
  globalThis.APPLE_MAC_OUIS = APPLE_MAC_OUIS;
  globalThis.OC_PRESETS = OC_PRESETS;
}
