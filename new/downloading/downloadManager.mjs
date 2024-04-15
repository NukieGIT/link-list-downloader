import UrlDownloader from './urlDownloader.mjs'

export default class DownloadManager {

    #urls
    #urlDownloaders

    #downloadEvents

    /**
     * @returns {import('globalTypes.mjs').EventTargetWithoutDispatch}
     */
    get downloadEvents() {
        return {
            addEventListener: this.#downloadEvents.addEventListener.bind(this.#downloadEvents),
            removeEventListener: this.#downloadEvents.removeEventListener.bind(this.#downloadEvents)
        }
    }

    /**
     * @param {string[]} urls
     */
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

    async downloadAll() {
        for (const urlDownloader of this.#urlDownloaders) {
            await urlDownloader.download()
        }
    }

    async fetchTotalFileSize() {
        for (const urlDownloader of this.#urlDownloaders) {
            await urlDownloader.fetchFileSize()
        }
    }
}