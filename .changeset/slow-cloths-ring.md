---
'@a14313/encryption-utils': minor
---

Implement the staticIV and staticKey. This will override the default of having to generate the IV and key.
Implement a EncryptionEncoding enum for the options of encoding
Deprecate the `ivSize` property. Make it not configurable and always fix to 16.
