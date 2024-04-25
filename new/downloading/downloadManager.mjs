import GenericEvents from '../events/events.mjs'
import UrlDownloader from './urlDownloader.mjs'

/**
 * @import { LimitedUrlDownloader } from './urlDownloader'
 * @import { DownloadedFilesCountEventMap, DownloadedFileSizeEventMap, FetchTotalFileSizeEventMap } from '/new/events/downloadingEvents'
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
     * @type {number}
     */
    #totalFileSize

    /**
     * @type {GenericEvents<FetchTotalFileSizeEventMap>}
     */
    #fetchTotalFileSizeEvents

    /**
     * @type {number}
     */
    #downloadedFileSize

    /**
     * @type {GenericEvents<DownloadedFileSizeEventMap>}
     */
    #downloadedFileSizeEvents

    /**
     * @type {number}
     */
    #downloadedFilesCount

    /**
     * @type {GenericEvents<DownloadedFilesCountEventMap>}
     */
    #downloadedFilesCountEvents

    /**
     * @type {readonly LimitedUrlDownloader[]}
     */
    get urlDownloaders() {
        return this.#urlDownloaders.map(ud => ud.limitedUrlDownloader)
    }

    get totalFileSize() {
        return this.#totalFileSize
    }

    get downloadedFileSize() {
        return this.#downloadedFileSize
    }

    get downloadedFilesCount() {
        return this.#downloadedFilesCount
    }

    get fetchTotalFileSizeEvents() {
        return this.#fetchTotalFileSizeEvents.genericEventsListener
    }

    get downloadedFileSizeEvents() {
        return this.#downloadedFileSizeEvents.genericEventsListener
    }

    get downloadedFilesCountEvents() {
        return this.#downloadedFilesCountEvents.genericEventsListener
    }

    /**
     * @param {string[]} urls
     */
    constructor(urls) {
        this.#urls = urls
        this.#urlDownloaders = []

        this.#totalFileSize = 0
        this.#downloadedFileSize = 0
        this.#downloadedFilesCount = 0

        this.#fetchTotalFileSizeEvents = new GenericEvents()
        this.#downloadedFileSizeEvents = new GenericEvents()
        this.#downloadedFilesCountEvents = new GenericEvents()

        this.#createUrlDownloaders()
    }

    #createUrlDownloaders() {
        for (const url of this.#urls) {
            const urlDownloader = new UrlDownloader(url)
            this.#urlDownloaders.push(urlDownloader)
        }
    }

    async downloadAll() {
        await Promise.allSettled(this.#urlDownloaders.map(async urlDownloader => {
            const rmEvt = urlDownloader.downloadEvents.addEventListener("downloadprogress", e => {
                this.#downloadedFileSize += e.detail.loadedBytes
                this.#downloadedFileSizeEvents.dispatchEvent("progress", { size: e.detail.loadedBytes })
            })

            const blob = await urlDownloader.download()
            rmEvt()

            this.#downloadedFilesCount++
            this.#downloadedFilesCountEvents.dispatchEvent("progress", { count: this.#downloadedFilesCount })

            return blob
        }))

        return this.#downloadedFileSize
    }

    async fetchTotalFileSize() {
        this.#fetchTotalFileSizeEvents.dispatchEvent("fetchstarted", null)
        await Promise.allSettled(this.#urlDownloaders.map(async urlDownloader => {
            const fileSize = await urlDownloader.fetchFileSize()
            this.#fetchTotalFileSizeEvents.dispatchEvent("progress", { size: fileSize })

            this.#totalFileSize += fileSize

            return fileSize
        }))

        this.#fetchTotalFileSizeEvents.dispatchEvent("fetchfinished", null)

        return this.#totalFileSize
    }
}