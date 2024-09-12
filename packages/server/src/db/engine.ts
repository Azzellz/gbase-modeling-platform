import OpenGauss from 'node-opengauss'
import config from '../../db.config'
import { DataBaseSqlExecuteResult } from '@root/models'

//#region 初始化客户端

const client = new OpenGauss()
client.connect(config).then(() => {
    console.log('数据库连接成功!')
})
function disconnect() {
    try {
        client.disconnect()
        console.log('成功断开数据库连接')
    } catch (error) {
        console.error('断开数据库连接失败: ' + error)
    }
}
// 正常退出事件
process.on('exit', disconnect);

// 未捕获的异常事件
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught exception:', err);
    // 如果你需要强制退出：
    process.exit(1);
});

// 未处理的Promise拒绝事件
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // 在这里处理未处理的Promise拒绝
});

// 捕获 SIGINT (Ctrl+C)
process.on('SIGINT', () => {
    console.log('Received SIGINT. Exiting gracefully...');
    process.exit(0);
});

// 捕获 SIGTERM (通常用于终止进程)
process.on('SIGTERM', () => {
    console.log('Received SIGTERM. Exiting gracefully...');
    process.exit(0);
});

//#endregion

/**
 * OpenGauss数据库引擎
 */
export const engine = {
    /**
     * 执行sql语句
     * @param sql 目标sql
     */
    async execute<T = unknown>(sql: string) {
        return new Promise<DataBaseSqlExecuteResult<T>>((resolve) => {
            client.query(sql, (result: Partial<DataBaseSqlExecuteResult<T>>) => {
                resolve({
                    rows: [],
                    affectedRows: 0,
                    ...result,
                })
            })
        })
    }
}