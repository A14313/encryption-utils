import z from 'zod';

declare const EncryptionOptions: z.ZodObject<{
    algorithm: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    salt: z.ZodString;
    keyLength: z.ZodOptional<z.ZodNumber>;
    ivSize: z.ZodOptional<z.ZodNumber>;
    includeLogs: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    type: z.ZodLiteral<"encryption">;
    encodingInput: z.ZodOptional<z.ZodLiteral<"utf8">>;
    encodingOutput: z.ZodOptional<z.ZodEnum<{
        hex: "hex";
        base64: "base64";
    }>>;
}, z.core.$strip>;
declare const DecryptionOptions: z.ZodObject<{
    algorithm: z.ZodOptional<z.ZodString>;
    password: z.ZodString;
    salt: z.ZodString;
    keyLength: z.ZodOptional<z.ZodNumber>;
    ivSize: z.ZodOptional<z.ZodNumber>;
    includeLogs: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    type: z.ZodLiteral<"decryption">;
    encodingInput: z.ZodOptional<z.ZodEnum<{
        hex: "hex";
        base64: "base64";
    }>>;
    encodingOutput: z.ZodOptional<z.ZodLiteral<"utf8">>;
}, z.core.$strip>;

interface IEncryptionReturn {
    message: string;
    iv: string;
    value: string;
}
type EncryptionOptionsInput = Omit<z.infer<typeof EncryptionOptions>, 'type'>;
type DecryptionOptionsInput = Omit<z.infer<typeof DecryptionOptions>, 'type'>;

declare function encrypt(payload: string, options: EncryptionOptionsInput): IEncryptionReturn;
declare function decrypt(payload: string, iv: string, options: DecryptionOptionsInput): string;

export { decrypt, encrypt };
