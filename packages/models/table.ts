export interface TableCreateParams {
    name: string //表名
    schema?: string //所属模式
    charset?: string //字符集
    columns: TableColumnCreateParams[] //列
}

export interface TableColumnCreateParams {
    name: string //列名
    type: string //类型
    notNull?: boolean //是否可为空
    unique?: boolean //是否唯一
    primary?: boolean //是否为主键
    increments?: boolean //是否自增
    default?: any //默认值
    comment?: string //注释
}

export interface TableQueryParams {
    schema: string // 所属模式
}


interface Column {
    name: string
    comment: string | null
    type: string
    isNotNull: boolean
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
    columns: Column[]
}