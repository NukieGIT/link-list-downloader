import UrlDownloader from "/new/downloading/urlDownloader.mjs"
import { ProgressBarComponent } from "/new/components/progressBarComponent.mjs"
import { convertDataUnit, getDataUnit } from "/new/utils.mjs"

const progressBar = new ProgressBarComponent()

progressBar.unitConverter = (/** @type {number} */ value, /** @type {number} */ max) => {
    const maxDataUnit = getDataUnit(max)
    const convertedMax = convertDataUnit(max, "Bytes", maxDataUnit)
    const convertedValue = convertDataUnit(value, "Bytes", maxDataUnit)

    return {
        value: convertedValue,
        max: convertedMax,
        unit: maxDataUnit
    }
}

const ud = new UrlDownloader("https://link.testfile.org/250MB")

ud.downloadEvents.addEventListener("downloadprogress", (/** @type {CustomEvent} */ e) => {
    progressBar.value = e.detail.length
})

document.body.appendChild(progressBar)

const fs = await ud.fetchFileSize()
progressBar.max = fs
// await ud.download()