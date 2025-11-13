import NamedProgressBarComponent from "@/components/namedProgressBarComponent"
import { getDataUnit, convertDataUnit } from "@/utils"
import DownloadManager from "./urlDownloader"
import MultiDownloadManager from "./downloadsManager"

export default class DownloadVisualizer {
    #_downloadsManager: MultiDownloadManager
    #_targetTotalElement: HTMLElement
    #_targetDownloadsElement: HTMLElement

    #_progressBarMap: Map<DownloadManager, NamedProgressBarComponent> = new Map()
    #_totalProgressBar: NamedProgressBarComponent | null = null

    constructor(downloadsManager: MultiDownloadManager, targetTotalElement: HTMLElement, targetDownloadsElement: HTMLElement) {
        this.#_downloadsManager = downloadsManager
        this.#_targetTotalElement = targetTotalElement
        this.#_targetDownloadsElement = targetDownloadsElement

        this.#prepare()
    }
    
    #prepare() {
        this.#prepareTotalProgressBar()

        for (const urlDownloader of this.#_downloadsManager.urlDownloadManagers) {
            this.#createProgressBars(urlDownloader)
            this.#registerEvents(urlDownloader)
        }
    }

    #createProgressBars(urlDownloader: DownloadManager) {
        const progressBar = new NamedProgressBarComponent()

        progressBar.name = urlDownloader.fileName
        progressBar.unitConverter = DownloadVisualizer.#unitConverter

        this.#_progressBarMap.set(urlDownloader, progressBar)
    }

    #prepareTotalProgressBar() {
        this.#_totalProgressBar = new NamedProgressBarComponent()

        this.#_totalProgressBar.name = "Total"
        this.#_totalProgressBar.unitConverter = DownloadVisualizer.#unitConverter

        this.#_downloadsManager.fetchTotalFileSizeEvents.addEventListener("start", () => {
            this.#_targetTotalElement.appendChild(this.#_totalProgressBar!)
        })

        this.#_downloadsManager.fetchTotalFileSizeEvents.addEventListener("finish", () => {
            this.#_totalProgressBar!.max = this.#_downloadsManager.totalFileSize
        })

        this.#_downloadsManager.downloadedFileSizeEvents.addEventListener("progress", () => {
            this.#_totalProgressBar!.value = this.#_downloadsManager.downloadedFileSize
        })
    }

    #registerEvents(urlDownloadManager: DownloadManager) {
        const progressBar = this.#_progressBarMap.get(urlDownloadManager)

        if (!progressBar) {
            return
        }

        urlDownloadManager.fileSizeEvents.addEventListener("start", () => {
            this.#_targetDownloadsElement.appendChild(progressBar)
        })
        
        urlDownloadManager.fileSizeEvents.addEventListener("finish", () => {
            progressBar.max = urlDownloadManager.fileSize
        })

        urlDownloadManager.downloadEvents.addEventListener("progress", () => {
            progressBar.value = urlDownloadManager.currentDownloadedFileSize
        })

        urlDownloadManager.downloadEvents.addEventListener("finish", () => {
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