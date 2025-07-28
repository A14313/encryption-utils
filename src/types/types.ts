interface IBaseCryptographyOptions {
	algorithm?: string;
	password: string;
	salt: string;
	keyLength?: number;
	ivSize?: number;
	type: 'encryption' | 'decryption';
}

export interface IEncryptionOptions extends IBaseCryptographyOptions {
	type: 'encryption';
	encodingInput?: 'utf8';
	encodingOutput?: 'hex' | 'base64';
}

export interface IDecryptionOptions extends IBaseCryptographyOptions {
	type: 'decryption';
	encodingInput?: 'hex' | 'base64';
	encodingOutput?: 'utf8';
}

export interface IEncryptionReturn {
	message: string;
	iv: string;
	value: string;
}
