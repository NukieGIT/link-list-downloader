/**
 * Node class for the doubly-linked list.
 * @template T
 */
export class Node {

    /**
     * @type {T}
     */
    #value
    /**
     * @type {Node<T> | null}
     */
    #prev
    /**
     * @type {Node<T> | null}
     */
    #next

    get value() {
        return this.#value;
    }

    set value(value) {
        this.#value = value;
    }

    get prev() {
        return this.#prev;
    }

    set prev(prev) {
        this.#prev = prev;
    }

    get next() {
        return this.#next;
    }

    set next(next) {
        this.#next = next;
    }

    /**
     * @param {T} value - The value of the node.
     */
    constructor(value) {
        this.#value = value;
        this.#prev = null;
        this.#next = null;
    }
}

/**
 * Doubly-linked list data structure class.
 * @template T
 */
export class DoublyLinkedList {
    /**
     * @type {Node<T> | null}
     */
    #head

    /**
     * @type {Node<T> | null}
     */
    #tail

    /**
     * @type {number}
     */
    #length
    
    constructor() {
        this.#head = null;
        this.#tail = null;
        this.#length = 0;
    }

    /**
     * Check if the list is empty.
     * @returns {boolean} True if the list is empty, false otherwise.
     */
    get isEmpty() {
        return this.#length === 0;
    }

    /**
     * Get the length of the list.
     * @returns {number} The length of the list.
     */
    get length() {
        return this.#length;
    }

    /**
     * Insert a new node at the head of the list.
     * @param {T} value - The value of the node.
     * @returns {Node<T>} The newly inserted node.
     */
    insertFirst(value) {
        const newNode = new Node(value);

        if (!this.#head) {
            this.#head = newNode;
            this.#tail = newNode;
        } else {
            newNode.next = this.#head;
            this.#head.prev = newNode;
            this.#head = newNode;
        }

        this.#length++;
        return newNode;
    }

    /**
     * Insert a new node at the tail of the list.
     * @param {T} value - The value of the node.
     * @returns {Node<T>} The newly inserted node.
     */
    insertLast(value) {
        const newNode = new Node(value);

        if (!this.#tail) {
            this.#head = newNode;
            this.#tail = newNode;
        } else {
            newNode.prev = this.#tail;
            this.#tail.next = newNode;
            this.#tail = newNode;
        }

        this.#length++;
        return newNode;
    }

    /**
     * Insert a new node before the specified node.
     * @param {Node<T>} node - The node to insert before.
     * @param {T} value - The value of the node.
     * @returns {Node<T>} The newly inserted node.
     */
    insertBefore(node, value) {
        if (this.isEmpty) {
            return this.insertFirst(value);
        }

        const newNode = new Node(value);

        newNode.prev = node.prev;
        newNode.next = node;
        node.prev = newNode;

        if (newNode.prev) {
            newNode.prev.next = newNode;
        } else {
            this.#head = newNode;
        }

        this.#length++;
        return newNode;
    }

    /**
     * Insert a new node after the specified node.
     * @param {Node<T>} node - The node to insert after.
     * @param {T} value - The value of the node.
     * @returns {Node<T>} The newly inserted node.
     */
    insertAfter(node, value) {
        if (this.isEmpty) {
            return this.insertFirst(value);
        }

        const newNode = new Node(value);

        newNode.prev = node;
        newNode.next = node.next;
        node.next = newNode;

        if (newNode.next) {
            newNode.next.prev = newNode;
        } else {
            this.#tail = newNode;
        }

        this.#length++;
        return newNode;
    }

    /**
     * Removes the first occurence of the value from the list.
     * @param {T} value - The value of the node to remove.
     * @return {boolean} True if the node was removed, false otherwise.
     */
    removeValue(value) {
        if (this.isEmpty) {
            return false;
        }

        let currentNode = this.#head;

        while (currentNode) {
            if (currentNode.value === value) {
                if (currentNode === this.#head) {
                    this.removeFirst();
                } else if (currentNode === this.#tail) {
                    this.removeLast();
                } else {
                    currentNode.prev.next = currentNode.next;
                    currentNode.next.prev = currentNode.prev;
                    this.#length--;
                }

                return true;
            }
            currentNode = currentNode.next;
        }

        return false;
    }

    /**
     * Remove a node from the list.
     * @param {Node<T>} node - The node to remove.
     * @returns {boolean} True if the node was removed, false otherwise.
     */
    removeNode(node) {
        if (this.isEmpty) {
            return false;
        }

        if (node === this.#head) {
            this.removeFirst();
        } else if (node === this.#tail) {
            this.removeLast();
        } else {
            node.prev.next = node.next;
            node.next.prev = node.prev;
            this.#length--;
        }

        return true;
    }

    /**
     * Remove the first node from the list.
     * @returns {Node<T> | null} The removed node, or null if the list is empty.
     */
    removeFirst() {
        if (this.isEmpty) {
            return null;
        }

        const removedNode = this.#head;

        if (this.#length === 1) {
            this.#head = null;
            this.#tail = null;
        } else {
            this.#head = this.#head.next;
            this.#head.prev = null;
        }

        this.#length--;
        return removedNode;
    }

    /**
     * Remove the last node from the list.
     * @returns {Node<T> | null} The removed node, or null if the list is empty.
     */
    removeLast() {
        if (this.isEmpty) {
            return null;
        }

        const removedNode = this.#tail;

        if (this.#length === 1) {
            this.#head = null;
            this.#tail = null;
        } else {
            this.#tail = this.#tail.prev;
            this.#tail.next = null;
        }

        this.#length--;
        return removedNode;
    }

    /**
     * Log the values of the list to the console.
     */
    log() {
        if (this.isEmpty) {
            console.log("The list is empty.");
            return;
        }

        let currentNode = this.#head

        do {
            console.log(currentNode.value);
        } while (currentNode = currentNode.next);
    }
}