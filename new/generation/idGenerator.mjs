import { DoublyLinkedList, Node } from '/new/dataStructures/doublyLinkedList.mjs'

export default class IdGenerator {
    /**
     * @type {number}
     */
    #currentId
    /**
     * @type {DoublyLinkedList<number>}
     */
    #availableIds

    constructor() {
        this.#currentId = 1;
        this.#availableIds = new DoublyLinkedList();
    }

    /**
     * @returns {number}
     */
    generateId() {
        if (this.#availableIds.length === 0) {
            return this.#currentId++;
        } else {
            return this.#availableIds.removeFirst().value;
        }
    }

    /**
     * @param {number} id
     */
    releaseId(id) {
        this.#availableIds.insertLast(id);
    }
}