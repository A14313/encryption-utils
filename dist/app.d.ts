import z from 'zod';

declare const CryptographyOptionsSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
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
}, z.core.$strip>, z.ZodObject<{
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
}, z.core.$strip>]>;

interface IEncryptionReturn {
    message: string;
    iv: string;
    value: string;
}
type CryptographyOptions = z.infer<typeof CryptographyOptionsSchema>;

declare function encrypt(payload: string, options: CryptographyOptions): IEncryptionReturn;
declare function decrypt(payload: string, iv: string, options: CryptographyOptions): string;

export { decrypt, encrypt };
