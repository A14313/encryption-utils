"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app.ts
var app_exports = {};
__export(app_exports, {
  decrypt: () => decrypt,
  encrypt: () => encrypt
});
module.exports = __toCommonJS(app_exports);
var import_crypto = require("crypto");

// src/utils/utils.ts
var isValidPayload = (schema, payload) => {
  const result = schema.safeParse(payload);
  if (!result.success) {
    const errorObj = {
      success: result.success,
      errors: result.error.issues.map((el) => {
        return {
          message: el.message,
          path: el.path
        };
      })
    };
    console.dir(errorObj, { depth: null });
    return errorObj;
  }
  console.log("result", result);
  return { success: result.success, data: result.data };
};

// src/schemas/encryptionOptions.schema.ts
var import_zod = __toESM(require("zod"));
var BaseCryptographyOptions = import_zod.default.object({
  algorithm: import_zod.default.string().trim().optional(),
  password: import_zod.default.string().trim().nonempty("Password is required").min(24, "Password must be minimum of 24 characters"),
  salt: import_zod.default.string().trim().nonempty("salt is required").min(16, "salt must be minimum of 16 characters"),
  keyLength: import_zod.default.number().optional(),
  ivSize: import_zod.default.number().optional()
});
var EncryptionOptions = BaseCryptographyOptions.extend({
  type: import_zod.default.literal("encryption"),
  encodingInput: import_zod.default.literal("utf8").optional(),
  encodingOutput: import_zod.default.enum(["hex", "base64"]).optional()
});
var DecryptionOptions = BaseCryptographyOptions.extend({
  type: import_zod.default.literal("decryption"),
  encodingInput: import_zod.default.enum(["hex", "base64"]).optional(),
  encodingOutput: import_zod.default.literal("utf8").optional()
});
var CryptographyOptionsSchema = import_zod.default.discriminatedUnion("type", [EncryptionOptions, DecryptionOptions]);

// src/app.ts
function encrypt(payload, options) {
  try {
    const isValid = isValidPayload(CryptographyOptionsSchema, options);
    if (!isValid.success) throw new Error("There was an error on the arguments");
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
  try {
    const isValid = isValidPayload(CryptographyOptionsSchema, options);
    if (!isValid.success) throw new Error("There was an error on the arguments");
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