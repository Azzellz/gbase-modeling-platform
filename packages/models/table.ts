export interface TableCreateParams {
    name: string //表名
    schema?: string //所属模式
    charset?: string //字符集
    columns: TableColumnCreateParams[] //列
}

export type TableColumnDateType = 'string' | 'integer' | 'boolean' | 'bigint' | 'binary' | 'date' | 'dateTime' | 'decimal' | 'double' | 'float' | 'json' | "jsonb"

export interface TableColumnCreateParams {
    name: string //列名
    type: TableColumnDateType //类型
    isNotNull: boolean //是否可为空
    isUnique: boolean //是否唯一
    isPrimary: boolean //是否为主键
    isIncrements: boolean //是否自增
    default?: any //默认值
    comment?: string //注释
    references?: string
}

export interface TableQueryParams {
    schema: string // 所属模式
}

export interface TableColumn extends TableColumnCreateParams {
    position: number
}

export interface Table {
    /**
     * 表名字
     */
    name: string
    /**
     * 所属的schema
     */
    schema: string
    /**
     * 列
     */
    columns: TableColumn[]
}