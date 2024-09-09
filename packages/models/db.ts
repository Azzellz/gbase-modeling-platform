export interface DataBaseResult<T> {
    rows: T[]
    affectedRows: number
}