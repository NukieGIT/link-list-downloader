import UrlDownloader from './urlDownloader.mjs'

/**
 * @import { EventTargetWithoutDispatch } from '/new/globalTypes'
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

    /**
     * @type {EventTarget}
     */
    #downloadEvents

    /**
     * @type {EventTarget}
     */
    #fetchFileSizeEvents

    /**
     * @returns {EventTargetWithoutDispatch}
     */
    get downloadEvents() {
        return {
            addEventListener: this.#downloadEvents.addEventListener.bind(this.#downloadEvents),
            removeEventListener: this.#downloadEvents.removeEventListener.bind(this.#downloadEvents)
        }
    }

    /**
     * @returns {EventTargetWithoutDispatch}
     */
    get fetchFileSizeEvents() {
        return {
            addEventListener: this.#fetchFileSizeEvents.addEventListener.bind(this.#fetchFileSizeEvents),
            removeEventListener: this.#fetchFileSizeEvents.removeEventListener.bind(this.#fetchFileSizeEvents)
        }
    }

    get urlDownloaderFetchEvents() {
        return this.#urlDownloaders.map(urlDownloader => urlDownloader.fetchFileSizeEvents)
    }

    get urlDownloaderDownloadEvents() {
        return this.#urlDownloaders.map(urlDownloader => urlDownloader.downloadEvents)
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
        const results = await Promise.allSettled(this.#urlDownloaders.map(urlDownloader => urlDownloader.download()))
    }

    async fetchTotalFileSize() {
        const results = await Promise.allSettled(this.#urlDownloaders.map(urlDownloader => urlDownloader.fetchFileSize()))
    }
}