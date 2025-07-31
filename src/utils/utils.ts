import { ZodSchema } from 'zod';

const isValidPayload = <T>(schema: ZodSchema<T>, payload: any) => {
	const result = schema.safeParse(payload);

	if (!result.success) {
		const errorObj = {
			success: result.success,
			errors: result.error.issues.map((el) => {
				return {
					message: el.message,
					path: el.path,
				};
			}),
		};
		console.dir(errorObj, {depth: null});
		return errorObj;
	}
	console.log('result', result);
	return { success: result.success, data: result.data };
};

export { isValidPayload };
