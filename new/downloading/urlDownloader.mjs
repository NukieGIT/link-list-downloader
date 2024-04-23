import GenericEvents from "../events/events.mjs";
import { GlobalIdGeneratorInstance } from "../generation/idGenerator.mjs";
import { retrieveFileNameFromUrl } from "../utils.mjs";
import { CountBlobFromResponseLengthProgress } from "./blobFromResponse.mjs";

/**
 * @import { FetchFileSizeEventMap, DownloadEventTypesMap } from '/new/events/downloadingEvents'
 * @import { GenericEventListener } from '/new/events/events'
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
     * @returns {Omit<UrlDownloader, 'fetchFileSize' | 'download' | 'close'>}
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

    /**
     * @param {string} url
     */
    constructor(url) {
        this.#id = GlobalIdGeneratorInstance.generateId();
        
        this.#url = url;
        this.#fileName = retrieveFileNameFromUrl(url);

        this.#fileSize = UrlDownloader.UNKNOWN_FILE_SIZE;

        this.#fetchFileSizeEvents = new GenericEvents();
        this.#downloadEvents = new GenericEvents();
    }

    /**
     * Fetches the file size from the URL and returns it.
     * 
     * @returns {Promise<number>}
     */
    async fetchFileSize() {
        this.#fetchFileSizeEvents.dispatchEvent("fetchfilesizestarted", { id: this.#id });

        const response = await fetch(this.#url, { method: 'HEAD' });
        this.#fileSize = parseInt(response.headers.get('Content-Length')) ?? UrlDownloader.UNKNOWN_FILE_SIZE;

        this.#fetchFileSizeEvents.dispatchEvent("fetchfilesizefinished", { id: this.#id });

        return this.fileSize;
    }
    
    /**
     * Downloads the file from the URL and returns a Blob.
     * 
     * @returns {Promise<Blob>}
     */
    async download() {
        this.#downloadEvents.dispatchEvent("downloadstarted", { id: this.#id });
        
        const response = await fetch(this.#url)

        if (!response.ok) {
            this.#downloadEvents.dispatchEvent("downloaderror", { id: this.#id, status: response.status, statusText: response.statusText});
            throw new FetchError(response.status, response.statusText);
        }
        
        const reader = new CountBlobFromResponseLengthProgress(response)
        const onReaderProgress = this.#onReaderProgress.bind(this);
        reader.progressEvents.addEventListener('progress', onReaderProgress)

        this.#fetchedFile = await reader.toBlob()

        reader.progressEvents.removeEventListener('progress', onReaderProgress)

        this.#downloadEvents.dispatchEvent("downloadfinished", { id: this.#id });

        return this.fetchedFile;
    }

    /**
     * Closes the downloader and releases the ID.
     */
    close() {
        GlobalIdGeneratorInstance.releaseId(this.#id);
    }

    /**
     * @param {CustomEvent} event
     */
    #onReaderProgress(event) {
        this.#downloadEvents.dispatchEvent("downloadprogress", { id: this.#id, loadedBytes: event.detail.progress });
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