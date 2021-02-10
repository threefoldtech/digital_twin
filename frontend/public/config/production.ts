let a = window.location.host.split(".")
a.shift()
let config = {
    baseUrl: `${window.location.origin}/`,
    spawnerUrl: `https://${a.join(".")}/`,
    giphyApiKey: `uk3XRSO0vYrPDEQKDPZJ2wGz33qzIxST`
}
export default config
