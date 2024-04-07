/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

export type FilterNeverProperties<T> = {
    [K in keyof T as T[K] extends never ? never : K]: T[K];
};

export type ToFunction<T> = T extends Function ? T : never

export type ToFunctionFirstParam<T, O = never> = T extends Function ? Parameters<T>[0] : O

export type ToAsyncFunction<T> = T extends Function ? AsyncFunction<T> | T : never

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type  AsyncFunction<T extends (...args: any[]) => any> = (...args: Parameters<T>) => Promise<ReturnType<T>>;