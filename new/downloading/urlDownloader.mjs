import { retrieveFileNameFromUrl } from "../utils.mjs";
import { CountBlobFromResponseLengthProgress } from "./blobFromResponse.mjs";

/**
 * @import { EventTargetWithoutDispatch, FetchFileSizeEventTarget } from '/new/globalTypes'
 */

export default class UrlDownloader {

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
     * @type {FetchFileSizeEventTarget}
     */
    #fetchFileSizeEvents
    /**
     * @type {FetchFileSizeEventTarget}
     */
    #downloadEvents

    static get UNKNOWN_FILE_SIZE() {
        return -1
    }

    /**
     * @returns {EventTargetWithoutDispatch}
     */
    get fetchFileSizeEvents() {
        return {
            addEventListener: this.#fetchFileSizeEvents.addEventListener.bind(this.#fetchFileSizeEvents),
            removeEventListener: this.#fetchFileSizeEvents.removeEventListener.bind(this.#fetchFileSizeEvents)
        }
    }

    /**
     * @returns {EventTargetWithoutDispatch}
     */
    get downloadEvents() {
        return {
            addEventListener: this.#downloadEvents.addEventListener.bind(this.#downloadEvents),
            removeEventListener: this.#downloadEvents.removeEventListener.bind(this.#downloadEvents)
        }
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
        this.#url = url;
        this.#fileName = retrieveFileNameFromUrl(url);

        this.#fileSize = UrlDownloader.UNKNOWN_FILE_SIZE;

        this.#fetchFileSizeEvents = new EventTarget();
        this.#downloadEvents = new EventTarget();
    }

    /**
     * Fetches the file size from the URL and returns it.
     * 
     * @returns {Promise<number>}
     */
    async fetchFileSize() {
        this.#fetchFileSizeEvents.dispatchEvent(new CustomEvent('fetchfilesizestart', { detail: { fileName: this.#fileName } }));

        const response = await fetch(this.#url, { method: 'HEAD' });
        this.#fileSize = parseInt(response.headers.get('Content-Length')) ?? UrlDownloader.UNKNOWN_FILE_SIZE;

        this.#fetchFileSizeEvents.dispatchEvent(new CustomEvent('fetchfilesizefinished', { detail: { fileName: this.#fileName, fileSize: this.#fileSize } }));

        return this.fileSize;
    }
    
    /**
     * Downloads the file from the URL and returns a Blob.
     * 
     * @returns {Promise<Blob>}
     */
    async download() {
        this.#downloadEvents.dispatchEvent(new CustomEvent('downloadstart', { detail: { fileName: this.#fileName } }));
        
        const response = await fetch(this.#url)

        if (!response.ok) {
            this.#downloadEvents.dispatchEvent(new CustomEvent('downloaderror', { detail: { fileName: this.#fileName, status: response.status, statusText: response.statusText } }));
            throw new FetchError(response.status, response.statusText);
        }
        
        const reader = new CountBlobFromResponseLengthProgress(response)
        const onReaderProgress = this.#onReaderProgress.bind(this);
        reader.progressEvents.addEventListener('progress', onReaderProgress)

        this.#fetchedFile = await reader.toBlob()

        reader.progressEvents.removeEventListener('progress', onReaderProgress)

        this.#downloadEvents.dispatchEvent(new CustomEvent('downloadfinished', { detail: { fileName: this.#fileName, blob: this.fetchedFile } }));

        return this.fetchedFile;
    }

    /**
     * @param {CustomEvent} event
     */
    #onReaderProgress(event) {
        this.#downloadEvents.dispatchEvent(new CustomEvent('downloadprogress', { detail: { fileName: this.#fileName, length: event.detail.length } }));
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