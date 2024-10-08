import GenericEvents from "../events/events.mjs";

/**
 * @import { CountBlobFromResponseLengthProgressEventMap } from '/new/events/downloadingEvents'
 * @import { GenericEventListener } from '/new/events/events'
 */

/**
 * Represents a class that converts a response into a Blob.
 */
export class BlobFromResponse {

    /**
     * @protected
     */
    _response

    /**
     * Gets the response object.
     * @returns {Response} The response object.
     */
    get response() {
        return this._response;
    }

    /**
     * Creates an instance of BlobFromResponse.
     * @param {Response} response - The response object.
     */
    constructor(response) {
        this._response = response;
    }

    /**
     * Converts the response into a Blob.
     * @returns {Promise<Blob>} A promise that resolves to a Blob.
     */
    async toBlob() {
        const reader = this.response.body.getReader();

        /**
         * @type {Uint8Array[]}
         */
        const chunks = [];
        let result;

        while (!(result = await reader.read()).done) {
            chunks.push(result.value);
            this._processChunk(result.value);
        }

        return new Blob(chunks);
    }

    /**
     * Processes a chunk of data.
     * This is a default implementation that does not need processing.
     * @param {Uint8Array} chunk - The chunk of data to be processed.
     * 
     * @protected
     */
    _processChunk(chunk) {  }
}

/**
 * Represents a class that counts the length of a blob from a response.
 * @extends BlobFromResponse
 */
export class CountBlobFromResponseLength extends BlobFromResponse {

    /**
     * @protected
     */
    _length

    /**
     * Gets the length of the blob.
     * @returns {number} The length of the blob.
     */
    get length() {
        return this._length;
    }

    /**
     * Creates a new instance of CountBlobFromResponseLength.
     * @param {Response} response - The response object.
     */
    constructor(response) {
        super(response);
        this._length = 0;
    }

    /**
     * Processes a chunk of data and updates the length.
     * @param {Uint8Array} chunk - The chunk of data to process.
     * 
     * @protected
     */
    _processChunk(chunk) {
        this._length += chunk.length;
    }
}

/**
 * Represents a class that counts the length of a blob from a response with progress events.
 * @extends CountBlobFromResponseLength
 * 
 */
export class CountBlobFromResponseLengthProgress extends CountBlobFromResponseLength {

    /**
     * @type {GenericEvents<CountBlobFromResponseLengthProgressEventMap>}
     */
    #progressEvents

    /**
     * Gets the progress events.
     * @returns {GenericEventListener<CountBlobFromResponseLengthProgressEventMap>}
     */
    get progressEvents() {
        return this.#progressEvents.genericEventsListener;
    }

    /**
     * Creates an instance of CountBlobFromResponseLengthProgress.
     * @param {Response} response - The response object.
     */
    constructor(response) {
        super(response);
        this.#progressEvents = new GenericEvents();
    }

    /**
     * Processes a chunk of data.
     * @param {Uint8Array} chunk - The chunk of data to process.
     * 
     * @protected
     */
    _processChunk(chunk) {
        super._processChunk(chunk);
        this.#progressEvents.dispatchEvent("progress", { progress: chunk.length, totalProgress: this._length });
    }
}