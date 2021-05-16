interface LinkedListNode<T> {
  value: T;
  next: LinkedListNode<T> | null;
  prev: LinkedListNode<T> | null;
}

function linkedListNode<T>(
  value: T,
  prev: LinkedListNode<T> | null = null,
  next: LinkedListNode<T> | null = null
): LinkedListNode<T> {
  return {
    value,
    next,
    prev,
  };
}

export class StateHistory<T> {
  public static of<T>(value: T, maxLength = 100) {
    return new StateHistory(value, maxLength);
  }

  #maxLength: number;

  #size = 1;

  #head: LinkedListNode<T>;

  #curNode: LinkedListNode<T>;

  private constructor(value: T, maxLength: number) {
    this.#head = this.#curNode = linkedListNode(value);
    this.#maxLength = maxLength;
  }

  public get(): T {
    return this.#curNode.value;
  }

  public push(value: T) {
    const newNode = linkedListNode(value, this.#curNode);
    this.#curNode.next = newNode;
    this.#curNode = newNode;
    this.#size++;

    while (this.#size > this.#maxLength && this.#head.next) {
      this.#head = this.#head.next;
      this.#size--;
    }
    return this;
  }

  public goBack() {
    if (this.#curNode.prev != null) {
      this.#curNode = this.#curNode.prev;
      this.#size--;
    }
    return this;
  }

  public goForward() {
    if (this.#curNode.next != null) {
      this.#curNode = this.#curNode.next;
      this.#size++;
    }
    return this;
  }

  public hasPrev() {
    return this.#curNode.prev != null;
  }

  public hasNext() {
    return this.#curNode.next != null;
  }
}
