import { DoublyLinkedList } from '/new/dataStructures/doublyLinkedList.mjs'

export default class IdGenerator {
    /**
     * @type {number}
     */
    #maxId
    /**
     * @type {DoublyLinkedList<number>}
     */
    #availableIds

    constructor() {
        this.#maxId = 1;
        this.#availableIds = new DoublyLinkedList();
    }

    /**
     * @returns {number}
     */
    generateId() {
        if (this.#availableIds.length === 0) {
            return this.#maxId++;
        } else {
            return this.#availableIds.removeFirst().value;
        }
    }

    /**
     * @param {number} id
     */
    releaseId(id) {
        if (id === this.#maxId) {
            this.#maxId--;
            while (this.#availableIds.removeValue(this.#maxId)) {
                this.#maxId--;
            }
        } else {
            this.#availableIds.insertLast(id);
        }
    }
}

export const GlobalIdGeneratorInstance = new IdGenerator();