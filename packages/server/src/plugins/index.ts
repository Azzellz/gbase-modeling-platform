import config from "@config/server.config";
import bearer from "@elysiajs/bearer";
import jwt from "@elysiajs/jwt";
import { createErrorResponse } from "@root/shared";
import Elysia from "elysia";

const AuthBase = new Elysia().use(bearer()).use(jwt({
    name: 'jwt',
    secret: config.jwt.secret
}));
const Auth = new Elysia().use(AuthBase).onBeforeHandle(async ({ jwt, bearer }) => {
    if (!bearer) {
        return createErrorResponse(401, '缺少token')
    }
    const result = await jwt.verify(bearer)
    if (!result) {
        return createErrorResponse(403, '无效token')
    }
})
export const Plugins = {
    AuthBase,
    Auth
}