import sqlite3 from 'sqlite3';

const sqlite3Client = sqlite3.verbose();
const db = new sqlite3Client.Database(':memory:');

export default db;