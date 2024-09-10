import Elysia from 'elysia'
import { MermaidService, OpenGaussService } from './services'
import cors from '@elysiajs/cors'

const port = 4444
new Elysia()
    .use(cors())
    .use(OpenGaussService)
    .use(MermaidService)
    .listen(port, () => {
        console.log(`Server is running at port ${port}`)
    })
