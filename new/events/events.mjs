/**
 * @import { EventTypes, EventListener, EventDetail, EventMap } from './events'
 */

/**
 * @template {EventMap} KVMap
 */
export default class GenericEvents {
    /**
     * @type {EventTarget}
     */
    #eventTarget

    constructor() {
        this.#eventTarget = new EventTarget()
    }

    /**
     * @returns {Pick<GenericEvents<KVMap>, 'addEventListener' | 'removeEventListener'>}
     */
    get genericEventsListener() {
        return this
    }

    /**
     * @template {EventTypes<KVMap>} T
     * @param {T} type
     * @param {EventListener<KVMap, T>} listener
     * 
     * @returns {() => void} Remove event listener function.
     */
    addEventListener(type, listener) {
        this.#eventTarget.addEventListener(type, listener)

        return () => this.removeEventListener(type, listener)
    }

    /**
     * @template {EventTypes<KVMap>} T
     * @param {T} type
     * @param {EventListener<KVMap, T>} listener
     */
    removeEventListener(type, listener) {
        this.#eventTarget.removeEventListener(type, listener)
    }
    
    /**
     * @template {EventTypes<KVMap>} T
     * @param {T} type
     * @param {EventDetail<KVMap, T>} detail
     */
    dispatchEvent(type, detail) {
        this.#eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
    }
}