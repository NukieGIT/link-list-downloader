import { isValidFileType, isValidUrl, formatBytes } from "./utils.js"
import { getSupportedStrategy } from "./saveDownloadStategies.js";

const linksForm = document.getElementById('links-form')
const progressTemplate = document.querySelector('#file-download-progress-template')
const singleFileProgressTemplate = document.querySelector('#single-file-progress-template')

let downloadDirectoryHandleHolder = [null]
const onFilesDownloadFinished = getSupportedStrategy(downloadDirectoryHandleHolder, { debugOnly: true })

linksForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    if ('showDirectoryPicker' in window) {
        downloadDirectoryHandleHolder[0] = await window.showDirectoryPicker()
    }

    const formData = new FormData(linksForm)
    const fileData = formData.getAll('file-input')
    const textData = formData.get('text-input')

    const links = await getLinks(fileData, textData)

    await downloadFromUrls(links)
})

document.addEventListener("filesdownloadstarted", (filesDownloadStartedEvent) => {
    let totalProgressBar = cloneTotalProgressBar(
        "total-progress",
        {
            displayText: "Total Progress",
            progressMax: filesDownloadStartedEvent.detail.urls.length
        })
    document.body.appendChild(totalProgressBar.progressClone)

    document.addEventListener("totalfilesizecalculated", (totalFileSizeCalculatedEvent) => {
        totalProgressBar.setFileSizeProgress(totalFileSizeCalculatedEvent.detail.totalFileSize)
    })

    document.addEventListener("filedownloadfinished", (fileDownloadFinishedEvent) => {
        totalProgressBar.setProgressValue(totalProgressBar.getProgressValue() + 1)
    })

    document.addEventListener("filesdownloadfinished", onFilesDownloadFinished)
})

async function downloadFromUrls(urls) {
    document.dispatchEvent(new CustomEvent("filesdownloadstarted", {
        detail: {
            urls
        }
    }))

    await calculateContentSizeAndDispatch(urls);

    const downloadResults = await Promise.allSettled(urls.map(url => downloadUrlWithEvents(url)))

    document.dispatchEvent(new CustomEvent("filesdownloadfinished", {
        detail: {
            results: downloadResults
        }
    }))
}

async function calculateContentSizeAndDispatch(urls) {
    const headRequests = urls.map(url => fetch(url, { method: 'HEAD' }));

    const headResponses = await Promise.allSettled(headRequests);

    let totalFileSize = 0;

    for (const headResponse of headResponses) {
        if (headResponse.status === 'fulfilled') {
            const contentLength = headResponse.value.headers.get('Content-Length');
            totalFileSize += contentLength ? parseInt(contentLength) : 0;
        }
    }

    document.dispatchEvent(new CustomEvent("totalfilesizecalculated", {
        detail: {
            totalFileSize
        }
    }));
}

/**
 * @typedef {Object} ProgressBar
 * @property {HTMLLabelElement} label - The label element of the progress bar.
 * @property {HTMLProgressElement} progress - The progress element of the progress bar.
 * @property {function(number): void} setProgressValue - Sets the value of the progress bar.
 * @property {function(): number} getProgressValue - Gets the value of the progress bar.
 * @property {function(number): void} setProgressMax - Sets the maximum value of the progress bar.
 * @property {function(number): void} setFileSizeProgress - Sets the value of the file size progress bar.
 * @property {function(): number} getFileSizeProgress - Gets the value of the file size progress bar.
 */
/**
 * Creates a clone of a progress bar template.
 *
 * @param {string} id - The ID of the progress bar.
 * @param {Object} progressOptions - The options for the progress bar.
 * @param {string} [progressOptions.displayText=id] - The display text of the progress bar.
 * @param {number} [progressOptions.progressMax=100] - The maximum value of the progress bar.
 * @param {number} [progressOptions.defaultProgressValue=0] - The default value of the progress bar.
 * @returns {ProgressBar} An object containing the cloned progress bar elements and utility functions.
 * 
 * @example
 * // HTML template structure
 * <template id="file-download-progress-template">
 *     <label for=""></label>
 *     <progress id="" max="100" value="0"></progress>
 * </template>
 */
function cloneTotalProgressBar(id, { displayText = id, progressMax = 100, defaultProgressValue = 0 }) {
    const progressClone = progressTemplate.content.cloneNode(true)

    let fileSizeProgressValue = 0;

    const title = progressClone.querySelector('#file-download-progress__title')
    const progress = progressClone.querySelector('progress')
    const progressText = progressClone.querySelector('#text-progress')
    const fileSizeProgress = progressClone.querySelector('#file-size-progress')
    const progressType = progressClone.querySelector('#progress-type')

    progressType.addEventListener("change", (e) => {
        if (progressType.checked) {
            textProgressFormat = countTextFormat
        } else {
            textProgressFormat = percentageTextFormat
        }
        updateTextView()
    })

    title.for = id
    title.textContent = displayText

    progress.id = id
    progress.value = defaultProgressValue
    progress.max = progressMax

    const percentageTextFormat = (newValue, progressMax) => `${Math.round((newValue / progressMax) * 100)}%`
    const countTextFormat = (newValue, progressMax) => `${newValue} / ${progressMax}`

    let textProgressFormat = percentageTextFormat

    function updateTextView() {
        progressText.textContent = textProgressFormat(progress.value, progress.max)
    }

    function setProgressValue(newValue) {
        progress.value = newValue
        updateTextView()
    }

    function setProgressMax(newValue) {
        progress.max = newValue
    }

    function setFileSizeProgress(newValue) {
        fileSizeProgress.textContent = formatBytes(newValue)
        fileSizeProgressValue = newValue
    }

    function getFileSizeProgress() {
        return fileSizeProgressValue
    }

    function getProgressValue() {
        return progress.value
    }

    return {
        progressClone,
        label: title,
        progress,
        setProgressValue,
        getProgressValue,
        setProgressMax,
        setFileSizeProgress,
        getFileSizeProgress
    }
}

