import UrlDownloader from "/new/downloading/urlDownloader.mjs"
import { ProgressBarComponent } from "/new/components/progressBarComponent.mjs"
import { formatBytes } from "/new/utils.mjs"

const progressBar = new ProgressBarComponent()

const ud = new UrlDownloader("https://link.testfile.org/250MB")

ud.downloadEvents.addEventListener("downloadprogress", (/** @type {CustomEvent} */ e) => {
    const fb = formatBytes(e.detail.length)
    progressBar.value = e.detail.length
})

document.body.appendChild(progressBar)

const fs = await ud.fetchFileSize()
progressBar.max = fs
// await ud.download()