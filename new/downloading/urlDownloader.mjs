import GenericEvents from "../events/events.mjs";
import { GlobalIdGeneratorInstance } from "../generation/idGenerator.mjs";
import { retrieveFileNameFromUrl } from "../utils.mjs";
import { CountBlobFromResponseLengthProgress } from "./blobFromResponse.mjs";

/**
 * @import { FetchFileSizeEventMap, DownloadEventTypesMap } from '/new/events/downloadingEvents'
 * @import { GenericEventListener } from '/new/events/events'
 * @import { LimitedUrlDownloader } from './urlDownloader'
 */

export default class UrlDownloader {

    /**
     * @type {number}
     */
    #id

    /**
     * @type {string}
     */
    #url
    /**
     * @type {string}
     */
    #fileName
    /**
     * @type {number}
     */
    #fileSize
    /**
     * @type {Blob}
     */
    #fetchedFile

    /**
     * @type {number}
     */
    #downloadedFileSize = 0

    /**
     * @type {GenericEvents<FetchFileSizeEventMap>}
     */
    #fetchFileSizeEvents
    /**
     * @type {GenericEvents<DownloadEventTypesMap>}
     */
    #downloadEvents

    static get UNKNOWN_FILE_SIZE() {
        return -1
    }

    /**
     * @returns {LimitedUrlDownloader}
     */
    get limitedUrlDownloader() {
        return this
    }

    get id() {
        return this.#id
    }

    /**
     * @returns {GenericEventListener<FetchFileSizeEventMap>}
     */
    get fetchFileSizeEvents() {
        return this.#fetchFileSizeEvents.genericEventsListener
    }

    /**
     * @returns {GenericEventListener<DownloadEventTypesMap>}
     */
    get downloadEvents() {
        return this.#downloadEvents.genericEventsListener
    }

    get fileName() {
        return this.#fileName
    }

    get fileSize() {
        return this.#fileSize;
    }

    get fetchedFile() {
        return this.#fetchedFile;
    }

    get downloadedFileSize() {
        return this.#downloadedFileSize
    }

    /**
     * @param {string} url
     */
    constructor(url) {
        this.#id = GlobalIdGeneratorInstance.generateId();
        
        this.#url = url;

        // TODO: retrieve file name from headers
        this.#fileName = retrieveFileNameFromUrl(url);

        this.#fileSize = UrlDownloader.UNKNOWN_FILE_SIZE;

        this.#fetchFileSizeEvents = new GenericEvents();
        this.#downloadEvents = new GenericEvents();
    }

    /**
     * Fetches the file size from the URL and returns it.
     * 
     * @returns {Promise<number>}
     * @throws {FetchError} If the fetch gets a bad response.
     */
    async fetchFileSize() {
        this.#fetchFileSizeEvents.dispatchEvent("start", { id: this.#id });

        const response = await fetch(this.#url, { method: 'HEAD' });

        if (!response.ok) {
            // TODO: dispatch error event
            throw new FetchError(response.status, response.statusText);
        }

        this.#fileSize = parseInt(response.headers.get('Content-Length')) ?? UrlDownloader.UNKNOWN_FILE_SIZE;

        this.#fetchFileSizeEvents.dispatchEvent("finish", { id: this.#id });

        return this.fileSize;
    }
    
    /**
     * Downloads the file from the URL and returns a Blob.
     * 
     * @returns {Promise<Blob>}
     * @throws {FetchError} If the fetch gets a bad response.
     */
    async download() {
        this.#downloadEvents.dispatchEvent("start", { id: this.#id });
        
        const response = await fetch(this.#url)

        if (!response.ok) {
            this.#downloadEvents.dispatchEvent("error", { id: this.#id, status: response.status, statusText: response.statusText});
            throw new FetchError(response.status, response.statusText);
        }
        
        const reader = new CountBlobFromResponseLengthProgress(response)
        const unsubscribeReaderProgress = reader.progressEvents.addEventListener('progress', e => {
            this.#downloadedFileSize = e.detail.totalProgress;
            this.#downloadEvents.dispatchEvent("progress", { id: this.#id, loadedBytes: e.detail.progress });
        })
        
        this.#fetchedFile = await reader.toBlob()

        unsubscribeReaderProgress()

        this.#downloadEvents.dispatchEvent("finish", { id: this.#id });

        return this.fetchedFile;
    }

    /**
     * Closes the downloader and releases the ID.
     */
    close() {
        GlobalIdGeneratorInstance.releaseId(this.#id);
    }
}

/**
 * Custom error class for fetch errors.
 * @extends Error
 */
export class FetchError extends Error {
    /**
     * The HTTP status code of the fetch error.
     * @type {number}
     */
    #status

    /**
     * The status text of the fetch error.
     * @type {string}
     */
    #statusText

    get status() {
        return this.#status;
    }

    get statusText() {
        return this.#statusText;
    }

    /**
     * Creates a new FetchError instance.
     * @param {number} status - The HTTP status code of the fetch error.
     * @param {string} statusText - The status text of the fetch error.
     */
    constructor(status, statusText) {
        super(`Fetch failed with status ${status} ${statusText}`);
        this.#status = status;
        this.#statusText = statusText;
    }
}