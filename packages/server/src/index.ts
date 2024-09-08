import Elysia from 'elysia'
import { TableService } from './services/table'

const app = new Elysia().use(TableService).listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`)
})

