export default {
    host: 'localhost',
    port: 5432,
    username: 'gbase',
    database: 'testdb',
    password: process.env['GBASE_PASSWORD'],
    gbase: {
        // gbase数据库的安装路径
        path: '/home/gbase/gbase8c_pkg'
    }
}
