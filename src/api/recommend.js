import axios from 'axios';
const HOST = 'http://localhost:3000';
const ERR_OK = 200


export function getBanner() {
    const url = HOST + '/banner'
    return axios.get(url)
}

export function getRecommendList() {
    const url = HOST + '/personalized'
    return axios.get(url)
}

export function getRecommendMusic() {
    const url = HOST + '/personalized/newsong'
    return axios.get(url)
}

export function getRecommendListDetail(id) {
    const url = HOST + `/playlist/detail?id=${id}`
    return axios.get(url)
}