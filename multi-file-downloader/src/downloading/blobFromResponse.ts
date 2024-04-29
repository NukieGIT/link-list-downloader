import { IEventListener, TypedEventTarget } from "@/events/events";
import { CountBlobFromResponseLengthProgressEventMap } from "./types/downloadTypes";

/**
 * Represents a class that converts a response into a Blob.
 */
export class BlobFromResponse {

    protected _response: Response

    /**
     * Gets the response object.
     */
    get response() {
        return this._response;
    }

    /**
     * Creates an instance of BlobFromResponse.
     * @param response - The response object.
     */
    constructor(response: Response) {
        this._response = response;
    }

    /**
     * Converts the response into a Blob.
     * @returns A promise that resolves to a Blob.
     */
    async toBlob(): Promise<Blob> {
        if (!this.response.body) {
            return new Blob();
        }

        const reader = this.response.body.getReader();

        const chunks: Uint8Array[] = [];
        let result;

        while (!(result = await reader.read()).done) {
            chunks.push(result.value);
            this.processChunk(result.value);
        }

        return new Blob(chunks);
    }

    /**
     * Processes a chunk of data.
     * This is a default implementation that does not need processing.
     * @param _chunk - The chunk of data to be processed.
     */
    protected processChunk(_chunk: Uint8Array) {  }
}

/**
 * Represents a class that counts the length of a blob from a response with progress events.
 */
export class BlobFromResponseTracked extends BlobFromResponse {

    #_progressEvents: TypedEventTarget<CountBlobFromResponseLengthProgressEventMap>

    #_length = 0

    /**
     * Gets the length of the blob.
     */
    get length() {
        return this.#_length;
    }

    /**
     * Gets the progress events.
     */
    get progressEvents(): IEventListener<CountBlobFromResponseLengthProgressEventMap> {
        return this.#_progressEvents.eventListener;
    }

    constructor(response: Response) {
        super(response);
        this.#_progressEvents = new TypedEventTarget();
    }

    protected processChunk(chunk: Uint8Array) {
        this.#_length += chunk.length;
        this.#_progressEvents.dispatchEvent("progress", { progress: chunk.length, totalProgress: this.#_length });
    }
}