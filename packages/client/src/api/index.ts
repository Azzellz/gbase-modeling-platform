import axios from 'axios'
import * as table from './table'
import * as mermaid from './mermaid'
import * as schema from './schema'
import * as status from './status'
import config from '@config'

export const API_INST = axios.create({
    baseURL: config.baseURL,
})

export const API = {
    table,
    mermaid,
    schema,
    status
}
