[![npm version](https://img.shields.io/npm/v/@a14313/encryption-utils)](https://www.npmjs.com/package/@a14313/encryption-utils)

# @a14313/encryption-utils

A lightweight and easy-to-use encryption/decryption utility for Node.js using AES (default `aes-256-cbc`) and the built-in `crypto` module.

---

## Changelogs

Check the [Changelogs](https://github.com/A14313/encryption-utils/blob/main/CHANGELOG.md)

## ✨ Features

- AES-256-CBC encryption by default (customizable)
- Supports configurable encoding, key length, password, salt, and IV size
- Simple API for encrypting and decrypting string payloads
- Uses the `scryptSync` for generation of key
- Written in TypeScript

---

## 📦 Installation

### npm

```bash
npm install @a14313/encryption-utils
```

### pnpm

```bash
pnpm install @a14313/encryption-utils
```

## Usage

## 🔧 Cryptography Options Table

> encrypt(payload: string, options)

> decrypt(payload: string, iv: string, options)

### `options`

| Option           | Type                             | Required | Default     | Description                                                                                                                                                                                         |
| ---------------- | -------------------------------- | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `algorithm`      | `string`                         | No       | aes-256-cbc | Encryption algorithm (e.g., `'aes-256-cfb'`).                                                                                                                                                       |
| `password`       | `string`                         | ✅ Yes   | -           | Password used to derive the encryption/decryption key.                                                                                                                                              |
| `salt`           | `string`                         | ✅ Yes   | -           | Salt used in key derivation.                                                                                                                                                                        |
| `keyLength`      | `number`                         | No       | 32          | Length of the derived key in bytes (`16`, `24`, `32`, etc.).                                                                                                                                        |
| `ivSize`         | `number`                         | No       | 16          | Size of the IV in bytes (usually `16` for AES).                                                                                                                                                     |
| `type`           | `'encryption'` \| `'decryption'` | No       | -           | Operation mode to perform. This is for type discrimination. The type discrimination is managed internally. Check the [1.2.0](https://github.com/A14313/encryption-utils/blob/main/CHANGELOG.md#120) |
| `encodingInput`  | `'utf8'`                         | No       | `'utf8'`.   | Encoding of the input string. For encryption, `utf8`. For decryption `hex`                                                                                                                          |
| `encodingOutput` | `'hex'` \| `'base64'`            | No       | `'hex'`.    | Output format of the encrypted string. For decryption, `utf8`.                                                                                                                                      |
| `includeLogs`    | `boolean`                        | No       | `false`    | If set to `true` this will log the arguments that has been passed on the function.                                                                                                                  |

---

### 🔐 Encryption

For commonJS<br />
`const { encrypt } = require('@a14313/encryption-utils');`

```TS
import { encrypt } from '@a14313/encryption-utils';

const encrypted = encrypt('hello world', {
    password: 'strong-password',
    salt: 'unique-salt',
});

// RETURN:
// {
//     message: 'Encrypted successfully',
//     iv: '33eeecbb0867738956153ebae70307e9',
//     value: 'c63033f6b55bbb8b194626b903d986a0'
// }

```

Dont worry about the `iv` being returned. It is needed for decrypting the data on your other service. Even when an attacker gets the `iv`, it is unique in every encryption 😉. This prevents the producing of `identical plaintext blocks` [_Learn more about plaintext blocks_](https://www.sciencedirect.com/topics/computer-science/plaintext-block). <br />
Plus, the attacker needs the password and salt. So keep it on the secrets manager or .env.

### 🔓 Decryption

For commonJS<br />
`const { decrypt } = require('@a14313/encryption-utils');`

```TS
import { decrypt } from '@a14313/encryption-utils';

// Pass the generated "iv" from the encrypted data to the decrypt function or to the service that is decrypting the data. It's like a public key, kind of 😅. The iv will be used to decrypt the data.

const decrypted = decrypt(encrypted.value, encrypted.iv, {
    password: 'strong-password',
    salt: 'unique-salt',
});

// RETURN: hello world
```

### More examples

Most of the time you wanna encrypt more complicated data types other than string.<br />
What if you want to encrypt a data other than string? A number, boolean, object, array, etc. <br />
Place it on an object 😎.

### 🔐 Encryption

```TS
const sampleObject = {
    stringType: 'Hello, world!',
    numberType: 42,
    booleanType: true,
    nullType: null,
    objectType: {
        nestedKey: 'nestedValue',
    },
    arrayType: [1, 'two', false, null],
    dateType: new Date(),
};
```

Then, stringify the object:

```TS
const encrypted = encrypt(JSON.stringify(sampleObject), {
    password: 'test',
    salt: 'salty',
});
```

Return:

```bash
{
    message: 'Encrypted successfully',
    iv: '3aa2876e83c2b7d232a26ae09070bc00',
    value: '0e7c40d896dfb13f93dfcfc67e0f1b64c458abe44405e005240a6f53a8596df8955a143e740f5e1a4f9c34ed646c356239ce4df67433812212bde4af29820361374bfee977aea02ff0b62db43959859a60d2d7a98ce3a420c08981b4e189810e8913eb9ab0dac62ff9d32e64a373c9317cf548bfdf0fdd7cf34ec78018db7118dcb9612399a0fd3cdc8c5e6a89b92f1d2fedc6478298f3c425a57b4ab82dd9bdd41b8dc72bc2e9aa65606282d240a037111ac1ec1364269c188b244275942a0c17f7c052f67569c4ef7ccb604d263348b7037a0b4f130182cfe0917d1fbcc1fd'
}
```

### 🔓 Decryption

```TS
const decrypted = decrypt(encrypted.value, encrypted.iv, {
    password: 'test',
    salt: 'salty',
});
```

Then, parse the returned string 😎:

```TS
console.log(JSON.parse(decrypted));
```

Return:

```bash
{
    stringType: 'Hello, world!',
    numberType: 42,
    booleanType: true,
    nullType: null,
    objectType: { nestedKey: 'nestedValue' },
    arrayType: [ 1, 'two', false, null ],
    dateType: '2025-07-29T00:43:36.885Z',
}
```

## 🚨 Important

> Generate a strong password and salt using crypto and save it on your environment (.env) or secrets manager (recommended).

### How to generate a secure password and salt

_You should have a [NodeJS](https://nodejs.org/en) or [NVM](https://github.com/nvm-sh/nvm/blob/master/README.md) installed on your machine._

1. Open terminal
2. type `node`. This will enter the node REPL.
3. Type this: `console.log(require('crypto').randomBytes(32).toString('hex'))`
4. It will return something like this: `c02e74c1c3f829e13b298361c39e9df263dc5efb16d0639f00255a86863447e0`
5. Copy it and save on your secrets.
6. Do the same for the salt.

_Note: For passwords it is recommended to have `32` bytes for the length, and `16` bytes for the salt._

The generated `password` and `salt` for encryption should be the same on the service that is decrypting the data, otherwise it will fail.

_**Always put the passwords, salts, and secrets on the environment**_

---

### Happy HACKING 😉

Made by developer for developer. Made with love ❤️
