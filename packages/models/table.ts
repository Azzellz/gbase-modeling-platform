export interface TableCreateParams {
    name: string //表名
    columns: ColumnCreateParams[] //列
}

interface ColumnCreateParams {
    name: string //列名
    type: string //类型
    length?: number //长度
    notNull?: boolean //是否可为空
    unique?: boolean //是否唯一
    primary?: boolean //是否为主键
    increment?: boolean //是否自增
    default?: any //默认值
    comment?: string //注释
}
