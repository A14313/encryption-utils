import z, { RefinementCtx } from 'zod';
import { EncryptionEncoding, type CryptographyOptions } from '@/types';
import { randomBytes } from 'crypto';

//  🔑 Key + IV requirements

// For AES, the algorithm name tells the key size:
// 	•	aes-128-cbc → key must be 16 bytes
// 	•	aes-192-cbc → key must be 24 bytes
// 	•	aes-256-cbc → key must be 32 bytes

// The IV size is always 16 bytes for AES (CBC, CFB, GCM, etc).

// ********************************** Schemas

const BaseCryptographyOptions = z.object({
	algorithm: z.string().trim().optional(),
	password: z
		.string()
		.trim()
		.nonempty('Password is required')
		.min(16, 'Password must be minimum of 16 characters')
		.optional(),
	salt: z.string().trim().nonempty('salt is required').min(8, 'salt must be minimum of 8 characters').optional(),
	keyLength: z.number().optional(),
	includeLogs: z.boolean().default(false).optional(),
});

// Encryption options schema
const EncryptionOptions = BaseCryptographyOptions.extend({
	type: z.literal('encryption'),
	encodingInput: z.literal('utf8').optional(),
	encodingOutput: z.enum(EncryptionEncoding).optional(),
	staticIV: z.string().trim().nonempty('staticIV needs to have a value if set.').optional(),
	staticIVEncoding: z.enum(EncryptionEncoding).optional(),
	staticKey: z.string().trim().nonempty('staticKey needs to have a value if set.').optional(),
	staticKeyEncoding: z.enum(EncryptionEncoding).optional(),
}).superRefine((data, ctx) => {
	if (data.staticIV && !data.staticIVEncoding) {
		ctx.addIssue({
			code: 'custom',
			message: '"staticIVEncoding" is needed if the "staticIV" is set',
			path: ['staticIVEncoding'],
		});
	}

	// Check IV
	if (data.staticIV && data.staticIVEncoding) {
		const staticIVBuffer = Buffer.from(data.staticIV, data.staticIVEncoding);
		const recommendedIVHex = randomBytes(16).toString('hex');
		const recommendedIVBase64 = randomBytes(16).toString('base64');

		if (staticIVBuffer.length !== 16) {
			ctx.addIssue({
				code: 'custom',
				message: `The staticIV size must be 16. You passed a staticIV with of size: ${staticIVBuffer.length}\nTry this instead:👇\n👉${recommendedIVHex}👈 HEX\n\n👉${recommendedIVBase64}👈 BASE64\nThose are random 16bytes hex and base64 😉\nCopy it and use as your IV`,
				path: ['staticIV'],
			});
		}
	}

	validateStaticKey(data, ctx);
	validatePasswordSaltWithStaticKey(data, ctx);
	validateAlgorithm(data, ctx);
});

// Decryption options schema
const DecryptionOptions = BaseCryptographyOptions.extend({
	type: z.literal('decryption'),
	encodingInput: z.enum(EncryptionEncoding).optional(),
	encodingOutput: z.literal('utf8').optional(),
	IVEncodingInput: z.enum(EncryptionEncoding).optional(),
	staticKey: z.string().trim().nonempty('staticKey needs to have a value if set.').optional(),
	staticKeyEncoding: z.enum(EncryptionEncoding).optional(),
}).superRefine((data, ctx) => {
	validateStaticKey(data, ctx);

	validatePasswordSaltWithStaticKey(data, ctx);

	validateAlgorithm(data, ctx);
});

// Discriminated union
const CryptographyOptionsSchema = z.discriminatedUnion('type', [EncryptionOptions, DecryptionOptions]);

// ! ******************************** End of Schemas

// ********************************** Validation functions
function validateAlgorithm(data: CryptographyOptions, ctx: RefinementCtx) {
	// Algorithm-based key + IV checks
	if (data.algorithm) {
		const match = data.algorithm.match(/^aes-(128|192|256)-(.*)$/);
		if (!match) {
			ctx.addIssue({
				code: 'custom',
				message: `Unsupported algorithm "${data.algorithm}". Must be like "aes-256-cbc", "aes-256-cfb", etc.`,
				path: ['algorithm'],
			});

			return;
		}

		const [, bits, mode] = match;
		const requiredKeyLen = parseInt(bits, 10) / 8; // 128->16, 192->24, 256->32

		// ECB has no IV
		if (mode === 'ecb') {
			ctx.addIssue({
				code: 'custom',
				message: 'ecb mode for algorithm is not supported.',
				path: ['algorithm'],
			});

			return;
		}

		// Check the staticKey length (if provided)
		if (data.staticKey && data.staticKeyEncoding) {
			const staticKeyBuffer = Buffer.from(data.staticKey, data.staticKeyEncoding);
			if (staticKeyBuffer.length !== requiredKeyLen) {
				ctx.addIssue({
					code: 'custom',
					message: `Invalid staticKey length. Expected ${requiredKeyLen} bytes for ${data.algorithm}, got ${staticKeyBuffer.length}.`,
					path: ['staticKey'],
				});
			}
		}
	}
}

function validatePasswordSaltWithStaticKey(data: CryptographyOptions, ctx: RefinementCtx) {
	if (data.staticKey && data.staticKeyEncoding && (data.password || data.salt)) {
		['password', 'salt'].forEach((field) => {
			if (data[field as keyof typeof data]) {
				ctx.addIssue({
					code: 'custom',
					message: `${field} is not needed if "staticKey" is provided`,
					path: [field],
				});
			}
		});
	}
}

function validateStaticKey(data: CryptographyOptions, ctx: RefinementCtx) {
	if (data.staticKey && !data.staticKeyEncoding) {
		ctx.addIssue({
			code: 'custom',
			message: '"staticKeyEncoding" is needed if the "staticKey" is set',
			path: ['staticKeyEncoding'],
		});
	}
}

// ! ******************************** End of Validation functions

export { CryptographyOptionsSchema, EncryptionOptions, DecryptionOptions };
