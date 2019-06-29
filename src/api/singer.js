import axios from 'axios';
const HOST = 'http://localhost:3000'

export function getSingers() {
    const url = HOST + '/top/artists?limit=100'
    return axios.get(url)
}

export function getSingerDetail(singerId) {
    const url = HOST + `/artists?id=${singerId}`

    return axios.get(url)
}

export function getMusic(musicId) {
    const url = HOST + `/music/url?id=${musicId}`

    return axios.get(url)
}