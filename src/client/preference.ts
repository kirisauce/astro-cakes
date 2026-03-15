type StoredPreferenceOptionsBase<T> = {
  default: () => T;
  serialize: (value: T) => string;
  deserialize: (stored: string) => T | undefined;
};

export type StoredPreferenceOptions<T> = T extends string
  ? {
      [K in keyof StoredPreferenceOptionsBase<T>]?: StoredPreferenceOptionsBase<T>[K];
    }
  : StoredPreferenceOptionsBase<T>;

export class StoredPreference<T> implements EventTarget {
  #key: string;
  #currentValue: T;
  #serialize: (value: T) => string;
  #deserialize: (stored: string) => T | undefined;
  #ev: EventTarget;

  constructor(key: string, options: StoredPreferenceOptions<T>) {
    const {
      default: defaultValue = () => '' as T,
      serialize = (value: T) => value as string,
      deserialize = (stored: string) => stored as T | undefined,
    } = options ?? {};
    this.#key = key;

    const got = localStorage.getItem(key);
    if (got) {
      const tmp = deserialize(got);
      this.#currentValue = tmp === undefined ? defaultValue() : tmp;
    } else {
      this.#currentValue = defaultValue();
    }

    localStorage.setItem(key, serialize(this.#currentValue));

    this.#serialize = serialize;
    this.#deserialize = deserialize;
    this.#ev = new EventTarget();
  }

  get value() {
    return this.#currentValue;
  }

  set value(newValue: T) {
    if (this.#currentValue !== newValue) {
      this.#currentValue = newValue;
      localStorage.setItem(this.#key, this.#serialize(newValue));
      this.dispatchEvent(new Event('change'));
    }
  }

  addEventListener(
    type: 'change',
    cb: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) {
    return this.#ev.addEventListener(type, cb, options);
  }

  removeEventListener(
    type: 'change',
    cb: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) {
    return this.#ev.removeEventListener(type, cb, options);
  }

  dispatchEvent(event: Event) {
    return this.#ev.dispatchEvent(event);
  }
}