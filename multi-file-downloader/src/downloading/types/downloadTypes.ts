export type DownloadEventTypesMap = {
    "start": null
    "error": { status: number, statusText: string }
    "progress": { progressDelta: number }
    "finish": null
}

export type FetchFileSizeEventMap = {
    "start": null
    "finish": null
}

export type ToBlobEventMap = {
    "progress": { progressDelta: number, totalProgress: number }
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