export interface DataBaseSqlExecuteResult<T> {
    rows: T[]
    affectedRows: number
}

export interface PrimaryKey {
    schema_name: string;
    table_name: string;
    column_name: string;
    constraint_name: string;
}

export interface ForeignKey {
    schema_name: string;
    table_name: string;
    column_name: string;
    constraint_name: string;
    foreign_schema: string;
    foreign_table: string;
    foreign_column: string;
}

export interface ColumnInfo extends PrimaryKey {
    data_type: string;
    is_primary_key: boolean;
    is_foreign_key: boolean;
    foreign_schema: string;
    foreign_table: string;
    foreign_column: string
}