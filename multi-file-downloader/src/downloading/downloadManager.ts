import { TypedEventTarget } from "@/events/events"
import { FetchTotalFileSizeEventMap, DownloadedFileSizeEventMap, DownloadedFilesCountEventMap } from "./types/downloadTypes"
import UrlDownloader from "./urlDownloader"

export default class DownloadManager {

    #_urls: string[]
    #_urlDownloaders: UrlDownloader[] = []
    #_totalFileSize: number = 0
    #_downloadedFileSize: number = 0
    #_downloadedFilesCount: number = 0

    #_fetchTotalFileSizeEvents: TypedEventTarget<FetchTotalFileSizeEventMap> = new TypedEventTarget()
    #_downloadedFileSizeEvents: TypedEventTarget<DownloadedFileSizeEventMap> = new TypedEventTarget()
    #_downloadedFilesCountEvents: TypedEventTarget<DownloadedFilesCountEventMap> = new TypedEventTarget()

    get urlDownloaders() {
        return this.#_urlDownloaders.map(ud => ud.limitedUrlDownloader)
    }

    get totalFileSize() {
        return this.#_totalFileSize
    }

    get downloadedFileSize() {
        return this.#_downloadedFileSize
    }

    get downloadedFilesCount() {
        return this.#_downloadedFilesCount
    }

    get fetchTotalFileSizeEvents() {
        return this.#_fetchTotalFileSizeEvents.eventListener
    }

    get downloadedFileSizeEvents() {
        return this.#_downloadedFileSizeEvents.eventListener
    }

    get downloadedFilesCountEvents() {
        return this.#_downloadedFilesCountEvents.eventListener
    }

    constructor(urls: string[]) {
        this.#_urls = urls

        this.#_createUrlDownloaders()
    }

    #_createUrlDownloaders() {
        for (const url of this.#_urls) {
            const urlDownloader = new UrlDownloader(url)
            this.#_urlDownloaders.push(urlDownloader)
        }
    }

    async downloadAll() {
        await Promise.allSettled(this.#_urlDownloaders.map(async urlDownloader => {
            const unsubscribeDownloadProgress = urlDownloader.downloadEvents.addEventListener("progress", e => {
                this.#_downloadedFileSize += e.detail.loadedBytes
                this.#_downloadedFileSizeEvents.dispatchEvent("progress", { size: e.detail.loadedBytes })
            })

            const blob = await urlDownloader.download()
            unsubscribeDownloadProgress()

            this.#_downloadedFilesCount++
            this.#_downloadedFilesCountEvents.dispatchEvent("progress", { count: this.#_downloadedFilesCount })

            return blob
        }))

        return this.#_downloadedFileSize
    }

    async fetchTotalFileSize() {
        this.#_fetchTotalFileSizeEvents.dispatchEvent("start", null)
        
        await Promise.allSettled(this.#_urlDownloaders.map(async urlDownloader => {
            const fileSize = await urlDownloader.fetchFileSize()
            this.#_fetchTotalFileSizeEvents.dispatchEvent("progress", { size: fileSize })

            this.#_totalFileSize += fileSize

            return fileSize
        }))

        this.#_fetchTotalFileSizeEvents.dispatchEvent("finish", null)

        return this.#_totalFileSize
    }
}