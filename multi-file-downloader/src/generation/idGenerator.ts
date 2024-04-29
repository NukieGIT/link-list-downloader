import { DoublyLinkedList } from '@/dataStructures/doublyLinkedList'

export default class IdGenerator {
    #_maxId: number
    #_availableIds: DoublyLinkedList<number>

    constructor() {
        this.#_maxId = 1;
        this.#_availableIds = new DoublyLinkedList();
    }

    generateId(): number {
        if (this.#_availableIds.length === 0) {
            return this.#_maxId++;
        } else {
            return this.#_availableIds.removeFirst()!.value;
        }
    }

    releaseId(id: number) {
        if (id === this.#_maxId) {
            this.#_maxId--;
            while (this.#_availableIds.removeValue(this.#_maxId)) {
                this.#_maxId--;
            }
        } else {
            this.#_availableIds.insertLast(id);
        }
    }
}

export const GlobalIdGeneratorInstance = new IdGenerator();