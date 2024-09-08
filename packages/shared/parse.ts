// 定义表结构的接口
interface Table {
    name: string
    columns: Column[]
    primaryKeys: string[]
    foreignKeys: ForeignKey[]
}

// 定义列的接口
interface Column {
    name: string
    type: string
    isNullable: boolean
    defaultValue?: string
}

// 定义外键的接口
interface ForeignKey {
    column: string
    referencesTable: string
    referencesColumn: string
}

// 将 SQL 转换为 Mermaid ER 图代码的主函数
function sqlToMermaidER(sql: string): string {
    const tableMap = new Map<string, Table>()
    const tables: Table[] = []
    const lines = sql.split('\n')
    let currentTable: Table | null = null

    // 解析 SQL 语句
    lines.forEach((line) => {
        const trimmedLine = line.trim()

        // 解析 CREATE TABLE 语句
        if (trimmedLine.startsWith('CREATE TABLE')) {
            const tableName = trimmedLine.split(' ')[2]
            currentTable = { name: tableName, columns: [], primaryKeys: [], foreignKeys: [] }
            tables.push(currentTable)
            tableMap.set(tableName, currentTable)
        } else if (currentTable && trimmedLine.startsWith(');')) {
            currentTable = null
        } else if (
            trimmedLine.startsWith('ALTER TABLE') &&
            trimmedLine.includes('ADD CONSTRAINT') &&
            trimmedLine.includes('PRIMARY KEY')
        ) {
            const tableName = trimmedLine.split(' ')[2]
            currentTable = tableMap.get(tableName)!
            // 解析 PRIMARY KEY 约束
            const pkColumns = trimmedLine
                .match(/\(([^)]+)\)/)?.[1]
                .split(',')
                .map((col) => col.trim())
            if (pkColumns) {
                currentTable.primaryKeys.push(...pkColumns)
            }
        } else if (
            trimmedLine.startsWith('ALTER TABLE') &&
            trimmedLine.includes('ADD CONSTRAINT') &&
            trimmedLine.includes('FOREIGN KEY')
        ) {
            const tableName = trimmedLine.split(' ')[2]
            currentTable = tableMap.get(tableName)!
            // 解析 FOREIGN KEY 约束
            const fkMatch = trimmedLine.match(
                /FOREIGN KEY \(([^)]+)\) REFERENCES ([^(]+)\(([^)]+)\)/
            )
            if (fkMatch) {
                const [, column, refTable, refColumn] = fkMatch
                currentTable.foreignKeys.push({
                    column: column.trim(),
                    referencesTable: refTable.trim(),
                    referencesColumn: refColumn.trim()
                })
            }
        } else if (
            currentTable &&
            !trimmedLine.startsWith('--') &&
            trimmedLine.length > 0 &&
            !trimmedLine.startsWith('ALTER')
        ) {
            // 解析列定义
            const columnParts = trimmedLine
                .replace(/[(),;]/g, '')
                .split(/\s+/)
                .filter(Boolean)
            const columnName = columnParts[0]
            const columnType = columnParts
                .slice(1)
                .filter((part) => !part.startsWith('DEFAULT') && part !== 'NOT' && part !== 'NULL')
                .join(' ')
            const isNullable = !trimmedLine.includes('NOT NULL')
            const defaultValueMatch = trimmedLine.match(/DEFAULT\s+'?([^'\s]+)'?/)
            const defaultValue = defaultValueMatch ? defaultValueMatch[1] : undefined

            currentTable.columns.push({
                name: columnName,
                type: columnType,
                isNullable,
                defaultValue
            })
        }
    })

    // 生成 Mermaid ER 图代码
    let mermaidCode = 'erDiagram\n'

    // 添加列
    tables.forEach((table) => {
        mermaidCode += `\t${table.name} {\n`
        table.columns.forEach((column) => {
            // 转换 SQL 类型为 Mermaid 的简化类型表示
            const type = convertType(column.type)
            const FK = table.foreignKeys.some((fk) => fk.column === column.name) ? 'FK' : ''
            const PK = table.primaryKeys.includes(column.name) ? 'PK' : ''
            const extra = `${PK}${PK && FK ? `,${FK}` : FK ? FK : ''}`
            mermaidCode += `\t\t${type} ${column.name} ${extra}\n`
        })
        mermaidCode += `\t}\n`
    })

    // 添加外键关系
    tables.forEach((table) => {
        table.foreignKeys.forEach((fk) => {
            mermaidCode += `\t${fk.referencesTable} ||--o{ ${table.name} : places\n`
        })
    })

    return mermaidCode
}

// 辅助函数：将 SQL 类型转换为 Mermaid 支持的类型
function convertType(sqlType: string): string {
    const lowerType = sqlType.toLowerCase()
    if (lowerType.includes('int')) return 'int'
    if (
        lowerType.includes('character') ||
        lowerType.includes('text') ||
        lowerType.includes('varchar')
    )
        return 'string'
    if (
        lowerType.includes('float') ||
        lowerType.includes('double') ||
        lowerType.includes('real') ||
        lowerType.includes('numeric')
    )
        return 'float'
    if (lowerType.includes('boolean')) return 'boolean'
    if (lowerType.includes('timestamp') || lowerType.includes('date') || lowerType.includes('time'))
        return 'datetime'
    return 'string' // 默认使用 string
}

// 测试用
// function _test() {
//     // 示例调用
//     const testSQL = `
//     CREATE SCHEMA test;
    
//     CREATE TABLE users (
//       id character varying(255) DEFAULT '123456'::character varying NOT NULL,
//       username character varying(255) NOT NULL,
//       email character varying(255) NOT NULL
//     );
    
//     ALTER TABLE users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
    
//     CREATE TABLE orders (
//       order_id serial NOT NULL,
//       user_id character varying(255) NOT NULL,
//       order_date timestamp NOT NULL
//     );
    
//     ALTER TABLE orders ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);
    
//     ALTER TABLE orders ADD CONSTRAINT orders_user_fk FOREIGN KEY (user_id) REFERENCES users(id);
//     `

//     console.log(sqlToMermaidER(testSQL))
// }
