export type EventMap = Record<string, any>;

export type EventListenerHandler<T> = (evt: CustomEvent<T>) => void;

export interface IEventListenerHandler<T> {
    handleEvent(object: CustomEvent<T>): void;
}

export type EventListenerOrEventListenerHandler<T> = EventListenerHandler<T> | IEventListenerHandler<T>;

export interface IEventListener<T extends EventMap> {
    addEventListener<K extends keyof T>(type: K, listener: EventListenerOrEventListenerHandler<T[K]>): () => void;
    removeEventListener<K extends keyof T>(type: K, listener: EventListenerOrEventListenerHandler<T[K]>): void;
}

/**
 * A typed event target.
 * 
 * @template T - The event map.
 */
export class TypedEventTarget<T extends EventMap> implements IEventListener<T> {
    #_eventTarget = new EventTarget();

    public get eventListener() {
        return this as IEventListener<T>;
    }

    /**
     * Adds an event listener of the specified type.
     * Returns a function that can be called to remove the event listener.
     *
     * @param type - The type of the event.
     * @param listener - The event listener.
     * @returns A function that removes the event listener when called.
     */
    public addEventListener<K extends keyof T>(
        type: K,
        listener: EventListenerOrEventListenerHandler<T[K]>
    ): () => void {
        this.#_eventTarget.addEventListener(type as string, listener as EventListenerOrEventListenerObject);

        return () => this.removeEventListener(type, listener);
    }

    /**
     * Removes an event listener.
     * 
     * @param type - The type of the event.
     * @param listener - The event listener.
     */
    public removeEventListener<K extends keyof T>(
        type: K,
        listener: EventListenerOrEventListenerHandler<T[K]>
    ) {
        this.#_eventTarget.removeEventListener(type as string, listener as EventListenerOrEventListenerObject);
    }

    /**
     * Dispatches an event.
     * 
     * @param type - The type of the event.
     * @param detail - The detail object.
     */
    public dispatchEvent<K extends keyof T>(
        type: K,
        detail: T[K]
    ) {
        this.#_eventTarget.dispatchEvent(new CustomEvent(type as string, { detail }));
    }
}