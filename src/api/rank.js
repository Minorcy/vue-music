import axios from 'axios'

const HOST = 'http://localhost:3000'

export function getToplist(id) {
    const url = HOST + `/top/list?idx=${id}`
    return axios.get(url)
}