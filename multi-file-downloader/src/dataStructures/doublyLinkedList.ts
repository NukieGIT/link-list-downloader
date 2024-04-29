/**
 * Node class for the doubly-linked list.
 * @template T - The type of the value of the node.
 */
export class Node<T> {

    #_value: T
    #_prev: Node<T> | null = null
    #_next: Node<T> | null = null

    get value() {
        return this.#_value;
    }

    set value(value) {
        this.#_value = value;
    }

    get prev() {
        return this.#_prev;
    }

    set prev(prev) {
        this.#_prev = prev;
    }

    get next() {
        return this.#_next;
    }

    set next(next) {
        this.#_next = next;
    }

    /**
     * @param value - The value of the node.
     */
    constructor(value: T) {
        this.#_value = value;
    }
}

/**
 * Doubly-linked list data structure class.
 * @template T - The type of the value of the nodes.
 */
export class DoublyLinkedList<T> {
    #_head: Node<T> | null = null
    #_tail: Node<T> | null = null
    #_length: number = 0
    
    /**
     * Check if the list is empty.
     * @returns True if the list is empty, false otherwise.
     */
    get isEmpty(): boolean {
        return this.#_length === 0;
    }

    /**
     * Get the length of the list.
     * @returns The length of the list.
     */
    get length(): number {
        return this.#_length;
    }

    /**
     * Insert a new node at the head of the list.
     * @param value - The value of the node.
     * @returns The newly inserted node.
     */
    insertFirst(value: T): Node<T> {
        const newNode = new Node(value);

        if (!this.#_head) {
            this.#_head = newNode;
            this.#_tail = newNode;
        } else {
            newNode.next = this.#_head;
            this.#_head.prev = newNode;
            this.#_head = newNode;
        }

        this.#_length++;
        return newNode;
    }

    /**
     * Insert a new node at the tail of the list.
     * @param value - The value of the node.
     * @returns The newly inserted node.
     */
    insertLast(value: T): Node<T> {
        const newNode = new Node(value);

        if (!this.#_tail) {
            this.#_head = newNode;
            this.#_tail = newNode;
        } else {
            newNode.prev = this.#_tail;
            this.#_tail.next = newNode;
            this.#_tail = newNode;
        }

        this.#_length++;
        return newNode;
    }

    /**
     * Insert a new node before the specified node.
     * @param node - The node to insert before.
     * @param value - The value of the node.
     * @returns The newly inserted node.
     */
    insertBefore(node: Node<T>, value: T): Node<T> {
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
            this.#_head = newNode;
        }

        this.#_length++;
        return newNode;
    }

    /**
     * Insert a new node after the specified node.
     * @param node - The node to insert after.
     * @param value - The value of the node.
     * @returns The newly inserted node.
     */
    insertAfter(node: Node<T>, value: T): Node<T> {
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
            this.#_tail = newNode;
        }

        this.#_length++;
        return newNode;
    }

    /**
     * Removes the first occurence of the value from the list.
     * @param value - The value of the node to remove.
     * @return True if the node was removed, false otherwise.
     */
    removeValue(value: T): boolean {
        if (this.isEmpty) {
            return false;
        }

        let currentNode = this.#_head;

        while (currentNode) {
            if (currentNode.value === value) {
                if (currentNode === this.#_head) {
                    this.removeFirst();
                } else if (currentNode === this.#_tail) {
                    this.removeLast();
                } else {
                    currentNode.prev!.next = currentNode.next;
                    currentNode.next!.prev = currentNode.prev;
                    this.#_length--;
                }

                return true;
            }
            currentNode = currentNode.next;
        }

        return false;
    }

    /**
     * Remove a node from the list.
     * @param node - The node to remove.
     * @returns True if the node was removed, false otherwise.
     */
    removeNode(node: Node<T>): boolean {
        if (this.isEmpty) {
            return false;
        }

        if (node === this.#_head) {
            this.removeFirst();
        } else if (node === this.#_tail) {
            this.removeLast();
        } else {
            node.prev!.next = node.next;
            node.next!.prev = node.prev;
            this.#_length--;
        }

        return true;
    }

    /**
     * Remove the first node from the list.
     * @returns The removed node, or null if the list is empty.
     */
    removeFirst(): Node<T> | null {
        if (this.isEmpty) {
            return null;
        }

        const removedNode = this.#_head;

        if (this.#_length === 1) {
            this.#_head = null;
            this.#_tail = null;
        } else {
            this.#_head = this.#_head!.next;
            this.#_head!.prev = null;
        }

        this.#_length--;
        return removedNode;
    }

    /**
     * Remove the last node from the list.
     * @returns The removed node, or null if the list is empty.
     */
    removeLast(): Node<T> | null {
        if (this.isEmpty) {
            return null;
        }

        const removedNode = this.#_tail;

        if (this.#_length === 1) {
            this.#_head = null;
            this.#_tail = null;
        } else {
            this.#_tail = this.#_tail!.prev;
            this.#_tail!.next = null;
        }

        this.#_length--;
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

        let currentNode = this.#_head

        do {
            console.log(currentNode!.value);
        } while (currentNode = currentNode!.next);
    }
}