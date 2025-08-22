import { createCipheriv, randomBytes, scryptSync, createDecipheriv } from 'crypto';
import { type IEncryptionReturn, EncryptionOptionsInput, DecryptionOptionsInput, EncryptionEncoding } from '@/types';
import { isValidPayload } from '@/utils';
import { CryptographyOptionsSchema } from '@/schemas/encryptionOptions.schema';
import CustomError from '@/utils/customError';
import sampleObj from './sampleObj';

/**
 * Encrypts a given payload using the provided encryption or the default is 'AES-256-CBC'.
 * @param {string} payload - The string to be encrypted.
 * @returns {object} An object containing the encrypted value and initialization vector (iv).
 */

export function encrypt(payload: string, options: EncryptionOptionsInput): IEncryptionReturn {
	try {
		// Inject discriminator
		const mergedOptions = {
			...options,
			type: 'encryption',
		} as const;

		const isValid = isValidPayload({
			schema: CryptographyOptionsSchema,
			payload: mergedOptions,
			includeLogs: mergedOptions.includeLogs,
		});
		if (!isValid.success) {
			throw new CustomError('There was an error on the arguments', isValid.errors);
		}

		const algorithm = mergedOptions.algorithm || 'aes-256-cbc';
		const encodingInput = mergedOptions.encodingInput || 'utf8';
		const encodingOutput = mergedOptions.encodingOutput || 'hex';
		const keyLength = mergedOptions.keyLength || 32; // Default key length for AES-256
		const ivSize = 16;

		// Key
		const key = () => {
			if (mergedOptions.password && mergedOptions.salt) {
				const key = scryptSync(mergedOptions.password, mergedOptions.salt, keyLength);
				if (mergedOptions.includeLogs) console.log('Key length:', key.length);
				return key;
			}

			if (mergedOptions.staticKey && mergedOptions.staticKeyEncoding) {
				const key = Buffer.from(mergedOptions.staticKey, mergedOptions.staticKeyEncoding);
				if (mergedOptions.includeLogs) console.log('Key length:', key.length);
				return key;
			}

			throw new CustomError('No provided password and salt or staticKey and staticKeyEncoding');
		};

		// IV
		let iv = randomBytes(ivSize);
		if (mergedOptions.staticIV) {
			if (mergedOptions.includeLogs) {
				console.warn(
					'Warning: Using a static IV for encryption is vulnerable to identical plaintext blocks. Do not use staticIV, use the default instead!',
				);
			}
			iv = Buffer.from(mergedOptions.staticIV, mergedOptions.staticIVEncoding);
		}

		if (mergedOptions.includeLogs && mergedOptions.staticKey && mergedOptions.staticKeyEncoding) {
			console.log('Key length (bytes) overridden by the provided staticKey');
		}

		if (mergedOptions.includeLogs) {
			console.log('Algorithm:', algorithm);
		}

		const cipher = createCipheriv(algorithm, key(), iv);
		let encrypted = cipher.update(payload, encodingInput, encodingOutput);
		encrypted += cipher.final(encodingOutput);

		return {
			message: 'Encrypted successfully',
			...(!mergedOptions.staticIV && {
				iv: iv.toString(encodingOutput),
			}),
			value: encrypted,
		};
	} catch (err) {
		if (err instanceof CustomError) {
			console.error(err.message);
			console.dir(err.data, { depth: 3, colors: true });
			throw err;
		} else if (err instanceof Error) {
			const message = `Error encrypting data ${err.message}`;
			console.error(message, err);
			throw err;
		} else {
			const message = 'Unknown error';
			console.error(message);
			throw err;
		}
	}
}

