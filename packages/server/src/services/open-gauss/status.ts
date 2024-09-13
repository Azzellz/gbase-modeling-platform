import { DB } from "@/db";
import { createSuccessResponse } from "@root/shared";
import Elysia from "elysia";

export const StatusService = new Elysia()

/**
 * 获取数据库状态
 */
StatusService.get('/status', async () => {
    const result = await DB.status.getStatus()
    return createSuccessResponse(200, '获取数据库状态成功', result)
})