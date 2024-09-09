import axios from 'axios'
import * as table from './table'

export const API_INST = axios.create({
    baseURL: 'http://localhost:5000'
})

export const API = {
    table
}
