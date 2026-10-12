// PDF.js 5 follows the newest evergreen-browser baseline. Keep the renderer
// working on otherwise capable iPhones whose WebKit update trails that baseline.
// This module runs in both the isolated viewer window and its worker.
// PDF.js also uses the upsert proposal to cache render state. Calling the
// intrinsic Map methods preserves cached undefined values and reentrant writes.
// https://tc39.es/proposal-upsert/#sec-map.prototype.getOrInsertComputed
if (typeof Map.prototype.getOrInsertComputed !== "function") {
  const { has, get, set } = Map.prototype;
  Object.defineProperty(Map.prototype, "getOrInsertComputed", {
    configurable: true,
    writable: true,
    value(key, callback) {
      const present = has.call(this, key);
      if (typeof callback !== "function") throw new TypeError("The cache initializer must be a function");
      if (present) return get.call(this, key);
      const value = callback(key === 0 ? 0 : key);
      set.call(this, key, value);
      return value;
    }
  });
}

if (typeof WeakMap.prototype.getOrInsertComputed !== "function") {
  const { has, get, set } = WeakMap.prototype;
  Object.defineProperty(WeakMap.prototype, "getOrInsertComputed", {
    configurable: true,
    writable: true,
    value(key, callback) {
      const present = has.call(this, key);
      // Let the native runtime decide which keys can be held weakly, including
      // symbols in browsers that support them, without changing this cache.
      set.call(new WeakMap(), key, null);
      if (typeof callback !== "function") throw new TypeError("The cache initializer must be a function");
      if (present) return get.call(this, key);
      const value = callback(key);
      set.call(this, key, value);
      return value;
    }
  });
}

if (typeof Promise.withResolvers !== "function") {
  Promise.withResolvers = () => {
    let resolve;
    let reject;
    const promise = new Promise((promiseResolve, promiseReject) => {
      resolve = promiseResolve;
      reject = promiseReject;
    });
    return { promise, resolve, reject };
  };
}

if (typeof Promise.try !== "function") {
  Promise.try = (callback, ...args) => new Promise((resolve) => resolve(callback(...args)));
}

if (typeof Uint8Array.prototype.toHex !== "function") {
  Object.defineProperty(Uint8Array.prototype, "toHex", {
    configurable: true,
    value() { return [...this].map((byte) => byte.toString(16).padStart(2, "0")).join(""); }
  });
}

if (typeof Uint8Array.fromBase64 !== "function") {
  Object.defineProperty(Uint8Array, "fromBase64", {
    configurable: true,
    value(value) {
      const binary = atob(String(value));
      return Uint8Array.from(binary, (character) => character.charCodeAt(0));
    }
  });
}

if (typeof Uint8Array.prototype.toBase64 !== "function") {
  Object.defineProperty(Uint8Array.prototype, "toBase64", {
    configurable: true,
    value() {
      let binary = "";
      for (let offset = 0; offset < this.length; offset += 0x8000) {
        binary += String.fromCharCode(...this.subarray(offset, offset + 0x8000));
      }
      return btoa(binary);
    }
  });
}

if (typeof URL.parse !== "function") {
  URL.parse = (value, base) => {
    try { return new URL(value, base); }
    catch { return null; }
  };
}

if (typeof Math.sumPrecise !== "function") {
  Math.sumPrecise = (values) => {
    let sum = 0;
    let correction = 0;
    for (const value of values) {
      const next = sum + value;
      correction += Math.abs(sum) >= Math.abs(value) ? sum - next + value : value - next + sum;
      sum = next;
    }
    return sum + correction;
  };
}

if (typeof Set.prototype.intersection !== "function") {
  Object.defineProperty(Set.prototype, "intersection", {
    configurable: true,
    value(other) { return new Set([...this].filter((value) => other.has(value))); }
  });
}

if (typeof ArrayBuffer.prototype.transferToFixedLength !== "function") {
  Object.defineProperty(ArrayBuffer.prototype, "transferToFixedLength", {
    configurable: true,
    value(length = this.byteLength) { return this.slice(0, length); }
  });
}

if (typeof AbortSignal !== "undefined" && typeof AbortSignal.any !== "function") {
  AbortSignal.any = (signals) => {
    const controller = new AbortController();
    const abort = (signal) => controller.abort(signal.reason);
    for (const signal of signals) {
      if (signal.aborted) {
        abort(signal);
        break;
      }
      signal.addEventListener("abort", () => abort(signal), { once: true });
    }
    return controller.signal;
  };
}

if (typeof ReadableStream !== "undefined") {
  if (typeof ReadableStream.prototype.values !== "function") {
    Object.defineProperty(ReadableStream.prototype, "values", {
      configurable: true,
      writable: true,
      async *value({ preventCancel = false } = {}) {
        const reader = this.getReader();
        let completed = false;
        try {
          while (true) {
            const result = await reader.read();
            if (result.done) {
              completed = true;
              return;
            }
            yield result.value;
          }
        } finally {
          try {
            if (!completed && !preventCancel) await reader.cancel();
          } finally {
            reader.releaseLock();
          }
        }
      }
    });
  }
  if (typeof ReadableStream.prototype[Symbol.asyncIterator] !== "function") {
    Object.defineProperty(ReadableStream.prototype, Symbol.asyncIterator, {
      configurable: true,
      writable: true,
      value() { return this.values(); }
    });
  }
}

if (typeof Response !== "undefined" && typeof Response.prototype.bytes !== "function") {
  Object.defineProperty(Response.prototype, "bytes", {
    configurable: true,
    value() { return this.arrayBuffer().then((buffer) => new Uint8Array(buffer)); }
  });
}
