function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
    var _arr = arr.slice(0)
    for (var i = 0; i < _arr.length; i++) {
        let k = getRandom(0, i)
        let j = _arr[i]
        _arr[i] = _arr[k]
        _arr[k] = j
    }
    return _arr
}



export function debounce(func, delay) {
    let timer

    return function (...args) {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay)
    }
}