import { IEventController, TypedEventTarget } from "@/events/events"
import { retrieveFileNameFromUrl } from "@/utils"
import { FetchFileSizeEventMap, DownloadEventTypesMap } from "./types/downloadTypes"
import { BlobFromResponseTracked } from "./blobFromResponse"

export enum FetchState {
    IDLE,
    FETCHING,
    FINISHED,
    ERROR
}

export default class DownloadManager {
    #_url: string
    #_fileName: string

    #_fileSizeFetcher: FileSizeFetcher
    #_urlDownloader: UrlDownloader

    // TODO: limitedUrlDownloadManager interface
    get limitedUrlDownloadManager() {
        return this
    }

    get fileName() {
        return this.#_fileName
    }

    get url() {
        return this.#_url
    }

    get fileSize() {
        return this.#_fileSizeFetcher.fileSize
    }

    get currentDownloadedFileSize() {
        return this.#_urlDownloader.downloadedFileSize
    }

    get downloadState() {
        return this.#_urlDownloader.state
    }

    get downloadTriesCount() {
        return this.#_urlDownloader.downloadTriesCount
    }

    get fileSizeEvents() {
        return this.#_fileSizeFetcher.fetchFileSizeEvents
    }

    get downloadEvents() {
        return this.#_urlDownloader.downloadEvents
    }

    constructor(url: string) {
        this.#_url = url;

        this.#_fileSizeFetcher = new FileSizeFetcher(url);
        this.#_urlDownloader = new UrlDownloader(url);

        // TODO: retrieve file name from headers
        this.#_fileName = retrieveFileNameFromUrl(url);
    }

    /**
     * Fetches the file size from the URL and returns it.
     * 
     * @throws {FetchError} If the fetch gets a bad response.
     */
    async fetchFileSize(): Promise<number> {
        return await this.#_fileSizeFetcher.fetchFileSize();
    }
    
    /**
     * Downloads the file from the URL and returns a Blob.
     * 
     * @throws {FetchError} If the fetch gets a bad response.
     */
    async download(): Promise<Blob> {
        return await this.#_urlDownloader.download();
    }
}

export class FileSizeFetcher {
    #_url: string
    #_fileSize: number = FileSizeFetcher.UNKNOWN_FILE_SIZE

    #_fetchFileSizeEvents: TypedEventTarget<FetchFileSizeEventMap> = new TypedEventTarget()

    get fileSize() {
        return this.#_fileSize;
    }

    get fetchFileSizeEvents(): IEventController<FetchFileSizeEventMap> {
        return this.#_fetchFileSizeEvents.eventListener
    }

    static get UNKNOWN_FILE_SIZE() {
        return -1
    }

    constructor(url: string) {
        this.#_url = url;
    }

    /**
     * Fetches the file size from the URL and returns it.
     * 
     * @throws {FetchError} If the fetch gets a bad response.
     */
    async fetchFileSize(): Promise<number> {
        this.#_fetchFileSizeEvents.dispatchEvent("start", null);

        const response = await fetch(this.#_url, { method: "HEAD" });

        if (!response.ok) {
            throw new FetchError(response.status, response.statusText);
        }

        const contentLength = response.headers.get("content-length") ?? FileSizeFetcher.UNKNOWN_FILE_SIZE.toString();
        this.#_fileSize = parseInt(contentLength);
        
        this.#_fetchFileSizeEvents.dispatchEvent("finish", null);
        return this.#_fileSize;
    }
}


export class UrlDownloader {
    #_url: string
    #_fetchedFile: Blob | null = null
    #_downloadedFileSize: number = 0
    #_state: FetchState = FetchState.IDLE
    #_downloadTriesCount: number = 0

    #_downloadEvents: TypedEventTarget<DownloadEventTypesMap> = new TypedEventTarget()

    get fetchedFile() {
        return this.#_fetchedFile;
    }

    get downloadedFileSize() {
        return this.#_downloadedFileSize
    }

    get state() {
        return this.#_state
    }

    get downloadTriesCount() {
        return this.#_downloadTriesCount
    }

    get downloadEvents(): IEventController<DownloadEventTypesMap> {
        return this.#_downloadEvents.eventListener
    }

    constructor(url: string) {
        this.#_url = url;
    }

    async download(): Promise<Blob> {
        if (this.#_state === FetchState.FETCHING) {
            throw new Error("Download already in progress.");
        }

        this.#_downloadTriesCount++
        
        this.#_state = FetchState.FETCHING
        this.#_downloadEvents.dispatchEvent("start", null);
        
        // TODO: handle if there's no internet connection
        const response = await fetch(this.#_url)

        if (!response.ok) {
            this.#_state = FetchState.ERROR
            this.#_downloadEvents.dispatchEvent("error", { status: response.status, statusText: response.statusText});
            throw new FetchError(response.status, response.statusText);
        }
        
        const reader = new BlobFromResponseTracked(response)
        const unsubscribeReaderProgress = reader.progressEvents.addEventListener('progress', e => {
            this.#_downloadedFileSize = e.detail.totalProgress;
            this.#_downloadEvents.dispatchEvent("progress", { progressDelta: e.detail.progressDelta });
        })
        
        const readBlob = await reader.toBlob()
        this.#_fetchedFile = readBlob

        unsubscribeReaderProgress()

        this.#_state = FetchState.FINISHED
        this.#_downloadEvents.dispatchEvent("finish", null);

        return readBlob;
    }
}

/**
 * Custom error class for fetch errors.
 */
export class FetchError extends Error {
    #_status: number
    #_statusText: string
    
    /**
     * The HTTP status code of the fetch error.
     */
    get status() {
        return this.#_status;
    }
    
    /**
     * The status text of the fetch error.
     */
    get statusText() {
        return this.#_statusText;
    }

    /**
     * Creates a new FetchError instance.
     * @param status - The HTTP status code of the fetch error.
     * @param statusText - The status text of the fetch error.
     */
    constructor(status: number, statusText: string) {
        super(`Fetch failed with status ${status} ${statusText}`);
        this.#_status = status;
        this.#_statusText = statusText;
    }
}