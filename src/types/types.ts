import z from 'zod';
import { CryptographyOptionsSchema } from '@/schemas/encryptionOptions.schema';

export interface IEncryptionReturn {
	message: string;
	iv: string;
	value: string;
}

export type CryptographyOptions = z.infer<typeof CryptographyOptionsSchema>;
