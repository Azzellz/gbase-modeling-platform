import Elysia from 'elysia'
import { TableService } from './services/table'
import { MermaidService } from './services'

const port = 4444
new Elysia()
    .use(TableService)
    .use(MermaidService)
    .listen(port, () => {
        console.log(`Server is running at port ${port}`)
    })