/**
 * Creates a clone of a progress bar template.
 *
 * @param {string} id - The ID of the progress bar.
 * @param {Object} progressOptions - The options for the progress bar.
 * @param {string} [progressOptions.displayText=id] - The display text of the progress bar.
 * @param {number} [progressOptions.progressMax=100] - The maximum value of the progress bar.
 * @param {number} [progressOptions.defaultProgressValue=0] - The default value of the progress bar.
 * @returns {ProgressBar} An object containing the cloned progress bar elements and utility functions.
 * 
 * @example
 * // HTML template structure
 * <template id="file-download-progress-template">
 *     <label for=""></label>
 *     <progress id="" max="100" value="0"></progress>
 * </template>
 */
function cloneFileProgressBar(id, { displayText = id, progressMax = 100, defaultProgressValue = 0 }) {
    const progressClone = progressTemplate.content.cloneNode(true)

    const downloadTarget = progressClone.querySelector('#download-target')
    const downloadTargetType = progressClone.querySelector('#download-target-type')
    const progress = progressClone.querySelector('progress')
    const progressText = progressClone.querySelector('#text-progress')
    const progressType = progressClone.querySelector('#progress-type')


    progressType.addEventListener("change", (e) => {
        if (progressType.checked) {
            textProgressFormat = countTextFormat
        } else {
            textProgressFormat = percentageTextFormat
        }
        updateTextView()
    })

    downloadTarget.for = id
    downloadTarget.textContent = displayText

    progress.id = id
    progress.value = defaultProgressValue
    progress.max = progressMax

    const percentageTextFormat = (newValue, progressMax) => `${Math.round((newValue / progressMax) * 100)}%`
    const countTextFormat = (newValue, progressMax) => `${newValue} / ${progressMax}`

    let textProgressFormat = percentageTextFormat

    function updateTextView() {
        progressText.textContent = textProgressFormat(progress.value, progress.max)
    }

    function setProgressValue(newValue) {
        progress.value = newValue
        updateTextView()
    }

    function setProgressMax(newValue) {
        progress.max = newValue
    }

    function getProgressValue() {
        return progress.value
    }

    return {
        progressClone,
        label: downloadTarget,
        progress,
        setProgressValue,
        getProgressValue,
        setProgressMax
    }
}

/**
 * Downloads a file from the specified URL and dispatches custom events during the download process.
 * @param {string} url - The URL of the file to download.
 * @returns {Promise<{ response: Response, blob: Blob }>} A promise that resolves to an object containing the response and blob of the downloaded file.
 */
async function downloadUrlWithEvents(url) {
    document.dispatchEvent(new CustomEvent("filedownloadstarted", {
        detail: {
            url,
        }
    }))

    const response = await fetch(url)

    document.dispatchEvent(new CustomEvent("onresponsereceived", {
        detail: {
            url,
            response
        }
    }))

    const blob = await getBlobFromResponseUsingReader(response)

    document.dispatchEvent(new CustomEvent("filedownloadfinished", {
        detail: {
            url,
            blob
        }
    }))

    return { response, blob }
}

async function getBlobFromResponseUsingReader(response) {
    const reader = response.body.getReader()
    const contentLength = response.headers.get('Content-Length')
    const validatedContentLength = contentLength ? parseInt(contentLength) : -1

    const chunks = []
    let receivedLength = 0

    while (true) {
        const { done, value: chunk } = await reader.read();
        if (done) {
            break;
        }
        chunks.push(chunk);
        receivedLength += chunk.length;

        document.dispatchEvent(new CustomEvent("filedownloadprogress", {
            detail: {
                receivedLength,
                contentLength: validatedContentLength
            }
        }))
    }

    return new Blob(chunks, { type: response.headers.get('Content-Type') })
}

/**
 * Retrieves links from the provided file data and text data.
 * 
 * @param {File[]} fileData - An array of File objects.
 * @param {string} textData - The text data containing links.
 * @returns {Promise<string[]>} An array of valid links.
 */
async function getLinks(fileData, textData) {
    const links = []

    const validTextInputLinks = textData.split('\n').filter(isValidUrl)
    links.push(...validTextInputLinks)

    if (fileData) {
        for (const file of fileData) {
            if (isValidFileType(file)) {
                const text = await file.text()
                const fileLinks = text.split('\n').filter(isValidUrl)
                links.push(...fileLinks)
            }
        }
    }

    return links
}