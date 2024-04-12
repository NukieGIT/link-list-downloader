import { isValidFileType, isValidUrl } from "./utils.js"

const linksForm = document.getElementById('links-form')

linksForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(linksForm)
    const fileData = formData.getAll('file-input')
    const textData = formData.get('text-input')

    const links = await getLinks(fileData, textData)
    
    await downloadFromUrls(links)
})

document.addEventListener("filesdownloadstarted", (filesDownloadStartedEvent) => {
    let totalProgressBar = cloneProgressBar("total-progress", { progressMax: filesDownloadStartedEvent.detail.urls.length, defaultProgressValue: 0 })
    document.body.appendChild(totalProgressBar.progressClone)
    document.addEventListener("filedownloadfinished", (fileDownloadFinishedEvent) => {
        totalProgressBar.setProgressValue(totalProgressBar.getProgressValue() + 1)
    })
})

async function downloadFromUrls(urls) {
    document.dispatchEvent(new CustomEvent("filesdownloadstarted", {
        detail: {
            urls
        }
    }))
    
    const results = await Promise.allSettled(urls.map(url => downloadWithEvents(url)))
    
    document.dispatchEvent(new CustomEvent("filesdownloadfinished", {
        detail: {
            results
        }
    }))

    for (const result of results) {
        if (result.status === 'fulfilled') {
            const url = URL.createObjectURL(result.value.blob)

            const a = document.createElement('a')
            a.href = url

            const filename = result.value.response.url.split('#').shift().split('?').shift().split('/').pop()
            a.download = filename || "index.html"

            // a.click()
            console.log("Downloaded link: ", result.value.response.url)
            URL.revokeObjectURL(url)
        } else {
            console.error(`Failed to fetch ${result.reason}`)
        }
    }
}

const progressTemplate = document.querySelector('#file-download-progress-template')

/**
 * @typedef {Object} ProgressBar
 * @property {HTMLLabelElement} label - The label element of the progress bar.
 * @property {HTMLProgressElement} progress - The progress element of the progress bar.
 * @property {function(number): void} setProgressValue - Sets the value of the progress bar.
 * @property {function(): number} getProgressValue - Gets the value of the progress bar.
 */

/**
 * Creates a clone of a progress bar template.
 *
 * @param {string} id - The ID of the progress bar.
 * @param {Object} progressOptions - The options for the progress bar.
 * @param {string} progressOptions.displayText - The text to display on the progress bar.
 * @param {number} progressOptions.progressMax - The maximum value of the progress bar.
 * @param {number} progressOptions.defaultProgressValue - The default value of the progress bar.
 * @returns {ProgressBar} An object containing the cloned progress bar elements and utility functions.
 * 
 * @example
 * // HTML template structure
 * <template id="file-download-progress-template">
 *     <label for=""></label>
 *     <progress id="" max="100" value="0"></progress>
 * </template>
 */
function cloneProgressBar(id, progressOptions = { displayText: id, progressMax: 100, defaultProgressValue: 0 }) {
    const progressClone = progressTemplate.content.cloneNode(true)

    const label = progressClone.querySelector('label')
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

    label.for = id
    label.textContent = id

    progress.id = id
    progress.value = progressOptions.defaultProgressValue
    progress.max = progressOptions.progressMax

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

    function getProgressValue() {
        return progress.value
    }

    return {
        progressClone,
        label,
        progress,
        setProgressValue,
        getProgressValue
    }
}

async function downloadWithEvents(url) {
    document.dispatchEvent(new CustomEvent("filedownloadstarted", {
        detail: {
            url
        }
    }))

    const response = await fetch(url)

    const fileSize = response.headers.get('Content-Length');
    console.log(fileSize);

    const blob = await response.blob()

    document.dispatchEvent(new CustomEvent("filedownloadfinished", {
        detail: {
            url
        }
    }))

    return { response, blob }
}

/**
 * Retrieves links from the provided file data and text data.
 * 
 * @param {Array<File>} fileData - An array of File objects.
 * @param {string} textData - The text data containing links.
 * @returns {Array<string>} - An array of valid links.
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

function getFileSize() {
    
}

// copilot magic help
// async function downloadWithSpeed(url) {
//     const response = await fetch(url)
//     const reader = response.body.getReader()
//     let bytesReceived = 0
//     let downloadStartTime = performance.now()

//     while (true) {
//         const { done, value } = await reader.read()
//         if (done) {
//             break
//         }
//         bytesReceived += value.length
//         const durationInSeconds = (performance.now() - downloadStartTime) / 1000
//         const speedInBytesPerSecond = bytesReceived / durationInSeconds
//         // console.log(`Download speed: ${formatBytes(speedInBytesPerSecond)} /s`)
//         console.log(`Download speed: ${speedInBytesPerSecond} /s`)
//     }

//     return response
// }