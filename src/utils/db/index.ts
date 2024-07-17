import low from './lowdb';
import LocalStorage from './LocalStorage.ts';

const adapter = new LocalStorage(`myStroage`);
const _db = low(adapter);
_db.defaults({ sys: {}, database: {} }).write();
const db = _db;
export default db;
