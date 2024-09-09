import { knex } from 'knex'

// 初始化knex客户端，这里只是单纯用knex的schema功能，所以不需要连接数据库
export const SchemaBuilder = knex({
    client: 'pg'
}).schema
