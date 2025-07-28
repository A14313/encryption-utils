# @a14313/encryption-utils

A lightweight and easy-to-use encryption/decryption utility for Node.js using AES (default `aes-256-cbc`) and the built-in `crypto` module.

---

## Features

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

Dont worry about the `iv` being returned. It is needed for decrypting the data on your other service. Even when an attacker gets the `iv`, it is unique in every encryption 😉. This prevents the producing of `identical plaintext blocks` [_Learn more about plaintext blocks_](https://www.sciencedirect.com/topics/computer-science/plaintext-block). <br />
Plus, the attacker needs the password and salt. So keep it on the secrets manager or .env.

## 🚨 Important

> Generate a strong password and salt using crypto and save it on your environment (.env) or secrets manager (recommended).

### How to generate a secure password and salt

_You should have a nodejs or nvm installed on your machine._

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
