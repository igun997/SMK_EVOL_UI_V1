function qs(data) {
    let res = [];
    for (const key in data) {
        res.push(key+"="+data[key])
    }
    return res.join("&");
}

export const Helpers = {
    qs
}
