import UrlDownloader from "/new/downloading/urlDownloader.mjs"
import { ProgressBarComponent } from "/new/components/progressBarComponent.mjs"
import { convertDataUnit, getDataUnit } from "/new/utils.mjs"

// progressBar.unitConverter = (/** @type {number} */ value, /** @type {number} */ max) => {
//     const maxDataUnit = getDataUnit(max)
//     const convertedMax = convertDataUnit(max, "Bytes", maxDataUnit)
//     const convertedValue = convertDataUnit(value, "Bytes", maxDataUnit)

//     return {
//         value: parseFloat(convertedValue.toFixed(2)),
//         max: parseFloat(convertedMax.toFixed(2)),
//         unit: maxDataUnit
//     }
// }

