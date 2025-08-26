import z, { ZodType } from 'zod';
import { EncryptionOptions, DecryptionOptions, CryptographyOptionsSchema } from '@/schemas/encryptionOptions.schema';

export interface IEncryptionReturn {
	message: string;
	iv?: string;
	value: string;
}

// Export user-facing options without `type`
export type EncryptionOptionsInput = Omit<z.infer<typeof EncryptionOptions>, 'type'>;
export type DecryptionOptionsInput = Omit<z.infer<typeof DecryptionOptions>, 'type'>;

export interface IValidatePayloadParams<T> {
	schema: ZodType<T>;
	payload: any;
	includeLogs?: boolean;
}

export enum EncryptionEncoding {
	hex = 'hex',
	base64 = 'base64',
}

export type CryptographyOptions = z.infer<typeof CryptographyOptionsSchema>;
