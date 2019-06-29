import axios from 'axios'
const HOST = 'http://localhost:3000';

export function getSong(id) {
    const url = HOST + `/song/url?id=${id}`

    return axios.get(url)
}

export function getLyric(id) {
    const url = HOST + `/lyric?id=${id}`

    return axios.get(url)
}