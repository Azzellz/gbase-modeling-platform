import type { SuccessResponse, ErrorResponse } from '@root/models'
import { createSuccessResponse, createErrorResponse } from '@root/shared'
import { isAxiosError, type AxiosResponse } from 'axios'

//#region 默认的一些生命周期函数
function _defaultOnSuccess<T>(response: AxiosResponse<any>): SuccessResponse<T> {
    const code = parseInt(response.data.code) || 200
    const message = response.data.message || '请求成功'
    const data = response.data.data === void 0 ? null : response.data.data
    return createSuccessResponse(code, message, data)
}

function _defaultOnError<U>(result: any): ErrorResponse<U> {
    if (isAxiosError(result)) {
        if (result.response) {
            const data = result.response.data
            return createErrorResponse(data.code || result.response.status, data.error || result.response.statusText as U)
        } else if (result.request) {
            return createErrorResponse(result.status || 500, ('网络错误: ' + result.message) as U)
        } else {
            return createErrorResponse(result.status || 500, ('未知错误: ' + result.message) as U)
        }
    } else {
        if (!result) return createErrorResponse(500, '未知错误' as U)
        const code = parseInt(result.code) || 500
        const error = result.error || '运行时错误: ' + result
        return createErrorResponse(code, error)
    }
}

const _defaultOnFinal = () => { }

const _defaultOptions = {
    onError: _defaultOnError,
    onSuccess: _defaultOnSuccess,
    onFinal: _defaultOnFinal,
    retry: false
}
//#endregion

type OnSuccess<T> = (response: AxiosResponse<any>) => SuccessResponse<T> | void
type OnError<U> = (error: any) => ErrorResponse<U> | void
type OnFinal = () => void
/**
 * 请求生命周期选项
 */
interface RequestLifeCycleOptions<T, U> {
    onSuccess?: OnSuccess<T>
    onError?: OnError<U>
    onFinal?: OnFinal
}

/**
 * 请求处理选项
 */
interface HandleRequestOptions<T, U> extends RequestLifeCycleOptions<T, U> {
    /**
     * 请求重试的配置
     */
    retry?: number | boolean
}

/**
 * 请求包装器
 */
type AxiosRequestWrapper<T> = () => Promise<AxiosResponse<T>>

/**
 * 处理基于Axios的请求，可以把请求响应转化为指定格式，保证类型安全
 * @param request 请求包装器
 * @param options 选项
 * @returns 标准响应
 */
export async function handleAxiosRequest<T, U = string>(
    request: AxiosRequestWrapper<T>,
    options: HandleRequestOptions<T, U> = _defaultOptions
): Promise<SuccessResponse<T> | ErrorResponse<U>> {
    const _options: Required<HandleRequestOptions<T, U>> = { ..._defaultOptions, ...options }

    //#region 重试机制
    let attempt = 0
    const maxAttempts = typeof _options.retry === 'number' ? _options.retry : 0

    while (attempt <= maxAttempts) {
        try {
            const response = await (typeof request === 'function' ? request() : request)
            return _options.onSuccess(response) || _defaultOnSuccess(response)
        } catch (error) {
            if (attempt === maxAttempts) {
                return _options.onError(error as U) || _defaultOnError(error as U)
            } else {
                attempt++
            }
        } finally {
            _options.onFinal()
        }
    }
    //#endregion

    // 重试失败处理
    const error = createErrorResponse(500, `重试请求失败，共重试${attempt}次`)
    return _options.onError(error) || _defaultOnError(error)
}

export function createBearerHeader(token: string) {
    return {
        headers: {
            Authorization: 'Bearer ' + token
        }
    }
}
