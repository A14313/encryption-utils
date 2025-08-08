import { createCipheriv, randomBytes, scryptSync, createDecipheriv } from 'crypto';
import { type IEncryptionReturn, EncryptionOptionsInput, DecryptionOptionsInput } from '@/types';
import { isValidPayload } from '@/utils';
import { CryptographyOptionsSchema } from '@/schemas/encryptionOptions.schema';
import CustomError from '@/utils/customError';

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
		const ivSize = mergedOptions.ivSize || 16;

		const key = scryptSync(mergedOptions.password, mergedOptions.salt, keyLength);
		const iv = randomBytes(ivSize);

		const cipher = createCipheriv(algorithm, key, iv);
		let encrypted = cipher.update(payload, encodingInput, encodingOutput);
		encrypted += cipher.final(encodingOutput);

		return {
			message: 'Encrypted successfully',
			iv: iv.toString(encodingOutput),
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
		const password = mergedOptions.password;
		const salt = mergedOptions.salt;
		const keyLength = mergedOptions.keyLength || 32;
		const encodingInput = mergedOptions.encodingInput || 'hex';
		const encodingOutput = mergedOptions.encodingOutput || 'utf8';

		const key = scryptSync(password, salt, keyLength);
		const bufferedIv = Buffer.from(iv, encodingInput);

		const decipher = createDecipheriv(algorithm, key, bufferedIv);
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
