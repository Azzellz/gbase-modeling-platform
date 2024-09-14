export interface Schema {
    name: string
}
export interface SchemaQueryParams {
    system: boolean //是否包含系统内置的表
}

export interface SchemaCreateParams {
    name: string
    owner?: string
}