import z from 'zod';
import { EncryptionOptions, DecryptionOptions } from '@/schemas/encryptionOptions.schema';

export interface IEncryptionReturn {
	message: string;
	iv: string;
	value: string;
}

// Export user-facing options without `type`
export type EncryptionOptionsInput = Omit<z.infer<typeof EncryptionOptions>, 'type'>;
export type DecryptionOptionsInput = Omit<z.infer<typeof DecryptionOptions>, 'type'>;
