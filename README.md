# @a14313/encryption-utils

A lightweight and easy-to-use encryption/decryption utility for Node.js using AES (default `aes-256-cbc`) and the built-in `crypto` module.

---

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

| Option           | Type                             | Required | Default     | Description                                                                |
| ---------------- | -------------------------------- | -------- | ----------- | -------------------------------------------------------------------------- |
| `algorithm`      | `string`                         | No       | aes-256-cbc | Encryption algorithm (e.g., `'aes-256-cbc'`).                              |
| `password`       | `string`                         | ✅ Yes   | -           | Password used to derive the encryption/decryption key.                     |
| `salt`           | `string`                         | ✅ Yes   | -           | Salt used in key derivation.                                               |
| `keyLength`      | `number`                         | No       | 32          | Length of the derived key in bytes (`16`, `24`, `32`, etc.).               |
| `ivSize`         | `number`                         | No       | 16          | Size of the IV in bytes (usually `16` for AES).                            |
| `type`           | `'encryption'` \| `'decryption'` | ✅ Yes   | -           | Operation mode to perform. This is required for type discrimination        |
| `encodingInput`  | `'utf8'`                         | No       | `'utf8'`.   | Encoding of the input string. For encryption, `utf8`. For decryption `hex` |
| `encodingOutput` | `'hex'` \| `'base64'`            | No       | `'hex'`.    | Output format of the encrypted string. For decryption, `utf8`.             |

---

### 🔐 Encryption

```TS
import { encrypt } from '@a14313/encryption-utils';

const encrypted = encrypt('hello world', {
    password: 'strong-password',
    salt: 'unique-salt',
    type: 'encryption',
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

```TS
import { decrypt } from '@a14313/encryption-utils';

// Pass the generated "iv" from the encrypted data to the decrypt function or to the service that is decrypting the data. It's like a public key, kind of 😅. The iv will be used to decrypt the data.

const decrypted = decrypt(encrypted.value, encrypted.iv, {
    password: 'strong-password',
    salt: 'unique-salt',
    type: 'decryption',
});

// RETURN: hello world
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

The generated `password` and `salt` should be the same on the service that is decrypting the data, otherwise it will fail.

_**Always put the passwords, salts, and secrets on the environment**_

---

### Happy HACKING 😉
