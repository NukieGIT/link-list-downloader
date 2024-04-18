// not yet warfgsawsRFG

export declare type EventTargetWithoutDispatch = Omit<FetchFileSizeEventTarget, 'dispatchEvent'>;


type FetchFileSizeEventMap = {
    "fetchfilesizestart": CustomEvent<{ fileName: string }>
    "fetchfilesizefinished": CustomEvent<{ fileName: string, fileSize: number }>
}


interface FetchFileSizeEventTarget extends EventTarget {
    addEventListener<K extends keyof FetchFileSizeEventMap>(
        type: K,
        listener: (ev: FetchFileSizeEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener<K extends keyof FetchFileSizeEventMap>(
        type: K,
        listener: (ev: FetchFileSizeEventMap[K]) => void,
        options?: boolean | EventListenerOptions
    ): void;
}