import UrlDownloader from "/new/downloading/urlDownloader.mjs"
import { ProgressBarComponent } from "/new/components/progressBarComponent.mjs"
import { convertDataUnit, getDataUnit } from "/new/utils.mjs"
import IdGenerator from "/new/generation/idGenerator.mjs"
import { DoublyLinkedList } from "/new/dataStructures/doublyLinkedList.mjs";


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

