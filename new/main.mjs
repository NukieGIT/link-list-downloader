import DownloadManager from "./downloading/downloadManager.mjs";
import DownloadVisualizer from "./downloading/downloadVisualizer.mjs";

const totalProgressContainer = /** @type {HTMLElement} */ (document.querySelector("#total-progress-container"))
const downloadsProgressContainer = /** @type {HTMLElement} */ (document.querySelector("#downloads-progress-container"))

const urls = [
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    "https://link.testfile.org/500MB",
    // "https://link.testfile.org/500MB",
    // "https://link.testfile.org/500MB",
    // "https://link.testfile.org/500MB",
    // "https://link.testfile.org/500MB",
    // "https://link.testfile.org/500MB",
    // "https://link.testfile.org/500MB",
]

const downloadManager = new DownloadManager(urls)
const downloadVisualizer = new DownloadVisualizer(downloadManager, totalProgressContainer, downloadsProgressContainer)

await downloadManager.fetchTotalFileSize()
// await downloadManager.downloadAll()

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

// const gen = new IdGeneratorNaive()

// for (let i = 0; i < 20; i++) {
//     console.log(gen.generateId());
// }

// gen.releaseId(4)
// gen.releaseId(17)

// console.log("After releasing 4 and 17");

// for (let i = 0; i < 20; i++) {
//     console.log(gen.generateId());
// }

// /** @type {DoublyLinkedList<number>} */
// const dll = new DoublyLinkedList()
// dll.insertFirst(1)
// dll.insertFirst(2)
// dll.insertLast(4)
// dll.insertLast(5)

// dll.log()

