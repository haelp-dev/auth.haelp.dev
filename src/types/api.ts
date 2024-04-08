export type APIResponse<T = any> = {
	success: true;
	data: T;
} | {
	success: false;
	error: string;
};