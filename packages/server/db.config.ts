export default {
    host: "localhost",
    port: 5432,
    username: 'gbase',
    database: 'testdb',
    password: process.env['GBASE_PASSWORD'],
}