export function decrypt(payload: string, iv: string, options: DecryptionOptionsInput) {
	try {
		// Inject discriminator
		const mergedOptions = {
			...options,
			type: 'decryption',
		} as const;

		// Validation
		const isValid = isValidPayload({
			schema: CryptographyOptionsSchema,
			payload: mergedOptions,
			includeLogs: mergedOptions.includeLogs,
		});
		if (!isValid.success) {
			throw new CustomError('There was an error on the arguments', isValid.errors);
		}

		const algorithm = mergedOptions.algorithm || 'aes-256-cbc';
		const keyLength = mergedOptions.keyLength || 32;
		const encodingInput = mergedOptions.encodingInput || 'hex';
		const encodingOutput = mergedOptions.encodingOutput || 'utf8';

		const bufferedIv = Buffer.from(iv, mergedOptions.IVEncodingInput || encodingInput);

		// Key
		const key = () => {
			if (mergedOptions.password && mergedOptions.salt) {
				const key = scryptSync(mergedOptions.password, mergedOptions.salt, keyLength);
				if (mergedOptions.includeLogs) console.log('Key length:', key.length);
				return key;
			}

			if (mergedOptions.staticKey && mergedOptions.staticKeyEncoding) {
				const key = Buffer.from(mergedOptions.staticKey, mergedOptions.staticKeyEncoding);
				if (mergedOptions.includeLogs) console.log('Key length:', key.length);
				return key;
			}

			throw new CustomError('No provided password or staticKey');
		};

		if (mergedOptions.includeLogs && mergedOptions.staticKey && mergedOptions.staticKeyEncoding) {
			console.log('Key length (bytes) overridden by the provided staticKey');
		}

		if (mergedOptions.includeLogs) {
			console.log('Algorithm:', algorithm);
		}

		const decipher = createDecipheriv(algorithm, key(), bufferedIv);
		let decrypted = decipher.update(payload, encodingInput, encodingOutput);
		decrypted += decipher.final(encodingOutput);

		return decrypted;
	} catch (err) {
		if (err instanceof CustomError) {
			console.error(err.message);
			console.dir(err.data, { depth: 3, colors: true });
			throw err;
		} else if (err instanceof Error) {
			const message = `Error decrypting data ${err.message}`;
			console.error(message, err);
			throw err;
		} else {
			const message = 'Unknown error';
			console.error(message);
			throw err;
		}
	}
}

const encrypted = encrypt(JSON.stringify(sampleObj), {
	// password:
	// 	'b45dc7863cabd8cb4241d9acc96b5982d34b27847c9f7b658b74c4bc311d5e1bfc099cdf1c1b9356aa6afd995d802c8d6574171318d684848cb0a1fb3f3018a50fcc5de01a75b6a709de163c24a533ae',
	// salt: 'm7QERFMR0V267eOIsgK/Ga4yt3/vMfpOwvon3idxuIY=',
	// staticIV: '8a75c51c0bba4749829335752c4f78e5',
	// staticIVEncoding: EncryptionEncoding.hex,
	staticKey: 'm7QERFMR0V267eOIsgK/Ga4yt3/vMfpOwvon3idxuIY=',
	staticKeyEncoding: EncryptionEncoding.base64,
	// keyLength: 16,
	// algorithm: 'aes-128-cbc',
	encodingOutput: EncryptionEncoding.base64,
	includeLogs: true,
});

// const decrypted = decrypt(encrypted.value, encrypted.iv!, {
// 	password:
// 		'b45dc7863cabd8cb4241d9acc96b5982d34b27847c9f7b658b74c4bc311d5e1bfc099cdf1c1b9356aa6afd995d802c8d6574171318d684848cb0a1fb3f3018a50fcc5de01a75b6a709de163c24a533ae',
// 	salt: 'm7QERFMR0V267eOIsgK/Ga4yt3/vMfpOwvon3idxuIY=',
// 	// staticIVEncodingInput: 'hex',

// 	encodingInput: EncryptionEncoding.base64,
// 	// staticKey: '1ba69ee97cd392cd9c2ac4d842991fc0',
// 	// staticKeyEncoding: EncryptionEncoding.hex,
// 	// keyLength: 16,
// 	// algorithm: 'aes-128-cbc',
// 	includeLogs: true,
// });

console.log(encrypted);
// console.log(JSON.parse(decrypted));
console.log(EncryptionEncoding);
