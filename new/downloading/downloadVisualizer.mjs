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
     * @type {Map<Omit<UrlDownloader, "fetchFileSize" | "download" | "close">, NamedProgressBarComponent>}
     */
    #progressBarMap = new Map()

    /**
     * @param {DownloadManager} downloadManager
     */
    constructor(downloadManager) {
        this.#downloadManager = downloadManager

        this.#prepare()
    }
    
    #prepare() {
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

    /**
     * @param {LimitedUrlDownloader} urlDownloader 
     */
    #registerEvents(urlDownloader) {
        const progressBar = this.#progressBarMap.get(urlDownloader)

        
    }

}