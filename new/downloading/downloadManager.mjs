import UrlDownloader from './urlDownloader.mjs'

/**
 * 
 */

export default class DownloadManager {

    /**
     * @type {string[]}
     */
    #urls
    /**
     * @type {UrlDownloader[]}
     */
    #urlDownloaders

    get urlDownloaders() {
        return this.#urlDownloaders.map(ud => ud.limitedUrlDownloader)
    }

    /**
     * @param {string[]} urls
     */
    constructor(urls) {
        this.#urls = urls
        this.#urlDownloaders = []

        this.#createUrlDownloaders()
    }

    #createUrlDownloaders() {
        for (const url of this.#urls) {
            const urlDownloader = new UrlDownloader(url)
            this.#urlDownloaders.push(urlDownloader)
        }
    }

    async downloadAll() {
        const results = await Promise.allSettled(this.#urlDownloaders.map(urlDownloader => urlDownloader.download()))
    }

    async fetchTotalFileSize() {
        const results = await Promise.allSettled(this.#urlDownloaders.map(urlDownloader => urlDownloader.fetchFileSize()))
    }
}