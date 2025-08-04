import z from 'zod';

const BaseCryptographyOptions = z.object({
	algorithm: z.string().trim().optional(),
	password: z.string().trim().nonempty('Password is required').min(24, 'Password must be minimum of 24 characters'),
	salt: z.string().trim().nonempty('salt is required').min(16, 'salt must be minimum of 16 characters'),
	keyLength: z.number().optional(),
	ivSize: z.number().optional(),
	includeLogs: z.boolean().default(false).optional(),
});

// Encryption options schema
const EncryptionOptions = BaseCryptographyOptions.extend({
	type: z.literal('encryption'),
	encodingInput: z.literal('utf8').optional(),
	encodingOutput: z.enum(['hex', 'base64']).optional(),
});

// Decryption options schema
const DecryptionOptions = BaseCryptographyOptions.extend({
	type: z.literal('decryption'),
	encodingInput: z.enum(['hex', 'base64']).optional(),
	encodingOutput: z.literal('utf8').optional(),
});

// Discriminated union
const CryptographyOptionsSchema = z.discriminatedUnion('type', [EncryptionOptions, DecryptionOptions]);

export { CryptographyOptionsSchema };
