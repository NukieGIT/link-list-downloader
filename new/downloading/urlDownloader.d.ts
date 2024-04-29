import type UrlDownloader from "./urlDownloader.mjs"

export type LimitedUrlDownloader = Omit<UrlDownloader, 'fetchFileSize' | 'download' | 'close'>