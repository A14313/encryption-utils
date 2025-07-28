interface IBaseCryptographyOptions {
    algorithm?: string;
    password: string;
    salt: string;
    keyLength?: number;
    ivSize?: number;
    type: 'encryption' | 'decryption';
}
interface IEncryptionOptions extends IBaseCryptographyOptions {
    type: 'encryption';
    encodingInput?: 'utf8';
    encodingOutput?: 'hex' | 'base64';
}
interface IDecryptionOptions extends IBaseCryptographyOptions {
    type: 'decryption';
    encodingInput?: 'hex' | 'base64';
    encodingOutput?: 'utf8';
}
interface IEncryptionReturn {
    message: string;
    iv: string;
    value: string;
}

declare function encrypt(payload: string, options: IEncryptionOptions): IEncryptionReturn;
declare function decrypt(payload: string, iv: string, options: IDecryptionOptions): string;

export { decrypt, encrypt };
