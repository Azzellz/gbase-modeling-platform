export default {
    host: "localhost",
    port: 5432,
    username: 'gbase',
    dbname: 'testdb',
    password: process.env['GBASE_PASSWORD'] || '',
}