/**
 * 标准成功响应
 */
export interface SuccessResponse<T> {
    code: number
    message: string
    data: T
}
/**
 * 标准错误响应
 */
export interface ErrorResponse<U = string> {
    code: number
    error: U
}
/**
 * 标准响应
 */
export type Response<T, U = string> = SuccessResponse<T> | ErrorResponse<U>
