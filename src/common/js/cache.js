import storage from 'good-storage'


const SEARCH_KEY = '__search__'
const SEARCH_MAX = 15

const PLAY_KEY = '__play__'
const PLAY_MAX = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX = 200

function insertArray(arr, val, compare, max) {
    const index = arr.findIndex(compare)
    if (index === 0) {
        return
    }
    if (index > 0) {
        arr.splice(index, 1)
    }
    arr.unshift(val)
    if (max && arr.length > max) {
        arr.pop
    }
}

export function saveSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    insertArray(searches, query, (item) => {
        return item === query
    }, SEARCH_MAX)

    storage.set(SEARCH_KEY, searches)

    return searches
}

export function loadSearch() {
    return storage.get(SEARCH_KEY, [])
}

export function deleteFromArray(arr, compare) {
    const index = arr.findIndex(compare)
    if (index > -1) {
        arr.splice(index, 1)
    }
}

export function deleteSearch(query) {
    let searches = storage.get(SEARCH_KEY, [])
    deleteFromArray(searches, (item) => {
        return item === query
    })
    // console.log('delete', searches)
    storage.set(SEARCH_KEY, searches)
    return searches
}

export function clearSearch() {
    storage.remove(SEARCH_KEY)
    return []
}

export function loadPlay() {
    return storage.get(PLAY_KEY, [])
}

export function savePlay(song) {
    let songs = storage.get(PLAY_KEY, [])
    insertArray(songs, song, (item) => {
        return item.id === song.id
    }, PLAY_MAX)
    storage.set(PLAY_KEY, songs)
    return songs
}

export function loadFavorite() {
    return storage.get(FAVORITE_KEY, [])
}

export function saveFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    insertArray(songs, song, (item => {
        return song.id === item.id
    }), FAVORITE_MAX)
    storage.set(FAVORITE_KEY, songs)
    return songs
}
export function deleteFavorite(song) {
    let songs = storage.get(FAVORITE_KEY, [])
    deleteFromArray(songs, (item) => {
        return song.id === item.id
    })
    storage.set(FAVORITE_KEY, songs)
    return songs
}