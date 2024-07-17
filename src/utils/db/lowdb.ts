import pathval from './pathval';
function isPromise(value: any): value is Promise<any> {
  // 这里需要一个isPromise的实现，由于原代码中没有给出，我提供了一个简单的实现
  return value && typeof value.then === 'function';
}
class Lowdb {
  constructor(adapter) {
    if (typeof adapter !== 'object') {
      throw new Error('An adapter must be provided');
    }
    this.adapter = adapter;
    this.__wrapped__ = '';
    this.__value__ = '';
  }
  get data() {
    return this.__wrapped__;
  }
  getState() {
    return this.__wrapped__;
  }
  setState(state) {
    this.__wrapped__ = state;
    return this;
  }
  defaults(val) {
    if (this.__wrapped__) {
      return this;
    }
    return this.setState(val);
  }
  set(key, value) {
    pathval.set(this.__wrapped__, key, value);
    return this;
  }
  get(key) {
    this.__value__ = pathval.get(this.__wrapped__, key);
    return this;
  }
  has(key) {
    return pathval.has(this.__wrapped__, key);
  }
  del(key) {
    pathval.set(this.__wrapped__, key, '');
    return this;
  }
  value() {
    return this.__value__;
  }
  read() {
    const r = this.adapter.read();
    if (isPromise(r)) {
      return r.then(function (ret) {
        return this.setState(ret);
      });
    } else {
      return this.setState(r);
    }
  }
  write() {
    const w = this.adapter.write(this.getState());
    if (isPromise(w)) {
      return w;
    } else {
      return true;
    }
  }
}

export default function (adapter) {
  const instance = new Lowdb(adapter);
  return instance.read();
}
