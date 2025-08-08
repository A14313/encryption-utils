class CustomError extends Error {
	constructor(
		public message: string,
		public data?: any,
	) {
		super(message);
		this.name = 'CustomError';
	}
}

export default CustomError;
