import type { EventMap } from "@/events/events"

export type DownloadEventTypesMap = {
    "start": { id: number }
    "error": { id: number, status: number, statusText: string }
    "progress": { id: number, loadedBytes: number }
    "finish": { id: number }
} & EventMap

export type FetchFileSizeEventMap = {
    "start": { id: number }
    "finish": { id: number }
} & EventMap

export type CountBlobFromResponseLengthProgressEventMap = {
    "progress": { progress: number, totalProgress: number }
} & EventMap

export type FetchTotalFileSizeEventMap = {
    "start": null
    "progress": { size: number}
    "finish": null
} & EventMap

export type DownloadedFileSizeEventMap = {
    "progress": { size: number }
} & EventMap

export type DownloadedFilesCountEventMap = {
    "progress": { count: number }
} & EventMap