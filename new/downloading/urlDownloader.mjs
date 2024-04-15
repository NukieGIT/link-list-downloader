import { retrieveFileNameFromUrl } from "../utils.mjs";
import { CountBlobFromResponseLengthProgress } from "./blobFromResponse.mjs";

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
     * @type {EventTarget}
     */
    #fetchFileSizeEvents
    /**
     * @type {EventTarget}
     */
    #downloadEvents

    static get UNKNOWN_FILE_SIZE() {
        return -1
    }

    /**
     * @returns {import('globalTypes.mjs').EventTargetWithoutDispatch}
     */
    get fetchFileSizeEvents() {
        return {
            addEventListener: this.#fetchFileSizeEvents.addEventListener.bind(this.#fetchFileSizeEvents),
            removeEventListener: this.#fetchFileSizeEvents.removeEventListener.bind(this.#fetchFileSizeEvents)
        }
    }

    /**
     * @returns {import('globalTypes.mjs').EventTargetWithoutDispatch}
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
        reader.progressEvents.addEventListener('progress', this.#onReaderProgress.bind(this))

        this.#fetchedFile = await reader.toBlob()

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

export class FetchError extends Error {
    /**
     * @type {number}
     */
    #status
    /**
     * @type {string}
     */
    #statusText

    /**
     * @param {number} status
     * @param {string} statusText
     */
    constructor(status, statusText) {
        super(`Fetch failed with status ${status} ${statusText}`);
        this.#status = status;
        this.#statusText = statusText;
    }
}