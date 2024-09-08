import Elysia from 'elysia'
import { TableService } from './services/table'

const port = 3000
new Elysia().use(TableService).listen(port, () => {
    console.log(`Server is running at port ${port}`)
})
