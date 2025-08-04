import { type IValidatePayloadParams } from '@/types';

const isValidPayload = <T>(params: IValidatePayloadParams<T>) => {
	const result = params.schema.safeParse(params.payload);

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
		if (params.includeLogs) console.dir(errorObj, { depth: null });
		return errorObj;
	}
	if (params.includeLogs) console.log('result', result);
	return { success: result.success, data: result.data };
};

export { isValidPayload };
