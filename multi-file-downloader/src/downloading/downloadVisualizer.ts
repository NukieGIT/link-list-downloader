import NamedProgressBarComponent from "@/components/namedProgressBarComponent"
import { getDataUnit, convertDataUnit } from "@/utils"
import DownloadManager from "./downloadManager"
import UrlDownloader from "./urlDownloader"

export default class DownloadVisualizer {
    #_downloadManager: DownloadManager
    #_targetTotalElement: HTMLElement
    #_targetDownloadsElement: HTMLElement

    #_progressBarMap: Map<Omit<UrlDownloader, "fetchFileSize" | "download" | "close">, NamedProgressBarComponent> = new Map()
    #_totalProgressBar: NamedProgressBarComponent | null = null

    constructor(downloadManager: DownloadManager, targetTotalElement: HTMLElement, targetDownloadsElement: HTMLElement) {
        this.#_downloadManager = downloadManager
        this.#_targetTotalElement = targetTotalElement
        this.#_targetDownloadsElement = targetDownloadsElement

        this.#prepare()
    }
    
    #prepare() {
        this.#prepareTotalProgressBar()

        for (const urlDownloader of this.#_downloadManager.urlDownloaders) {
            this.#createProgressBars(urlDownloader)
            this.#registerEvents(urlDownloader)
        }
    }

    #createProgressBars(urlDownloader: UrlDownloader) {
        const progressBar = new NamedProgressBarComponent()

        progressBar.name = urlDownloader.fileName
        progressBar.unitConverter = DownloadVisualizer.#unitConverter

        this.#_progressBarMap.set(urlDownloader, progressBar)
    }

    #prepareTotalProgressBar() {
        this.#_totalProgressBar = new NamedProgressBarComponent()

        this.#_totalProgressBar.name = "Total"
        this.#_totalProgressBar.unitConverter = DownloadVisualizer.#unitConverter

        this.#_downloadManager.fetchTotalFileSizeEvents.addEventListener("start", () => {
            this.#_targetTotalElement.appendChild(this.#_totalProgressBar!)
        })

        this.#_downloadManager.fetchTotalFileSizeEvents.addEventListener("finish", () => {
            this.#_totalProgressBar!.max = this.#_downloadManager.totalFileSize
        })

        this.#_downloadManager.downloadedFileSizeEvents.addEventListener("progress", () => {
            this.#_totalProgressBar!.value = this.#_downloadManager.downloadedFileSize
        })
    }

    #registerEvents(urlDownloader: UrlDownloader) {
        const progressBar = this.#_progressBarMap.get(urlDownloader)

        if (!progressBar) {
            return
        }

        urlDownloader.fetchFileSizeEvents.addEventListener("start", () => {
            this.#_targetDownloadsElement.appendChild(progressBar)
        })
        
        urlDownloader.fetchFileSizeEvents.addEventListener("finish", () => {
            progressBar.max = urlDownloader.fileSize
        })

        urlDownloader.downloadEvents.addEventListener("progress", () => {
            progressBar.value = urlDownloader.downloadedFileSize
        })

        urlDownloader.downloadEvents.addEventListener("finish", () => {
            this.#_targetDownloadsElement.removeChild(progressBar)
        })
    }

    static #unitConverter(value: number, max: number) {
        const maxDataUnit = getDataUnit(max)
        const convertedMax = convertDataUnit(max, "Bytes", maxDataUnit)
        const convertedValue = convertDataUnit(value, "Bytes", maxDataUnit)

        return {
            value: parseFloat(convertedValue.toFixed(2)),
            max: parseFloat(convertedMax.toFixed(2)),
            unit: maxDataUnit
        }
    }

}