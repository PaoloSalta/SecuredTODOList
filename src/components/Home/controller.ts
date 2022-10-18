import {Container} from 'typedi';
import {WebSQLDatabase} from 'expo-sqlite/src/SQLite.types';
import {DI_DB_KEY} from '../../utils/database';
import {Item} from './model';
import {SQLResultSet} from 'expo-sqlite';

class ItemController {
  static async fetchItems() {
    let items: Item[] = [];
    try {
      const result = await this.execSQLCommand('SELECT * FROM items;');
      items = result.rows._array.map(i => ({
        id: i.id,
        description: i.description,
      }));
    } catch (err) {
      console.log(err);
    }
    return items;
  }

  static async createItem(input: string) {
    const query = `INSERT INTO items (description) VALUES ('${input}');`;
    return this.execSQLCommand(query);
  }

  static async updateItem(id: number, description: string) {
    const query = `UPDATE items SET description = '${description}' WHERE id = ${id};`;
    return this.execSQLCommand(query);
  }

  static async deleteItem(id: number) {
    const query = `DELETE FROM items WHERE id = ${id};`;
    return this.execSQLCommand(query);
  }

  private static async execSQLCommand(command: string): Promise<SQLResultSet> {
    const db = Container.get<WebSQLDatabase>(DI_DB_KEY);
    console.log(`Executing: ${command}`);

    return new Promise((resolve, reject) => {
      db.transaction(tx => {
        tx.executeSql(
          command,
          [],
          (_, resultSet) => {
            resolve(resultSet);
          },
          (transact, err) => {
            console.log('Error during command execution', err);
            reject(err);
            return false;
          },
        );
      });
    });
  }
}

export default ItemController;
