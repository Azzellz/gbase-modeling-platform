import Elysia from 'elysia'
import { TableService } from './services/table'
import { MermaidService } from './services'
import cors from '@elysiajs/cors'

const port = 4444
new Elysia()
    .use(cors())
    .use(TableService)
    .use(MermaidService)
    .listen(port, () => {
        console.log(`Server is running at port ${port}`)
    })
