import { createCipheriv, randomBytes, scryptSync } from 'crypto';
import { type IEncryptionOptions, IEncryptionReturn } from '@/types';

/**
 * Encrypts a given payload using the provided encryption or the default is 'AES-256-CBC'.
 * @param {string} payload - The string to be encrypted.
 * @returns {object} An object containing the encrypted value and initialization vector (iv).
 */

export function encrypt(payload: string, options: IEncryptionOptions): IEncryptionReturn {
	try {
		// Validation
		if (!payload) {
			throw new Error('Payload is required for the encryption process.');
		}

		if (!options.password?.trim() || !options.salt?.trim()) {
			throw new Error('Both password and salt are required for encryption.');
		}

		const algorithm = options.algorithm || 'aes-256-cbc';
		const encodingInput = options.encodingInput || 'utf8';
		const encodingOutput = options.encodingOutput || 'hex';
		const keyLength = options.keyLength || 32; // Default key length for AES-256
		const ivSize = options.ivSize || 16;

		const key = scryptSync(options.password, options.salt, keyLength);
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
		const message = err instanceof Error ? `Error encrypting data ${err.message}` : 'Unknown error';
		console.error(message);
		throw new Error(message);
	}
}
