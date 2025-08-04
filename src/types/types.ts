import z, { ZodType } from 'zod';
import { CryptographyOptionsSchema } from '@/schemas/encryptionOptions.schema';

export interface IEncryptionReturn {
	message: string;
	iv: string;
	value: string;
}

export type CryptographyOptions = z.infer<typeof CryptographyOptionsSchema>;

export interface IValidatePayloadParams<T> {
	schema: ZodType<T>;
	payload: any;
	includeLogs?: boolean;
}
