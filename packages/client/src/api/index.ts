import axios from 'axios'
import * as table from './table'
import * as mermaid from './mermaid'

export const API_INST = axios.create({
    baseURL: 'http://tyee.life:4444'
})

export const API = {
    table,
    mermaid
}
