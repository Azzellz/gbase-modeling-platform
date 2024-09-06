import type { ErrorResponse, Response, SuccessResponse } from '@root/models'
import { isObject } from 'radash'

/**
 * 生成标准成功响应
 * @param code 响应状态码
 * @param message 响应消息
 * @param data 响应数据
 * @returns 标准成功响应
 */
export function createSuccessResponse<T>(
    code: number,
    message: string,
    data: T
): SuccessResponse<T> {
    return {
        code,
        message,
        data
    }
}

/**
 * 生成标准失败响应
 * @param code 响应状态码
 * @param error 响应错误
 * @returns 标准错误响应
 */
export function createErrorResponse<U = string>(code: number, error: U): ErrorResponse<U> {
    return {
        code,
        error
    }
}

/**
 * 判断是否为标准响应
 * @param response 要断言的响应对象
 * @returns 布尔值
 */
export function isStandardResponse<T = unknown, U = unknown>(
    response: unknown
): response is Response<T, U> {
    if (!isObject(response)) return false
    if ((response as any)['code'] && ((response as any)['error'] || (response as any)['data']))
        return true
    else return false
}

/**
 * 判断是否为标准成功响应
 * @param response 要断言的响应对象
 * @returns 布尔值
 */
export function isSuccessResponse<T>(response: unknown): response is SuccessResponse<T> {
    return isStandardResponse(response) && typeof (response as any).error === 'undefined'
}

/**
 * 判断是否为标准失败响应
 * @param response 要断言的响应对象
 * @returns 布尔值
 */
export function isErrorResponse<U>(response: unknown): response is ErrorResponse<U> {
    return isStandardResponse(response) && typeof (response as any).error !== 'undefined'
}

/**
 * 判断是否是合法的http状态代码：101或者[200,599]
 * @param code http状态代码
 */
export function isValidHttpStatusCode(code: number): boolean {
    return code === 101 || (code >= 200 && code <= 599)
}
