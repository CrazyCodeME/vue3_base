class LocalStorage {
  constructor(source, opts = {}) {
    this.source = source;
    this.defaultValue = opts.defaultValue || {};
    this.serialize = opts.serialize || JSON.stringify;
    this.deserialize = opts.deserialize || JSON.parse;
  }
  read() {
    const data = localStorage.getItem(this.source);
    if (data) {
      return this.deserialize(data);
    } else {
      localStorage.setItem(this.source, this.serialize(this.defaultValue));
      return this.defaultValue;
    }
  }

  write(data) {
    localStorage.setItem(this.source, this.serialize(data));
  }
}

export default LocalStorage;
