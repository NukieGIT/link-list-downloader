export type DownloadEventTypesMap = {
    "downloadstarted": { id: number }
    "downloaderror": { id: number, status: number, statusText: string }
    "downloadprogress": { id: number, loadedBytes: number }
    "downloadfinished": { id: number }
}

export type FetchFileSizeEventMap = {
    "fetchfilesizestarted": { id: number }
    "fetchfilesizefinished": { id: number }
}

export type CountBlobFromResponseLengthProgressEventMap = {
    "progress": number
}