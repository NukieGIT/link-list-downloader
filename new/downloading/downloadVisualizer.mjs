/**
 * @import DownloadManager from './downloadManager.mjs'
 * @import UrlDownloader from './urlDownloader.mjs'
 * @import { LimitedUrlDownloader } from './urlDownloader'
 */

import NamedProgressBarComponent from '../components/namedProgressBarComponent.mjs'
import { convertDataUnit, getDataUnit } from '../utils.mjs'

export default class DownloadVisualizer {
    /**
     * @type {DownloadManager}
     */
    #downloadManager

    /**
     * @type {HTMLElement}
     */
    #targetTotalElement

    /**
     * @type {HTMLElement}
     */
    #targetDownloadsElement

    /**
     * @type {Map<Omit<UrlDownloader, "fetchFileSize" | "download" | "close">, NamedProgressBarComponent>}
     */
    #progressBarMap = new Map()

    /**
     * @type {NamedProgressBarComponent}
     */
    #totalProgressBar

    /**
     * @param {DownloadManager} downloadManager
     * @param {HTMLElement} targetTotalElement
     * @param {HTMLElement} targetDownloadsElement
     */
    constructor(downloadManager, targetTotalElement, targetDownloadsElement) {
        this.#downloadManager = downloadManager
        this.#targetTotalElement = targetTotalElement
        this.#targetDownloadsElement = targetDownloadsElement

        this.#prepare()
    }
    
    #prepare() {
        this.#prepareTotalProgressBar()

        for (const urlDownloader of this.#downloadManager.urlDownloaders) {
            this.#createProgressBars(urlDownloader)
            this.#registerEvents(urlDownloader)
        }
    }

    /**
     * @param {LimitedUrlDownloader} urlDownloader 
     */
    #createProgressBars(urlDownloader) {
        const progressBar = new NamedProgressBarComponent()

        progressBar.name = urlDownloader.fileName
        progressBar.unitConverter = DownloadVisualizer.#unitConverter

        this.#progressBarMap.set(urlDownloader, progressBar)
    }

    #prepareTotalProgressBar() {
        this.#totalProgressBar = new NamedProgressBarComponent()

        this.#totalProgressBar.name = "Total"
        this.#totalProgressBar.unitConverter = DownloadVisualizer.#unitConverter

        this.#downloadManager.fetchTotalFileSizeEvents.addEventListener("fetchstarted", e => {
            this.#targetTotalElement.appendChild(this.#totalProgressBar)
        })

        this.#downloadManager.fetchTotalFileSizeEvents.addEventListener("fetchfinished", e => {
            this.#totalProgressBar.max = this.#downloadManager.totalFileSize
        })

        this.#downloadManager.downloadedFileSizeEvents.addEventListener("progress", e => {
            this.#totalProgressBar.value = this.#downloadManager.downloadedFileSize
        })
    }

    /**
     * @param {LimitedUrlDownloader} urlDownloader 
     */
    #registerEvents(urlDownloader) {
        const progressBar = this.#progressBarMap.get(urlDownloader)

        urlDownloader.fetchFileSizeEvents.addEventListener("fetchfilesizestarted", e => {
            this.#targetDownloadsElement.appendChild(progressBar)
        })
        
        urlDownloader.fetchFileSizeEvents.addEventListener("fetchfilesizefinished", e => {
            progressBar.max = urlDownloader.fileSize
        })

        urlDownloader.downloadEvents.addEventListener("downloadprogress", e => {
            progressBar.value = urlDownloader.downloadedFileSize
        })

        urlDownloader.downloadEvents.addEventListener("downloadfinished", e => {
            this.#targetDownloadsElement.removeChild(progressBar)
        })
    }

    /**
     * @param {number} value 
     * @param {number} max 
     */
    static #unitConverter(value, max) {
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