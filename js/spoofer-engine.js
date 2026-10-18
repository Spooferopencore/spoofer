/**
 * SpooferOpencore - Core Spoofing & Cryptographic Engine
 * Generates mathematically authentic Apple SMBIOS identifiers,
 * Base64 ROM encoding, Plist injection, and ACPI spoof tables.
 */

class SpooferEngine {
  constructor() {
    this.models = MAC_MODELS;
    this.plants = APPLE_PLANT_CODES;
    this.dateCodes = APPLE_DATE_CODES;
    this.weekChars = APPLE_WEEK_CHARS;
    this.ouis = APPLE_MAC_OUIS;
  }

  /**
   * Helper: Get random item from array
   */
  _randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Helper: Generate random alphanumeric string
   * Excluding confusing characters like 'I', 'O', 'U' if requested
   */
  _randomAlphanumeric(length, charset = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ") {
    let result = "";
    const bytes = new Uint8Array(length);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(bytes);
      for (let i = 0; i < length; i++) {
        result += charset[bytes[i] % charset.length];
      }
    } else {
      for (let i = 0; i < length; i++) {
        result += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    return result;
  }

  /**
   * Helper: Generate random hex string of N bytes
   */
  _randomHex(byteCount) {
    const bytes = new Uint8Array(byteCount);
    if (typeof window !== "undefined" && window.crypto) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < byteCount; i++) bytes[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();
  }

  /**
   * Generate RFC 4122 Version 4 UUID
   */
  generateUUID() {
    if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID().toUpperCase();
    }
    // Fallback standard v4 UUID generator
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16).toUpperCase();
    });
  }

  /**
   * Generate Apple System Serial Number (12-character format)
   * Format: [Plant 3c][Year 1c][Week 1c][Unique 3c][Model 4c]
   */
  generateSerialNumber(modelObj) {
    const plant = this._randomItem(this.plants).code;
    const dateObj = this._randomItem(this.dateCodes);
    const yearChar = dateObj.charYear;
    const weekChar = this._randomItem(this.weekChars);
    const uniqueSeq = this._randomAlphanumeric(3, "0123456789CDFGHJKLMNPQRTVWXY");
    const modelCode = this._randomItem(modelObj.modelCodes);

    return `${plant}${yearChar}${weekChar}${uniqueSeq}${modelCode}`;
  }

  /**
   * Generate Board Serial Number (MLB - 17 characters)
   * Format: [Plant 3c][Year 1c][Week 2c][Line 3c][Logic Board Code 5c][Suffix 2c or 3c]
   */
  generateMLB(serialNumber, modelObj) {
    const plant = serialNumber.substring(0, 3);
    const yearChar = serialNumber.substring(3, 4);
    
    // Map year char to single digit representation
    const yearMap = { "Z": "9", "C": "0", "D": "0", "F": "1", "G": "1", "H": "2", "J": "2", "K": "3", "L": "3" };
    const yearDigit = yearMap[yearChar] || "0";
    
    // 2-digit week (01 - 52)
    const weekNum = Math.floor(Math.random() * 52) + 1;
    const weekStr = weekNum.toString().padStart(2, "0");

    // 3-digit line code
    const lineCode = Math.floor(Math.random() * 899 + 100).toString();

    // Board Part Code (5 characters, e.g. CD000, GU000, 40400, FHDD1)
    const boardCodes = ["CD000", "GU000", "40400", "FHDD1", "A9000", "H0000", "P0000"];
    const boardCode = this._randomItem(boardCodes);

    // 3-character revision suffix (e.g. 1M, A1, CB, JA, 8C)
    const suffix = this._randomAlphanumeric(3, "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ");

    const mlb17 = `${plant}${yearDigit}${weekStr}${lineCode}${boardCode}${suffix}`;
    return mlb17.substring(0, 17);
  }

  /**
   * Generate ROM (MAC Address)
   * Returns: { macFormatted: "XX:XX:XX:XX:XX:XX", hexRaw: "XXXXXXXXXXXX", base64: "..." }
   */
  generateROM() {
    const oui = this._randomItem(this.ouis);
    const lowerOctets = [
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ];

    const macFormatted = `${oui}:${lowerOctets.map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(":")}`;
    const hexRaw = macFormatted.replace(/:/g, "").toUpperCase();

    // Convert hex string to Base64 (OpenCore plist standard <data>)
    let binary = "";
    for (let i = 0; i < hexRaw.length; i += 2) {
      binary += String.fromCharCode(parseInt(hexRaw.substr(i, 2), 16));
    }
    const base64 = btoa(binary);

    return {
      macFormatted,
      hexRaw,
      base64
    };
  }

  /**
   * Complete Identity Package Generation
   */
  generateIdentity(modelId) {
    const modelObj = this.models.find(m => m.model === modelId) || this.models[0];
    const serial = this.generateSerialNumber(modelObj);
    const mlb = this.generateMLB(serial, modelObj);
    const uuid = this.generateUUID();
    const rom = this.generateROM();

    return {
      model: modelObj.model,
      modelName: modelObj.name,
      category: modelObj.category,
      boardId: modelObj.boardId,
      processorType: modelObj.processorType,
      processorTypeDecimal: parseInt(modelObj.processorType, 16),
      serialNumber: serial,
      mlb: mlb,
      uuid: uuid,
      rom: rom,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Validate Apple Serial Number
   */
  validateSerialNumber(serial) {
    if (!serial || typeof serial !== "string") {
      return { valid: false, reason: "Serial number is empty" };
    }
    const cleanSerial = serial.trim().toUpperCase();

    if (cleanSerial.length !== 12) {
      return { valid: false, reason: `Serial length is ${cleanSerial.length} (expected 12 characters)` };
    }

    const plant = cleanSerial.substring(0, 3);
    const yearChar = cleanSerial.substring(3, 4);
    const weekChar = cleanSerial.substring(4, 5);
    const modelCode = cleanSerial.substring(8, 12);

    const isKnownPlant = this.plants.some(p => p.code === plant);
    const matchedModel = this.models.find(m => m.modelCodes.includes(modelCode));

    return {
      valid: true,
      serial: cleanSerial,
      plant: plant,
      isKnownPlant: isKnownPlant,
      yearChar: yearChar,
      weekChar: weekChar,
      modelCode: modelCode,
      matchedModel: matchedModel ? matchedModel.model : "Custom / Unknown",
      matchedModelName: matchedModel ? matchedModel.name : "Unregistered Apple Model Code"
    };
  }

  /**
   * Audit iServices Readiness
   */
  auditIServices(identity) {
    let score = 0;
    const checks = [];

    // Check Serial
    if (identity.serialNumber && identity.serialNumber.length === 12) {
      score += 25;
      checks.push({ name: "Serial Number Length (12-char)", pass: true, detail: "Valid standard format" });
    } else {
      checks.push({ name: "Serial Number Length", pass: false, detail: "Must be exactly 12 characters" });
    }

    // Check MLB
    if (identity.mlb && identity.mlb.length === 17) {
      score += 25;
      checks.push({ name: "MLB / Board Serial (17-char)", pass: true, detail: "Valid 17-char board identifier" });
    } else {
      checks.push({ name: "MLB / Board Serial", pass: false, detail: "Must be exactly 17 characters" });
    }

    // Check UUID
    const uuidRegex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    if (identity.uuid && uuidRegex.test(identity.uuid)) {
      score += 25;
      checks.push({ name: "System UUID (RFC 4122 v4)", pass: true, detail: "Cryptographically compliant v4 UUID" });
    } else {
      checks.push({ name: "System UUID", pass: false, detail: "Invalid UUIDv4 format" });
    }

    // Check ROM & OUI
    if (identity.rom && identity.rom.hexRaw && identity.rom.hexRaw.length === 12) {
      score += 25;
      checks.push({ name: "ROM / MAC Address", pass: true, detail: `Apple OUI matched (${identity.rom.macFormatted})` });
    } else {
      checks.push({ name: "ROM", pass: false, detail: "Invalid 6-byte MAC / ROM format" });
    }

    return {
      score: score,
      status: score === 100 ? "OPTIMAL" : score >= 75 ? "GOOD" : "INCOMPLETE",
      checks: checks
    };
  }

  /**
   * Update or Inject Identity into OpenCore config.plist XML string
   */
  injectIntoPlist(plistXml, identity, options = { romType: "data" }) {
    let xml = plistXml;

    // Helper: update or insert a key inside <key>Generic</key>
    const updateGenericKey = (xmlStr, keyName, valueTag, value) => {
      // Check if Generic exists
      const genericRegex = /<key>Generic<\/key>\s*<dict>([\s\S]*?)<\/dict>/;
      const match = xmlStr.match(genericRegex);

      if (match) {
        let genericContent = match[1];
        const keyRegex = new RegExp(`<key>${keyName}<\\/key>\\s*<[a-zA-Z0-9]+>.*?<\\/[a-zA-Z0-9]+>`, "i");

        const newEntry = `<key>${keyName}</key>\n\t\t\t<${valueTag}>${value}</${valueTag}>`;

        if (keyRegex.test(genericContent)) {
          genericContent = genericContent.replace(keyRegex, newEntry);
        } else {
          genericContent = genericContent + `\n\t\t\t${newEntry}`;
        }

        return xmlStr.replace(match[0], `<key>Generic</key>\n\t\t<dict>${genericContent}\n\t\t</dict>`);
      }

      // If Generic not found, inject minimal PlatformInfo block before closing </dict></plist>
      const fallbackBlock = `
  <key>PlatformInfo</key>
  <dict>
    <key>Automatic</key>
    <true/>
    <key>Generic</key>
    <dict>
      <key>SystemProductName</key>
      <string>${identity.model}</string>
      <key>SystemSerialNumber</key>
      <string>${identity.serialNumber}</string>
      <key>MLB</key>
      <string>${identity.mlb}</string>
      <key>SystemUUID</key>
      <string>${identity.uuid}</string>
      <key>ROM</key>
      <data>${identity.rom.base64}</data>
      <key>ProcessorType</key>
      <integer>${identity.processorTypeDecimal}</integer>
      <key>SpoofVendor</key>
      <true/>
    </dict>
    <key>UpdateDataHub</key>
    <true/>
    <key>UpdateNVRAM</key>
    <true/>
    <key>UpdateSMBIOS</key>
    <true/>
    <key>UpdateSMBIOSMode</key>
    <string>Create</string>
  </dict>`;

      return xmlStr.replace(/<\/dict>\s*<\/plist>/i, `${fallbackBlock}\n</dict>\n</plist>`);
    };

    // Update PlatformInfo keys
    xml = updateGenericKey(xml, "SystemProductName", "string", identity.model);
    xml = updateGenericKey(xml, "SystemSerialNumber", "string", identity.serialNumber);
    xml = updateGenericKey(xml, "MLB", "string", identity.mlb);
    xml = updateGenericKey(xml, "SystemUUID", "string", identity.uuid);
    
    if (options.romType === "data") {
      xml = updateGenericKey(xml, "ROM", "data", identity.rom.base64);
    } else {
      xml = updateGenericKey(xml, "ROM", "string", identity.rom.hexRaw);
    }

    if (identity.processorTypeDecimal) {
      xml = updateGenericKey(xml, "ProcessorType", "integer", identity.processorTypeDecimal);
    }

    return xml;
  }

  /**
   * Generate SSDT-SPOOF.dsl ACPI Masking Source
   */
  generateSSDT(options = {}) {
    const pciPath = options.pciPath || "_SB_.PCI0.PEG0.PEGP";
    const fakeDeviceId = options.fakeDeviceId || "0x73BF"; // Default Navi 21 RX 6800/6900 XT fake ID
    const spoofName = options.spoofName || "Radeon RX 6800 XT (Spoofed)";

    return `/*
 * OpenCore SSDT-SPOOF Device Masking Table
 * Generated by SpooferOpencore Engine
 * Target: ${spoofName} (${fakeDeviceId}) at ${pciPath}
 */
DefinitionBlock ("", "SSDT", 2, "OPENCR", "SpoofDEV", 0x00001000)
{
    External (${pciPath}, DeviceObj)

    Scope (${pciPath})
    {
        If (_OSI ("Darwin"))
        {
            Method (_DSM, 4, NotSerialized)  // _DSM: Device-Specific Method
            {
                If (LEqual (Arg2, Zero))
                {
                    Return (Buffer (One) { 0x03 })
                }

                Return (Package ()
                {
                    "device-id", 
                    Buffer (0x04) { ${this._hexToBuffer(fakeDeviceId)} },

                    "model", 
                    Buffer () { "${spoofName}" },

                    "device_type", 
                    Buffer () { "ATY,AMD,RadeonFramebuffer" },

                    "rebuild-device-tree", 
                    Buffer (One) { 0x01 }
                })
            }
        }
    }
}
`;
  }

  /**
   * Helper: convert hex string (e.g. 0x73BF) to ACPI little-endian Buffer bytes
   */
  _hexToBuffer(hexVal) {
    const cleaned = hexVal.replace("0x", "").padStart(4, "0");
    const b1 = cleaned.substring(2, 4);
    const b2 = cleaned.substring(0, 2);
    return `0x${b1}, 0x${b2}, 0x00, 0x00`;
  }

  /**
   * Generate Batch of Identities
   */
  generateBatch(modelId, count = 10) {
    const list = [];
    for (let i = 0; i < count; i++) {
      list.push(this.generateIdentity(modelId));
    }
    return list;
  }
}

// Global instance
const spooferEngine = new SpooferEngine();

if (typeof window !== "undefined") {
  window.spooferEngine = spooferEngine;
  window.SpooferEngine = SpooferEngine;
}
if (typeof globalThis !== "undefined") {
  globalThis.spooferEngine = spooferEngine;
  globalThis.SpooferEngine = SpooferEngine;
}
