export class ReactiveEventTarget<E extends string> implements EventTarget {
  ev = new EventTarget();

  addEventListener(
    type: E,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    return this.ev.addEventListener(type, callback, options);
  }

  removeEventListener(
    type: E,
    callback: EventListenerOrEventListenerObject | null,
    options?: AddEventListenerOptions | boolean,
  ): void {
    return this.ev.removeEventListener(type, callback, options);
  }

  dispatchEvent(event: Event): boolean {
    return this.ev.dispatchEvent(event);
  }
}

export class Ref<T> extends ReactiveEventTarget<'change'> {
  #value: T;

  constructor(value: T) {
    super();
    this.#value = value;
  }

  get value(): T {
    return this.#value;
  }

  set value(newValue: T) {
    if (this.#value === newValue) return;
    this.#value = newValue;
    this.dispatchEvent(new Event('change'));
  }
}

export const ref = <T>(value: T) => new Ref(value);

export interface ComputedOptions<T> {
  /**
   * Whether to compute the value lazily.
   * If true, the computed value will not be computed until it is accessed.
   *
   * @default true
   */
  lazy?: boolean;

  /**
   * Subscribes to other values.
   * This computed value recomputes when any of the subscribed values emits a 'change' event.
   */
  subscribes?: EventTarget[];
}

export class Computed<T> extends ReactiveEventTarget<'change'> {
  #computeFn: () => T;
  #storedValue: T;
  #oldValue: T;
  #isRecomputing = false;
  #firstRun = true;

  constructor(computeFn: () => T, options: ComputedOptions<T> = {}) {
    super();

    const { lazy = true, subscribes = [] } = options;

    this.#computeFn = computeFn;
    this.#storedValue = undefined as T;
    this.#oldValue = undefined as T;
    this.#firstRun = lazy;

    if (!lazy) {
      this.recompute();
    }

    subscribes.forEach((sub) => {
      sub.addEventListener('change', () => this.recompute());
    });
  }

  recompute() {
    const newValue = this.#computeFn();
    if (this.#storedValue !== newValue) {
      this.#oldValue = this.#storedValue;
      this.#storedValue = newValue;

      this.#isRecomputing = true;
      this.dispatchEvent(new Event('change'));
      this.#isRecomputing = false;
      this.#oldValue = undefined as T;
    }
  }

  get value() {
    if (this.#firstRun) {
      this.#storedValue = this.#computeFn();
      this.#firstRun = false;
    }
    return this.#storedValue;
  }

  get oldValue() {
    if (!this.#isRecomputing) {
      throw new Error('oldValue is only available during recomputation');
    }
    return this.#oldValue;
  }
}

export const computed = <T>(computeFn: () => T, options?: ComputedOptions<T>) =>
  new Computed(computeFn, options);
