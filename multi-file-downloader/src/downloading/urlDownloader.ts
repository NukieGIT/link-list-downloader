import { IEventListener, TypedEventTarget } from "@/events/events"
import { GlobalIdGeneratorInstance } from "@/generation/idGenerator"
import { retrieveFileNameFromUrl } from "@/utils"
import { FetchFileSizeEventMap, DownloadEventTypesMap } from "./types/downloadTypes"
import { BlobFromResponseTracked } from "./blobFromResponse"

export default class UrlDownloader {
    #_id: number
    #_url: string
    #_fileName: string
    #_fileSize: number
    #_fetchedFile: Blob | null = null
    #_downloadedFileSize: number = 0

    #_fetchFileSizeEvents: TypedEventTarget<FetchFileSizeEventMap> = new TypedEventTarget()
    #_downloadEvents: TypedEventTarget<DownloadEventTypesMap> = new TypedEventTarget()

    static get UNKNOWN_FILE_SIZE() {
        return -1
    }

    // TODO: limitedUrlDownloader interface
    get limitedUrlDownloader() {
        return this
    }

    get id() {
        return this.#_id
    }

    get fetchFileSizeEvents(): IEventListener<FetchFileSizeEventMap> {
        return this.#_fetchFileSizeEvents.eventListener
    }

    get downloadEvents(): IEventListener<DownloadEventTypesMap> {
        return this.#_downloadEvents.eventListener
    }

    get fileName() {
        return this.#_fileName
    }

    get fileSize() {
        return this.#_fileSize;
    }

    get fetchedFile() {
        return this.#_fetchedFile;
    }

    get downloadedFileSize() {
        return this.#_downloadedFileSize
    }

    constructor(url: string) {
        this.#_id = GlobalIdGeneratorInstance.generateId();
        
        this.#_url = url;

        // TODO: retrieve file name from headers
        this.#_fileName = retrieveFileNameFromUrl(url);

        this.#_fileSize = UrlDownloader.UNKNOWN_FILE_SIZE;
    }

    /**
     * Fetches the file size from the URL and returns it.
     * 
     * @throws {FetchError} If the fetch gets a bad response.
     */
    async fetchFileSize(): Promise<number> {
        this.#_fetchFileSizeEvents.dispatchEvent("start", { id: this.#_id });

        const response = await fetch(this.#_url, { method: 'HEAD' });

        if (!response.ok) {
            // TODO: dispatch error event
            throw new FetchError(response.status, response.statusText);
        }

        const contentLength = response.headers.get("content-length") ?? UrlDownloader.UNKNOWN_FILE_SIZE.toString();
        this.#_fileSize = parseInt(contentLength);

        this.#_fetchFileSizeEvents.dispatchEvent("finish", { id: this.#_id });

        return this.fileSize;
    }
    
    /**
     * Downloads the file from the URL and returns a Blob.
     * 
     * @throws {FetchError} If the fetch gets a bad response.
     */
    async download(): Promise<Blob> {
        this.#_downloadEvents.dispatchEvent("start", { id: this.#_id });
        
        const response = await fetch(this.#_url)

        if (!response.ok) {
            this.#_downloadEvents.dispatchEvent("error", { id: this.#_id, status: response.status, statusText: response.statusText});
            throw new FetchError(response.status, response.statusText);
        }
        
        const reader = new BlobFromResponseTracked(response)
        const unsubscribeReaderProgress = reader.progressEvents.addEventListener('progress', e => {
            this.#_downloadedFileSize = e.detail.totalProgress;
            this.#_downloadEvents.dispatchEvent("progress", { id: this.#_id, loadedBytes: e.detail.progress });
        })
        
        const readBlob = await reader.toBlob()
        this.#_fetchedFile = readBlob

        unsubscribeReaderProgress()

        this.#_downloadEvents.dispatchEvent("finish", { id: this.#_id });

        return readBlob;
    }

    /**
     * Closes the downloader and releases the ID.
     */
    close() {
        GlobalIdGeneratorInstance.releaseId(this.#_id);
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
     * @param {number} status - The HTTP status code of the fetch error.
     * @param {string} statusText - The status text of the fetch error.
     */
    constructor(status: number, statusText: string) {
        super(`Fetch failed with status ${status} ${statusText}`);
        this.#_status = status;
        this.#_statusText = statusText;
    }
}