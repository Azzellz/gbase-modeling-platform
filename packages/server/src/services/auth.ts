import { Plugins } from "@/plugins";
import config from "@config/server.config";
import { createErrorResponse, createSuccessResponse } from "@root/shared";
import Elysia, { t } from "elysia";

export const AuthService = new Elysia().use(Plugins.AuthBase).post('/auth', async ({ jwt, body, set }) => {
    if (config.auth.includes(body.key)) {
        const token = await jwt.sign({ key: body.key });
        return createSuccessResponse(200, '认证成功', token)
    } else {
        set.status = 401
        return createErrorResponse(401, '认证失败，访问密钥错误!')
    }
}, {
    body: t.Object({
        key: t.String(),
    })
})