export type EventMap = Record<string, any>;

export type EventTypes<T extends EventMap> = Extract<keyof T, string>;

export type EventDetail<T extends EventMap, K extends EventTypes<T>> = T[K];

export type EventListener<T extends EventMap, K extends EventTypes<T>> = (ev: CustomEvent<EventDetail<T, K>>) => void;
    "downloaderror": { id: number, status: string, statusText: string }
    "downloadprogress": { id: number, loaded: number }
    "downloadfinished": { id: number }
}

export type DownloadEventTypes = keyof DownloadEventTypesMap;

export type DownloadEventDetail<K extends DownloadEventTypes> = DownloadEventTypesMap[K];

export type DownloadEventListener<K extends DownloadEventTypes> = (ev: CustomEvent<DownloadEventDetail<K>>) => void;


type FetchFileSizeEventMap = {
    "fetchfilesizestarted": CustomEvent<{ id: number }>
    "fetchfilesizefinished": CustomEvent<{ id: number }>
}

export type FetchFileSizeEventTypes = keyof FetchFileSizeEventMap;

export type FetchFileSizeEventDetail<K extends FetchFileSizeEventTypes> = FetchFileSizeEventMap[K];

export type FetchFileSizeEventListener<K extends FetchFileSizeEventTypes> = (ev: CustomEvent<FetchFileSizeEventDetail<K>>) => void;