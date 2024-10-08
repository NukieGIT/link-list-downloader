export type DownloadEventTypesMap = {
    "start": { id: number }
    "error": { id: number, status: number, statusText: string }
    "progress": { id: number, loadedBytes: number }
    "finish": { id: number }
}

export type FetchFileSizeEventMap = {
    "start": { id: number }
    "finish": { id: number }
}

export type CountBlobFromResponseLengthProgressEventMap = {
    "progress": { progress: number, totalProgress: number }
}

export type FetchTotalFileSizeEventMap = {
    "start": null
    "progress": { size: number}
    "finish": null
}

export type DownloadedFileSizeEventMap = {
    "progress": { size: number }
}

export type DownloadedFilesCountEventMap = {
    "progress": { count: number }
}