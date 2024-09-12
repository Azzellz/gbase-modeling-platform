declare module "node-opengauss" {
    export interface DataBaseSqlExecuteResult<T> {
        rows: T[]
        affectedRows: number
    }
    export interface OpenGaussConnectConfig {
        username: string
        dbname: string
        host: string
        port: number
        password: string
    }
    export default class OpenGauss {
        constructor();
        connect(config: OpenGaussConnectConfig): Promise;
        disconnect();
        query(sql: string, callback: (result: Partial<DataBaseSqlExecuteResult<T>>) => void): void;
    }
}