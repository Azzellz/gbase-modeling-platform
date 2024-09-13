import axios from 'axios'
import * as table from './table'
import * as mermaid from './mermaid'
import * as schema from './schema'
import config from '@root/config'

export const API_INST = axios.create({
    baseURL: config.server.baseURL,
})

export const API = {
    table,
    mermaid,
    schema
}
