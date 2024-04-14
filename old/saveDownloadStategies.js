import { saveNewFile } from "./saveFile.js";
import { retrieveFileNameFromUrl } from "./utils.js";

export function saveWithAnchorOnFilesDownloadFinished(filesDownloadFinishedEvent) {
    for (const result of filesDownloadFinishedEvent.detail.results) {
        if (result.status === 'fulfilled') {
            const url = URL.createObjectURL(result.value.blob)

            const a = document.createElement('a')
            a.href = url

            const filename = retrieveFileNameFromUrl(result.value.response.url)
            a.download = filename || "index.html"

            a.click()
            URL.revokeObjectURL(url)
        } else {
            console.error(`Failed to fetch ${result.reason}`)
        }
    }
}

export function logOnFilesDownloadFinished(filesDownloadFinishedEvent) {
    for (const result of filesDownloadFinishedEvent.detail.results) {
        if (result.status === 'fulfilled') {
            const url = URL.createObjectURL(result.value.blob)

            const filename = retrieveFileNameFromUrl(result.value.response.url)

            console.log("Downloaded link: ", { url: result.value.response.url, blob: result.value.blob, filename })
            URL.revokeObjectURL(url)
        } else {
            console.error(`Failed to fetch ${result.reason}`)
        }
    }
}

export function buildSaveToUserSelectedDirectoryOnFilesDownloadFinished(downloadDirectoryHandleHolder) {
    return function saveToUserSelectedDirectoryOnFilesDownloadFinished(filesDownloadFinishedEvent) {
        for (const result of filesDownloadFinishedEvent.detail.results) {
            if (result.status === 'fulfilled') {
                const filename = retrieveFileNameFromUrl(result.value.response.url)
                saveNewFile(downloadDirectoryHandleHolder[0], result.value.blob, filename)
            } else {
                console.error(`Failed to fetch ${result.reason}`)
            }
        }
    }
}

export function getSupportedStrategy(downloadDirectoryHandleHolder, { debugOnly = false }) {
    const isShowDirectoryPickerSupported = 'showDirectoryPicker' in window

    if (debugOnly) {
        return logOnFilesDownloadFinished
    }

    if (isShowDirectoryPickerSupported) {
        return buildSaveToUserSelectedDirectoryOnFilesDownloadFinished(downloadDirectoryHandleHolder)
    }

    return saveWithAnchorOnFilesDownloadFinished
}