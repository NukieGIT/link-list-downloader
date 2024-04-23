import type GenericEvents from "./events.mjs";

export type EventMap = Record<string, any>;

export type EventTypes<T extends EventMap> = Extract<keyof T, string>;

export type EventDetail<T extends EventMap, K extends EventTypes<T>> = T[K];

export type EventListener<T extends EventMap, K extends EventTypes<T>> = (ev: CustomEvent<EventDetail<T, K>>) => void;

export type GenericEventListener<KVMap extends EventMap> = Pick<GenericEvents<KVMap>, 'addEventListener' | 'removeEventListener'>