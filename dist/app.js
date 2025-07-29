"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  decrypt: () => decrypt,
  encrypt: () => encrypt
});
module.exports = __toCommonJS(app_exports);
var import_crypto = require("crypto");
function encrypt(payload, options) {
  var _a, _b;
  try {
    if (!payload) {
      throw new Error("Payload is required for the encryption process.");
    }
    if (!((_a = options.password) == null ? void 0 : _a.trim()) || !((_b = options.salt) == null ? void 0 : _b.trim())) {
      throw new Error("Both password and salt are required for encryption.");
    }
    const algorithm = options.algorithm || "aes-256-cbc";
    const encodingInput = options.encodingInput || "utf8";
    const encodingOutput = options.encodingOutput || "hex";
    const keyLength = options.keyLength || 32;
    const ivSize = options.ivSize || 16;
    const key = (0, import_crypto.scryptSync)(options.password, options.salt, keyLength);
    const iv = (0, import_crypto.randomBytes)(ivSize);
    const cipher = (0, import_crypto.createCipheriv)(algorithm, key, iv);
    let encrypted = cipher.update(payload, encodingInput, encodingOutput);
    encrypted += cipher.final(encodingOutput);
    return {
      message: "Encrypted successfully",
      iv: iv.toString(encodingOutput),
      value: encrypted
    };
  } catch (err) {
    const message = err instanceof Error ? `Error encrypting data ${err.message}` : "Unknown error";
    console.error(message);
    throw new Error(message);
  }
}
function decrypt(payload, iv, options) {
  var _a, _b;
  try {
    if (!payload) {
      throw new Error("Payload is required for the decryption process.");
    }
    if (!((_a = options.password) == null ? void 0 : _a.trim()) || !((_b = options.salt) == null ? void 0 : _b.trim())) {
      throw new Error("Both password and salt are required for decryption.");
    }
    const algorithm = options.algorithm || "aes-256-cbc";
    const password = options.password;
    const salt = options.salt;
    const keyLength = options.keyLength || 32;
    const encodingInput = options.encodingInput || "hex";
    const encodingOutput = options.encodingOutput || "utf8";
    const key = (0, import_crypto.scryptSync)(password, salt, keyLength);
    const bufferedIv = Buffer.from(iv, encodingInput);
    const decipher = (0, import_crypto.createDecipheriv)(algorithm, key, bufferedIv);
    let decrypted = decipher.update(payload, encodingInput, encodingOutput);
    decrypted += decipher.final(encodingOutput);
    return decrypted;
  } catch (err) {
    const message = err instanceof Error ? `Error decrypting data. Check the salt or password: ${err.message}` : "Unknown error";
    console.error(message);
    throw new Error(message);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  decrypt,
  encrypt
});
//# sourceMappingURL=app.js.map