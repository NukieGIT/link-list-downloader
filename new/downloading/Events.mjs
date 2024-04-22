/**
 * @import { DownloadEventTypes, DownloadEventDetail, DownloadEventListener, FetchFileSizeEventTypes, FetchFileSizeEventDetail, FetchFileSizeEventListener } from './Events'
 */

export class DownloadEvents {
    /**
     * @type {EventTarget}
     */
    #eventTarget

    constructor() {
        this.#eventTarget = new EventTarget()
    }

    /**
     * @template {DownloadEventTypes} T
     * @param {T} type
     * @param {DownloadEventListener<T>} listener
     */
    addEventListener(type, listener) {
        this.#eventTarget.addEventListener(type, listener)
    }

    /**
     * @template {DownloadEventTypes} T
     * @param {T} type
     * @param {DownloadEventListener<T>} listener
     */
    removeEventListener(type, listener) {
        this.#eventTarget.removeEventListener(type, listener)
    }
    
    /**
     * @template {DownloadEventTypes} T
     * @param {T} type
     * @param {DownloadEventDetail<T>} detail
     */
    dispatchEvent(type, detail) {
        this.#eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
    }
}

export class fetchFileSizeEvents {
    /**
     * @type {EventTarget}
     */
    #eventTarget

    constructor() {
        this.#eventTarget = new EventTarget()
    }

    /**
     * @template {FetchFileSizeEventTypes} T
     * @param {T} type
     * @param {FetchFileSizeEventListener<T>} listener
     */
    addEventListener(type, listener) {
        this.#eventTarget.addEventListener(type, listener)
    }

    /**
     * @template {FetchFileSizeEventTypes} T
     * @param {T} type
     * @param {FetchFileSizeEventListener<T>} listener
     */
    removeEventListener(type, listener) {
        this.#eventTarget.removeEventListener(type, listener)
    }
    
    /**
     * @template {FetchFileSizeEventTypes} T
     * @param {T} type
     * @param {FetchFileSizeEventDetail<T>} detail
     */
    dispatchEvent(type, detail) {
        this.#eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
    }
}