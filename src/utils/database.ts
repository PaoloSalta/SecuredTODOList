import * as SQLite from 'expo-sqlite';
import {Container} from 'typedi';
import {WebSQLDatabase} from 'expo-sqlite/src/SQLite.types';

export const DI_DB_KEY = 'SQLLite';

export function createDatabase(name: string) {
  const db = SQLite.openDatabase(`${name}.db`);
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT NOT NULL UNIQUE);',
    );
  });
  Container.set<WebSQLDatabase>(DI_DB_KEY, db);
}
