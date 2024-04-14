import UrlDownloader from './urlDownloader.mjs'

export default class DownloadManager {

    #urls
    #urlDownloaders

    #downloadEvents

    get downloadEvents() {
        return {
            addEventListener: this.#downloadEvents.addEventListener.bind(this.#downloadEvents),
            removeEventListener: this.#downloadEvents.removeEventListener.bind(this.#downloadEvents)
        }
    }

    constructor(urls) {
        this.#urls = urls
        this.#urlDownloaders = []
        this.#downloadEvents = new EventTarget()

        this.#createUrlDownloaders()
    }

    #createUrlDownloaders() {
        for (const url of this.#urls) {
            const urlDownloader = new UrlDownloader(url)
            this.#urlDownloaders.push(urlDownloader)
        }
    }

    async downloadAll(urls) {
        this.#urls = urls
    }

    async fetchTotalFileSize() {
        
    }
}